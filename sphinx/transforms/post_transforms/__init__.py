"""Docutils transforms used by Sphinx."""

from __future__ import annotations

import re
from itertools import starmap
from typing import TYPE_CHECKING, cast

from docutils import nodes

from sphinx import addnodes
from sphinx.errors import NoUri
from sphinx.locale import __
from sphinx.transforms import SphinxTransform
from sphinx.util import logging
from sphinx.util.docutils import SphinxTranslator
from sphinx.util.nodes import find_pending_xref_condition, process_only_nodes

if TYPE_CHECKING:
    from collections.abc import Sequence
    from typing import Any

    from docutils.nodes import Element, Node

    from sphinx.addnodes import pending_xref
    from sphinx.application import Sphinx
    from sphinx.domains import Domain
    from sphinx.util.typing import ExtensionMetadata

logger = logging.getLogger(__name__)


class SphinxPostTransform(SphinxTransform):
    """A base class of post-transforms.

    Post transforms are invoked to modify the document to restructure it for outputting.
    They resolve references, convert images, do special transformation for each output
    formats and so on.  This class helps to implement these post transforms.
    """

    builders: tuple[str, ...] = ()
    formats: tuple[str, ...] = ()

    def apply(self, **kwargs: Any) -> None:
        if self.is_supported():
            self.run(**kwargs)

    def is_supported(self) -> bool:
        """Check this transform working for current builder."""
        if self.builders and self.env._builder_cls.name not in self.builders:
            return False
        return not self.formats or self.env._builder_cls.format in self.formats

    def run(self, **kwargs: Any) -> None:
        """Main method of post transforms.

        Subclasses should override this method instead of ``apply()``.
        """
        raise NotImplementedError


