// Generated from porter.sbl by Snowball 3.0.1 - https://snowballstem.org/

/**@constructor*/
var PorterStemmer = function() {
    var base = new BaseStemmer();

    /** @const */ var a_0 = [
        ["s", -1, 3],
        ["ies", 0, 2],
        ["sses", 0, 1],
        ["ss", 0, -1]
    ];

    /** @const */ var a_1 = [
        ["", -1, 3],
        ["bb", 0, 2],
        ["dd", 0, 2],
        ["ff", 0, 2],
        ["gg", 0, 2],
        ["bl", 0, 1],
        ["mm", 0, 2],
        ["nn", 0, 2],
        ["pp", 0, 2],
        ["rr", 0, 2],
        ["at", 0, 1],
        ["tt", 0, 2],
        ["iz", 0, 1]
    ];

    /** @const */ var a_2 = [
        ["ed", -1, 2],
        ["eed", 0, 1],
        ["ing", -1, 2]
    ];

    /** @const */ var a_3 = [
        ["anci", -1, 3],
        ["enci", -1, 2],
        ["abli", -1, 4],
        ["eli", -1, 6],
        ["alli", -1, 9],
        ["ousli", -1, 11],
        ["entli", -1, 5],
        ["aliti", -1, 9],
        ["biliti", -1, 13],
        ["iviti", -1, 12],
        ["tional", -1, 1],
        ["ational", 10, 8],
        ["alism", -1, 9],
        ["ation", -1, 8],
        ["ization", 13, 7],
        ["izer", -1, 7],
        ["ator", -1, 8],
        ["iveness", -1, 12],
        ["fulness", -1, 10],
        ["ousness", -1, 11]
    ];

    /** @const */ var a_4 = [
        ["icate", -1, 2],
        ["ative", -1, 3],
        ["alize", -1, 1],
        ["iciti", -1, 2],
        ["ical", -1, 2],
        ["ful", -1, 3],
        ["ness", -1, 3]
    ];

    /** @const */ var a_5 = [
        ["ic", -1, 1],
        ["ance", -1, 1],
        ["ence", -1, 1],
        ["able", -1, 1],
        ["ible", -1, 1],
        ["ate", -1, 1],
        ["ive", -1, 1],
        ["ize", -1, 1],
        ["iti", -1, 1],
        ["al", -1, 1],
        ["ism", -1, 1],
        ["ion", -1, 2],
        ["er", -1, 1],
        ["ous", -1, 1],
        ["ant", -1, 1],
        ["ent", -1, 1],
        ["ment", 15, 1],
        ["ement", 16, 1],
        ["ou", -1, 1]
    ];

    /** @const */ var /** Array<int> */ g_v = [17, 65, 16, 1];

    /** @const */ var /** Array<int> */ g_v_WXY = [1, 17, 65, 208, 1];

    var /** boolean */ B_Y_found = false;
    var /** number */ I_p2 = 0;
    var /** number */ I_p1 = 0;


    /** @return {boolean} */
    function r_shortv() {
        if (!(base.out_grouping_b(g_v_WXY, 89, 121)))
        {
            return false;
        }
        if (!(base.in_grouping_b(g_v, 97, 121)))
        {
            return false;
        }
        if (!(base.out_grouping_b(g_v, 97, 121)))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_R1() {
        return I_p1 <= base.cursor;
    };

    /** @return {boolean} */
    function r_R2() {
        return I_p2 <= base.cursor;
    };

    /** @return {boolean} */
    function r_Step_1a() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_0);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!base.slice_from("ss"))
                {
                    return false;
                }
                break;
            case 2:
                if (!base.slice_from("i"))
                {
                    return false;
                }
                break;
            case 3:
                if (!base.slice_del())
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Step_1b() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_2);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!r_R1())
                {
                    return false;
                }
                if (!base.slice_from("ee"))
                {
                    return false;
                }
                break;
            case 2:
                /** @const */ var /** number */ v_1 = base.limit - base.cursor;
                if (!base.go_out_grouping_b(g_v, 97, 121))
                {
                    return false;
                }
                base.cursor--;
                base.cursor = base.limit - v_1;
                if (!base.slice_del())
                {
                    return false;
                }
                /** @const */ var /** number */ v_2 = base.limit - base.cursor;
                among_var = base.find_among_b(a_1);
                base.cursor = base.limit - v_2;
                switch (among_var) {
                    case 1:
                        {
                            /** @const */ var /** number */ c1 = base.cursor;
                            base.insert(base.cursor, base.cursor, "e");
                            base.cursor = c1;
                        }
                        break;
                    case 2:
                        base.ket = base.cursor;
                        if (base.cursor <= base.limit_backward)
                        {
                            return false;
                        }
                        base.cursor--;
                        base.bra = base.cursor;
                        if (!base.slice_del())
                        {
                            return false;
                        }
                        break;
                    case 3:
                        if (base.cursor != I_p1)
                        {
                            return false;
                        }
                        /** @const */ var /** number */ v_3 = base.limit - base.cursor;
                        if (!r_shortv())
                        {
                            return false;
                        }
                        base.cursor = base.limit - v_3;
                        {
                            /** @const */ var /** number */ c2 = base.cursor;
                            base.insert(base.cursor, base.cursor, "e");
                            base.cursor = c2;
                        }
                        break;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Step_1c() {
        base.ket = base.cursor;
        lab0: {
            /** @const */ var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                if (!(base.eq_s_b("y")))
                {
                    break lab1;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            if (!(base.eq_s_b("Y")))
            {
                return false;
            }
        }
        base.bra = base.cursor;
        if (!base.go_out_grouping_b(g_v, 97, 121))
        {
            return false;
        }
        base.cursor--;
        if (!base.slice_from("i"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Step_2() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_3);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!r_R1())
        {
            return false;
        }
        switch (among_var) {
            case 1:
                if (!base.slice_from("tion"))
                {
                    return false;
                }
                break;
            case 2:
                if (!base.slice_from("ence"))
                {
                    return false;
                }
                break;
            case 3:
                if (!base.slice_from("ance"))
                {
                    return false;
                }
                break;
            case 4:
                if (!base.slice_from("able"))
                {
                    return false;
                }
                break;
            case 5:
                if (!base.slice_from("ent"))
                {
                    return false;
                }
                break;
            case 6:
                if (!base.slice_from("e"))
                {
                    return false;
                }
                break;
            case 7:
                if (!base.slice_from("ize"))
                {
                    return false;
                }
                break;
            case 8:
                if (!base.slice_from("ate"))
                {
                    return false;
                }
                break;
            case 9:
                if (!base.slice_from("al"))
                {
                    return false;
                }
                break;
            case 10:
                if (!base.slice_from("ful"))
                {
                    return false;
                }
                break;
            case 11:
                if (!base.slice_from("ous"))
                {
                    return false;
                }
                break;
            case 12:
                if (!base.slice_from("ive"))
                {
                    return false;
                }
                break;
            case 13:
                if (!base.slice_from("ble"))
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Step_3() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_4);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!r_R1())
        {
            return false;
        }
        switch (among_var) {
            case 1:
                if (!base.slice_from("al"))
                {
                    return false;
                }
                break;
            case 2:
                if (!base.slice_from("ic"))
                {
                    return false;
                }
                break;
            case 3:
                if (!base.slice_del())
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Step_4() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_5);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!r_R2())
        {
            return false;
        }
        switch (among_var) {
            case 1:
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                lab0: {
                    /** @const */ var /** number */ v_1 = base.limit - base.cursor;
                    lab1: {
                        if (!(base.eq_s_b("s")))
                        {
                            break lab1;
                        }
                        break lab0;
                    }
                    base.cursor = base.limit - v_1;
                    if (!(base.eq_s_b("t")))
                    {
                        return false;
                    }
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Step_5a() {
        base.ket = base.cursor;
        if (!(base.eq_s_b("e")))
        {
            return false;
        }
        base.bra = base.cursor;
        lab0: {
            lab1: {
                if (!r_R2())
                {
                    break lab1;
                }
                break lab0;
            }
            if (!r_R1())
            {
                return false;
            }
            {
                /** @const */ var /** number */ v_1 = base.limit - base.cursor;
                lab2: {
                    if (!r_shortv())
                    {
                        break lab2;
                    }
                    return false;
                }
                base.cursor = base.limit - v_1;
            }
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Step_5b() {
        base.ket = base.cursor;
        if (!(base.eq_s_b("l")))
        {
            return false;
        }
        base.bra = base.cursor;
        if (!r_R2())
        {
            return false;
        }
        if (!(base.eq_s_b("l")))
        {
            return false;
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    this.stem = /** @return {boolean} */ function() {
        B_Y_found = false;
        /** @const */ var /** number */ v_1 = base.cursor;
        lab0: {
            base.bra = base.cursor;
            if (!(base.eq_s("y")))
            {
                break lab0;
            }
            base.ket = base.cursor;
            if (!base.slice_from("Y"))
            {
                return false;
            }
            B_Y_found = true;
        }
        base.cursor = v_1;
        /** @const */ var /** number */ v_2 = base.cursor;
        lab1: {
            while(true)
            {
                /** @const */ var /** number */ v_3 = base.cursor;
                lab2: {
                    golab3: while(true)
                    {
                        /** @const */ var /** number */ v_4 = base.cursor;
                        lab4: {
                            if (!(base.in_grouping(g_v, 97, 121)))
                            {
                                break lab4;
                            }
                            base.bra = base.cursor;
                            if (!(base.eq_s("y")))
                            {
                                break lab4;
                            }
                            base.ket = base.cursor;
                            base.cursor = v_4;
                            break golab3;
                        }
                        base.cursor = v_4;
                        if (base.cursor >= base.limit)
                        {
                            break lab2;
                        }
                        base.cursor++;
                    }
                    if (!base.slice_from("Y"))
                    {
                        return false;
                    }
                    B_Y_found = true;
                    continue;
                }
                base.cursor = v_3;
                break;
            }
        }
        base.cursor = v_2;
        I_p1 = base.limit;
        I_p2 = base.limit;
        /** @const */ var /** number */ v_5 = base.cursor;
        lab5: {
            if (!base.go_out_grouping(g_v, 97, 121))
            {
                break lab5;
            }
            base.cursor++;
            if (!base.go_in_grouping(g_v, 97, 121))
            {
                break lab5;
            }
            base.cursor++;
            I_p1 = base.cursor;
            if (!base.go_out_grouping(g_v, 97, 121))
            {
                break lab5;
            }
            base.cursor++;
            if (!base.go_in_grouping(g_v, 97, 121))
            {
                break lab5;
            }
            base.cursor++;
            I_p2 = base.cursor;
        }
        base.cursor = v_5;
        base.limit_backward = base.cursor; base.cursor = base.limit;
        /** @const */ var /** number */ v_6 = base.limit - base.cursor;
        r_Step_1a();
        base.cursor = base.limit - v_6;
        /** @const */ var /** number */ v_7 = base.limit - base.cursor;
        r_Step_1b();
        base.cursor = base.limit - v_7;
        /** @const */ var /** number */ v_8 = base.limit - base.cursor;
        r_Step_1c();
        base.cursor = base.limit - v_8;
        /** @const */ var /** number */ v_9 = base.limit - base.cursor;
        r_Step_2();
        base.cursor = base.limit - v_9;
        /** @const */ var /** number */ v_10 = base.limit - base.cursor;
        r_Step_3();
        base.cursor = base.limit - v_10;
        /** @const */ var /** number */ v_11 = base.limit - base.cursor;
        r_Step_4();
        base.cursor = base.limit - v_11;
        /** @const */ var /** number */ v_12 = base.limit - base.cursor;
        r_Step_5a();
        base.cursor = base.limit - v_12;
        /** @const */ var /** number */ v_13 = base.limit - base.cursor;
        r_Step_5b();
        base.cursor = base.limit - v_13;
        base.cursor = base.limit_backward;
        /** @const */ var /** number */ v_14 = base.cursor;
        lab6: {
            if (!B_Y_found)
            {
                break lab6;
            }
            while(true)
            {
                /** @const */ var /** number */ v_15 = base.cursor;
                lab7: {
                    golab8: while(true)
                    {
                        /** @const */ var /** number */ v_16 = base.cursor;
                        lab9: {
                            base.bra = base.cursor;
                            if (!(base.eq_s("Y")))
                            {
                                break lab9;
                            }
                            base.ket = base.cursor;
                            base.cursor = v_16;
                            break golab8;
                        }
                        base.cursor = v_16;
                        if (base.cursor >= base.limit)
                        {
                            break lab7;
                        }
                        base.cursor++;
                    }
                    if (!base.slice_from("y"))
                    {
                        return false;
                    }
                    continue;
                }
                base.cursor = v_15;
                break;
            }
        }
        base.cursor = v_14;
        return true;
    };

    /**@return{string}*/
    this['stemWord'] = function(/**string*/word) {
        base.setCurrent(word);
        this.stem();
        return base.getCurrent();
    };
};
