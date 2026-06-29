BIACore.define('BIACore.Date', {
    /**
     * Date interval constant
     * @type String
     */
    MILLI: "ms",

    /**
     * Date interval constant
     * @type String
     */
    SECOND: "s",

    /**
     * Date interval constant
     * @type String
     */
    MINUTE: "mi",

    /**
     * Date interval constant
     * @type String
     */
    HOUR: "h",

    /**
     * Date interval constant
     * @type String
     */
    DAY: "d",

    /**
     * Date interval constant
     * @type String
     */
    MONTH: "mo",

    /**
     * Date interval constant
     * @type String
     */
    YEAR: "y",

    /**
     * Duplicate the given date.
     *
     * @param {Date} date the date to duplicate
     * @return {Date} a new copy of the given date
     */
    clone: function (date) {
        return new Date(date.getTime());
    },

    getFirstDateOfMonth: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    /**
     * Determine if the given item is a date.
     *
     * @param {Object} obj the object to check
     * @return {Boolean} true if the given object is a Date object
     * @deprecated 1.0.0 Use {@link BIACore#isDate} instead
     */
    is: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    },

    /**
     * Determine if the given date is a leap year.
     *
     * @param {Date} date the date to check
     * @return {Boolean} true if the given date is a leap year
     */
    isLeapYear: function (date) {
        var year = date.getFullYear();
        return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    },

    /**
     * Returns a new date object that represents now.
     *
     * @return {Date} Now.
     */
    now: Date.now || function () {
        return +new Date();
    }
}, function (me) {
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    BIACore.apply(me, {
        // add the given value for the given interval to a new datetime object
        // and return it
        add: function (date, interval, value) {
            var d = me.clone(date),
                day, decimalValue, base = 0;

            if (!interval || value === 0) {
                return d;
            }

            decimalValue = value - BIACore.Number.from(value, 10);
            value = BIACore.Number.from(value, 10);

            if (value) {
                switch (interval.toLowerCase()) {
                    case me.MILLI:
                        d.setTime(d.getTime() + value);
                        break;
                    case me.SECOND:
                        d.setTime(d.getTime() + value * 1000);
                        break;
                    case me.MINUTE:
                        d.setTime(d.getTime() + value * 60 * 1000);
                        break;
                    case me.HOUR:
                        d.setTime(d.getTime() + value * 60 * 60 * 1000);
                        break;
                    case me.DAY:
                        d.setDate(d.getDate() + value);
                        break;
                    case me.MONTH:
                        day = date.getDate();
                        if (day > 28) {
                            day = Math.min(day, me.getLastDateOfMonth(me.add(me.getFirstDateOfMonth(date), me.MONTH, value)).getDate());
                        }
                        d.setDate(day);
                        d.setMonth(date.getMonth() + value);
                        break;
                    case me.YEAR:
                        day = date.getDate();
                        if (day > 28) {
                            day = Math.min(day, me.getLastDateOfMonth(me.add(me.getFirstDateOfMonth(date), me.YEAR, value)).getDate());
                        }
                        d.setDate(day);
                        d.setFullYear(date.getFullYear() + value);
                        break;
                }
            }

            if (decimalValue) {
                switch (interval.toLowerCase()) {
                    case me.MILLI: base = 1; break;
                    case me.SECOND: base = 1000; break;
                    case me.MINUTE: base = 1000 * 60; break;
                    case me.HOUR: base = 1000 * 60 * 60; break;
                    case me.DAY: base = 1000 * 60 * 60 * 24; break;

                    case me.MONTH:
                        day = me.getDaysInMonth(d);
                        base = 1000 * 60 * 60 * 24 * day;
                        break;

                    case me.YEAR:
                        day = (me.isLeapYear(d) ? 366 : 365);
                        base = 1000 * 60 * 60 * 24 * day;
                        break;
                }
                if (base) {
                    d.setTime(d.getTime() + base * decimalValue);
                }
            }

            return d;
        },

        getDaysInMonth: function (date) {
            var m = date.getMonth();

            return m === 1 && me.isLeapYear(date) ? 29 : daysInMonth[m];
        },

        getLastDateOfMonth: function (date) {
            return new Date(date.getFullYear(), date.getMonth(), me.getDaysInMonth(date));
        },

        toString: function (date) {
            var pad = BIACore.String.leftPad;

            return me.is(date) ? date.getFullYear() + "-"
                + pad(date.getMonth() + 1, 2, '0') + "-"
                + pad(date.getDate(), 2, '0') + "T"
                + pad(date.getHours(), 2, '0') + ":"
                + pad(date.getMinutes(), 2, '0') + ":"
                + pad(date.getSeconds(), 2, '0') : '';
        }
    });
});