class ReferencesResolver(SphinxPostTransform):
    """Resolves cross-references on doctrees."""

    default_priority = 10

    def run(self, **kwargs: Any) -> None:
        for node in self.document.findall(addnodes.pending_xref):
            content = self.find_pending_xref_condition(node, ('resolved', '*'))
            if content:
                contnode = cast('Element', content[0].deepcopy())
            else:
                contnode = cast('Element', node[0].deepcopy())

            new_node = self._resolve_pending_xref(node, contnode)
            if new_node:
                new_nodes: list[Node] = [new_node]
            else:
                new_nodes = [contnode]
                if new_node is None and isinstance(
                    node[0], addnodes.pending_xref_condition
                ):
                    matched = self.find_pending_xref_condition(node, ('*',))
                    if matched:
                        new_nodes = matched
                    else:
                        msg = __(
                            'Could not determine the fallback text for the '
                            'cross-reference. Might be a bug.'
                        )
                        logger.warning(msg, location=node)

            node.replace_self(new_nodes)

    def _resolve_pending_xref(
        self, node: addnodes.pending_xref, contnode: Element
    ) -> nodes.reference | None:
        new_node: nodes.reference | None
        typ = node['reftype']
        target = node['reftarget']
        ref_doc = node.setdefault('refdoc', self.env.current_document.docname)
        ref_domain = node.get('refdomain', '')
        domain: Domain | None
        if ref_domain:
            try:
                domain = self.env.domains[ref_domain]
            except KeyError:
                return None
        else:
            domain = None

        try:
            new_node = self._resolve_pending_xref_in_domain(
                domain=domain,
                node=node,
                contnode=contnode,
                ref_doc=ref_doc,
                typ=typ,
                target=target,
            )
        except NoUri:
            return None
        if new_node is not None:
            return new_node

        try:
            # no new node found? try the missing-reference event
            new_node = self.env.events.emit_firstresult(
                'missing-reference',
                self.env,
                node,
                contnode,
                allowed_exceptions=(NoUri,),
            )
        except NoUri:
            return None
        if new_node is not None:
            return new_node

        # Is this a self-referential intersphinx reference?
        if 'intersphinx_self_referential' in node:
            del node.attributes['intersphinx_self_referential']
            try:
                new_node = self._resolve_pending_xref_in_domain(
                    domain=domain,
                    node=node,
                    contnode=contnode,
                    ref_doc=ref_doc,
                    typ=typ,
                    target=node['reftarget'],
                )
            except NoUri:
                return None
            if new_node is not None:
                return new_node

        # Still not found? Emit a warning if we are in nitpicky mode
        # or if the node wishes to be warned about.
        self.warn_missing_reference(ref_doc, typ, target, node, domain)
        return None

    def _resolve_pending_xref_in_domain(
        self,
        *,
        domain: Domain | None,
        node: addnodes.pending_xref,
        contnode: Element,
        ref_doc: str,
        typ: str,
        target: str,
    ) -> nodes.reference | None:
        builder = self.env._app.builder
        # let the domain try to resolve the reference
        if domain is not None:
            return domain.resolve_xref(
                self.env, ref_doc, builder, typ, target, node, contnode
            )

        # really hardwired reference types
        if typ == 'any':
            return self._resolve_pending_any_xref(
                node=node, contnode=contnode, ref_doc=ref_doc, target=target
            )

        return None

    def _resolve_pending_any_xref(
        self,
        *,
        node: addnodes.pending_xref,
        contnode: Element,
        ref_doc: str,
        target: str,
    ) -> nodes.reference | None:
        """Resolve reference generated by the "any" role."""
        env = self.env
        builder = self.env._app.builder
        domains = env.domains

        results: list[tuple[str, nodes.reference]] = []
        # first, try resolving as :doc:
        doc_ref = domains.standard_domain.resolve_xref(
            env, ref_doc, builder, 'doc', target, node, contnode
        )
        if doc_ref:
            results.append(('doc', doc_ref))
        # next, do the standard domain (makes this a priority)
        results += domains.standard_domain.resolve_any_xref(
            env, ref_doc, builder, target, node, contnode
        )
        for domain in domains.sorted():
            if domain.name == 'std':
                continue  # we did this one already
            try:
                results += domain.resolve_any_xref(
                    env, ref_doc, builder, target, node, contnode
                )
            except NotImplementedError:
                # the domain doesn't yet support the new interface
                # we have to manually collect possible references (SLOW)
                for role in domain.roles:
                    res = domain.resolve_xref(
                        env, ref_doc, builder, role, target, node, contnode
                    )
                    if res and len(res) > 0 and isinstance(res[0], nodes.Element):
                        results.append((f'{domain.name}:{role}', res))
        # now, see how many matches we got...
        if not results:
            return None
        if len(results) > 1:
            candidates = ' or '.join(starmap(self._stringify, results))
            msg = __(
                "more than one target found for 'any' cross-reference %r: could be %s"
            )
            logger.warning(
                msg, target, candidates, location=node, type='ref', subtype='any'
            )
        res_role, new_node = results[0]
        # Override "any" class with the actual role type to get the styling
        # approximately correct.
        res_domain = res_role.partition(':')[0]
        if (
            len(new_node) > 0
            and isinstance(new_node[0], nodes.Element)
            and new_node[0].get('classes')
        ):
            new_node[0]['classes'].extend((res_domain, res_role.replace(':', '-')))
        return new_node

    @staticmethod
    def _stringify(name: str, node: Element) -> str:
        reftitle = node.get('reftitle', node.astext())
        return f':{name}:`{reftitle}`'

    def warn_missing_reference(
        self,
        refdoc: str,
        typ: str,
        target: str,
        node: pending_xref,
        domain: Domain | None,
    ) -> None:
        warn = node.get('refwarn')
        if self.config.nitpicky:
            warn = True
            dtype = f'{domain.name}:{typ}' if domain else typ
            if self.config.nitpick_ignore:
                if (dtype, target) in self.config.nitpick_ignore:
                    warn = False
                # for "std" types also try without domain name
                if (
                    (not domain or domain.name == 'std')
                    and (typ, target) in self.config.nitpick_ignore
                ):  # fmt: skip
                    warn = False
            if self.config.nitpick_ignore_regex:
                if _matches_ignore(self.config.nitpick_ignore_regex, dtype, target):
                    warn = False
                # for "std" types also try without domain name
                if not domain or domain.name == 'std':
                    if _matches_ignore(self.config.nitpick_ignore_regex, typ, target):
                        warn = False
        if not warn:
            return

        if self.env.events.emit_firstresult('warn-missing-reference', domain, node):
            return
        elif domain and typ in domain.dangling_warnings:
            msg = domain.dangling_warnings[typ] % {'target': target}
        elif node.get('refdomain', 'std') not in {'', 'std'}:
            msg = __('%s:%s reference target not found: %s') % (
                node['refdomain'],
                typ,
                target,
            )
        else:
            msg = __('%r reference target not found: %s') % (typ, target)
        logger.warning(msg, location=node, type='ref', subtype=typ)

    def find_pending_xref_condition(
        self,
        node: pending_xref,
        conditions: Sequence[str],
    ) -> list[Node] | None:
        for condition in conditions:
            matched = find_pending_xref_condition(node, condition)
            if matched:
                return matched.children
        return None


