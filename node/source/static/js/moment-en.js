moment.lang("my-en", {
    week: {
        dow: 1,
        doy: 7
    },

    weekdays : function (m) {
        var day = m.day();
        if (!m._isUTC)
        {
            day += m._lang._week.dow;
            if (day > 6)
                day -= 6;
        }
        return m._lang._weekdays[day];
    },

    weekdaysShort : function (m) {
        var day = m.day();
        if (!m._isUTC)
        {
            day += m._lang._week.dow;
            if (day > 6)
                day -= 6;
        }
        return m._lang._weekdaysShort[day];
    },

    weekdaysMin : function (m) {
        var day = m.day();
        if (!m._isUTC)
        {
            day += m._lang._week.dow;
            if (day > 6)
                day -= 6;
        }
        return m._lang._weekdaysMin[day];
    }
});