def _matches_ignore(
    ignore_patterns: Sequence[tuple[str, str]], entry_type: str, entry_target: str
) -> bool:
    return any(
        (
            re.fullmatch(ignore_type, entry_type)
            and re.fullmatch(ignore_target, entry_target)
        )
        for ignore_type, ignore_target in ignore_patterns
    )


class OnlyNodeTransform(SphinxPostTransform):
    default_priority = 50

    def run(self, **kwargs: Any) -> None:
        # A comment on the comment() nodes being inserted: replacing by [] would
        # result in a "Losing ids" exception if there is a target node before
        # the only node, so we make sure docutils can transfer the id to
        # something, even if it's just a comment and will lose the id anyway...
        process_only_nodes(self.document, self.env._tags)


class SigElementFallbackTransform(SphinxPostTransform):
    """Fallback various desc_* nodes to inline if translator does not support them."""

    default_priority = 200

    def run(self, **kwargs: Any) -> None:
        def has_visitor(
            translator: type[nodes.NodeVisitor], node: type[Element]
        ) -> bool:
            return hasattr(translator, 'visit_%s' % node.__name__)

        try:
            translator = self.env._registry.get_translator_class(self.env._builder_cls)
        except AttributeError:
            # do nothing if no translator class is specified (e.g., on a dummy builder)
            return

        if issubclass(translator, SphinxTranslator):
            # subclass of SphinxTranslator supports desc_sig_element nodes automatically.
            return

        # for the leaf elements (desc_sig_element), the translator should support _all_,
        # unless there exists a generic visit_desc_sig_element default visitor
        if (
            not all(has_visitor(translator, node) for node in addnodes.SIG_ELEMENTS)
            and not has_visitor(translator, addnodes.desc_sig_element)
        ):  # fmt: skip
            self.fallback(addnodes.desc_sig_element)

        if not has_visitor(translator, addnodes.desc_inline):
            self.fallback(addnodes.desc_inline)

    def fallback(self, node_type: Any) -> None:
        """Translate nodes of type *node_type* to docutils inline nodes.

        The original node type name is stored as a string in a private
        ``_sig_node_type`` attribute if the latter did not exist.
        """
        for node in self.document.findall(node_type):
            newnode = nodes.inline()
            newnode.update_all_atts(node)
            newnode.extend(node)
            # Only set _sig_node_type if not defined by the user
            newnode.setdefault('_sig_node_type', node.tagname)
            node.replace_self(newnode)


class PropagateDescDomain(SphinxPostTransform):
    """Add the domain name of the parent node as a class in each desc_signature node."""

    default_priority = 200

    def run(self, **kwargs: Any) -> None:
        for node in self.document.findall(addnodes.desc_signature):
            if node.parent.get('domain'):
                node['classes'].append(node.parent['domain'])


def setup(app: Sphinx) -> ExtensionMetadata:
    app.add_post_transform(ReferencesResolver)
    app.add_post_transform(OnlyNodeTransform)
    app.add_post_transform(SigElementFallbackTransform)
    app.add_post_transform(PropagateDescDomain)

    return {
        'version': 'builtin',
        'parallel_read_safe': True,
        'parallel_write_safe': True,
    }
