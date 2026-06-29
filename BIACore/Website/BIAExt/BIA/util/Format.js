/**
 * Defines a bunch of {@link Ext.util.Format} formatters for Grids.
 */
Ext.define('BIA.util.Format', {
    singleton: true,

    /**
     * Base formatter
     * @param {String} format The destination format for the number
     * @param {Number} value The value to format
     * @param {Object} metaData the table cell information for this record
     * @returns {String} the formatted value or an empty string if it is unable to apply that format
     */
    number: function (format, value, metaData) {//, record, rowIndex, colIndex, store, view) {
        value = Ext.Number.from(value, NaN);
        if (isNaN(value)) {
            return '';
        } else if (metaData) {
            if (value === 0) { metaData.tdCls += ' Zero'; }
            else if (value < 0) { metaData.tdCls += ' Negative'; }
            return Ext.util.Format.number(value, format || '0,000');
        } else {
            var cls = '';
            if (value === 0) { cls = 'Zero'; }
            else if (value < 0) { cls = 'Negative'; }
            return '<span class="' + cls + '">' + Ext.util.Format.number(value, format || '0,000') + '</span>';
        }
    },

    /**
     * custom rendering function
     * use this when you want to define the renderer in the view, but not wrap the function umpteen times.
     * renderer: BIA.util.Chart.customRenderer('RenderFunction')
     * RenderFunction: function (sprite, record, attr, index, store) { }
     *
     * @param {String} custom the name of the function to call.
     * @returns {Function} the custom rendering function
     */
    customRenderer: function (custom) {
        return function (v, md, rec, row, col, store, view) {
            if (!this[custom]) {
                Ext.Error.raise("Invalid customRenderer defined, " + custom + " not found.");
            }
            return this[custom].call(this, v, md, rec, row, col, store, view);
            //return this[custom].apply(this, arguments);
        };
    },

    /**
     * Like {@link #customRenderer} for action columns.
     */
    customActionRenderer: function (custom) {
        return function (v, md, rec, row, col, store, view) {
            if (this.ownerCt && this.ownerCt.ownerCt && !this.ownerCt.ownerCt[custom]) {
                Ext.Error.raise("Invalid customActionRenderer defined, " + custom + " not found.");
            }
            return this.ownerCt.ownerCt[custom].call(this, v, md, rec, row, col, store, view);
        };
    },

    /**
     * Automatically converts the value to a javascript date and then applies the given format
     * @param {String} format the destination format
     * @returns {String} the formatted date
     */
    dateRenderer: function (format) {
        // < 0 is equivalent to a 'null' date, "Sun Dec 31 19:00:00 EST 1 B.C."
        return function (v) {
            if (!v || v < 0) { return ''; }
            else if (!Ext.isDate(v)) { v = Ext.Date.parse(v, 'c'); }

            return Ext.Date.dateFormat(v, format || Ext.Date.defaultFormat);
        };
    },

    /**
     * Treats the input string as a date, and then applies date formatting to the result.
     * @param {String} stringFormat the date parts available in the string
     * @param {String} dateFormat the destination date format
     */
    stringToDate: function (stringFormat, dateFormat) {
        return function (v) {
            v = Ext.Date.parse(v, stringFormat);
            return (v) ? Ext.Date.format(v, dateFormat) : '';
        };
    },

    /**
     * Takes a UTC date and converts to local time in format 'Mon 2/1/16 at 03:35PM'
     * @param {Date} value date object
     * @param {Object} metadata object for formatting
     */
    LocalDateTime: function LocalDateTime(value, metadata) {
        return value != null ? BIA.util.Format.ConvertDateTimeToLocal((Ext.isString(value) ? new Date(value) : value), false, false) : '';
    },

    /**
     * Takes a UTC date and converts to local time in format '02/01/16 03:35PM'
     * @param {Date} value date object
     * @param {Object} metadata object for formatting
     */
    ShortLocalDateTime: function ShortDateTime(value, metadata) {
        return value != null ? BIA.util.Format.ConvertDateTimeToLocal((Ext.isString(value) ? new Date(value) : value), false, false, true) : '';
    },

    /**
     * Takes a date and converts to format 'Mon 2/1/16 at 03:35PM'
     * @param {Date} value date object
     * @param {Object} metadata object for formatting
     */
    DateTime: function LocalDateTime(value, metadata) {
        return value != null ? BIA.util.Format.ConvertDateTimeToLocal((Ext.isString(value) ? new Date(value) : value), false, false, false, false) : '';
    },

    /**
     * Takes a date and converts to format '02/01/16 03:35PM'
     * @param {Date} value date object
     * @param {Object} metadata object for formatting
     */
    ShortDateTime: function ShortDateTime(value, metadata) {
        return value != null ? BIA.util.Format.ConvertDateTimeToLocal((Ext.isString(value) ? new Date(value) : value), false, false, true, false) : '';
    },

    /*
     * Takes a UTC date and converts to local time in format based on input:
     * (date, false, false, false)
     * normal version format:                      Mon 2/1/16 at 03:35PM
     * (date, true, false, false)
     * normal version format including timeSince:  Mon 2/1/16 at 03:35PM (3days 5hrs ago)
     * (date, false, true, false)
     * long version format:                        Mon Feb 1, 2015 at 03:35PM
     * (date, true, true, false)
     * long version format including timeSince:    Mon Feb 1, 2015 at 03:35PM (3days 5hrs ago)
     * (date, false, false, true)
     * short version format:                       02/01/16 03:35PM
     * (date, true, false, true)
     * short version format including timeSince:   02/01/16 03:35PM (3days 5 hrs ago)
     * 
     * @param {Date} value date object
     * @param {Boolean} flag for if include time since string to be appended to end of date string 
     * @param {Boolean} flag for long version string return format (will be over-ridden by next flag)
     * @param {Boolean} flag for short version string return format
     * @param {Boolean} flag for converting date from UTC to local
     * @param {Boolean} flag for including seconds in the time
     * @param {Boolean} flag for removing AMPM from format
     * @param {Boolean} flag for removing the time from format
    */
    ConvertDateTimeToLocal: function ConvertDateTimeToLocal(date, includeTimeSince, longVersion, shortVersion, doNotConvert, includeSeconds, removeAMPM, removeTime) {
        var timezoneDate = doNotConvert ? date : new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        //var timezoneDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        var convertedDateTime = '';
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (includeTimeSince) {
            var timeSinceDifThresholds = [1, 1000, (1000 * 60), (1000 * 60 * 60), (1000 * 60 * 60 * 24), (1000 * 60 * 60 * 24 * 7),
                                            (1000 * 60 * 60 * 24 * daysOfMonth[(new Date()).getMonth()]), (1000 * 60 * 60 * 24 * ((new Date()).getFullYear() % 4 == 0 ? 366 : 365))];
            var timeSinceDifNames = (longVersion ? ['ms', 'sec', 'min', 'hr', 'day', 'wk', 'mnth', 'yr'] : ['ms', 's', 'm', 'h', 'd', 'wk', 'mo', 'y']);
            var timeSince = Date.now() - timezoneDate.getTime();
            var timeSinceString = '';
            var thresholdMetIndex = 0;

            timeSinceDifThresholds.forEach(function (num, index, array) {
                if (Math.abs(timeSince) >= num) { thresholdMetIndex = index; }
                else { return false; }
            });

            var firstTimeSinceTruncatedValue = Math.floor(Math.abs(timeSince) / timeSinceDifThresholds[thresholdMetIndex]);

            timeSinceString = Math.abs(firstTimeSinceTruncatedValue) + '' + timeSinceDifNames[thresholdMetIndex]
                                + (Math.abs(firstTimeSinceTruncatedValue) > 1 && thresholdMetIndex > 0 && longVersion ? 's' : '');

            if (thresholdMetIndex > 0) {
                var timeSinceLeft = Math.abs(timeSince) - (firstTimeSinceTruncatedValue * timeSinceDifThresholds[thresholdMetIndex]);

                var secondTimeSinceTruncatedValue = Math.floor(timeSinceLeft / timeSinceDifThresholds[thresholdMetIndex - 1]);

                if (secondTimeSinceTruncatedValue > 0) {
                    timeSinceString += ' ' + Math.abs(secondTimeSinceTruncatedValue) + '' + timeSinceDifNames[thresholdMetIndex - 1]
                                        + (Math.abs(secondTimeSinceTruncatedValue) > 1 && thresholdMetIndex > 1 && longVersion ? 's' : '');
                }
            }
            if (timeSince < 0) timeSinceString = 'in ' + timeSinceString;
            else timeSinceString += ' ago';
        }
        var day = timezoneDate.getDate();
        var day2String = ('00' + timezoneDate.getDate()).slice(-2);
        var dayName = days[timezoneDate.getDay()];
        var month = (timezoneDate.getMonth() + 1);
        var month2String = ('00' + (timezoneDate.getMonth() + 1)).slice(-2);
        var monthName = months[timezoneDate.getMonth()];
        var year = timezoneDate.getFullYear();
        var year2String = timezoneDate.getFullYear().toString().substring(2)
        var yearNotThis = (timezoneDate.getFullYear() != (new Date()).getFullYear() ? timezoneDate.getFullYear() : '');
        var yearNotThis2String = (timezoneDate.getFullYear() != (new Date()).getFullYear() ? timezoneDate.getFullYear().toString().substring(2) : '');
        var hour = (timezoneDate.getHours() % 12 == 0 ? 12 : timezoneDate.getHours() % 12);
        var hour2String = ('00' + (timezoneDate.getHours() % 12 == 0 ? 12 : timezoneDate.getHours() % 12)).slice(-2);
        var min = timezoneDate.getMinutes();
        var min2String = ('00' + timezoneDate.getMinutes()).slice(-2);
        var sec = timezoneDate.getSeconds();
        var sec2String = ('00' + timezoneDate.getSeconds()).slice(-2);
        var AMPM = (timezoneDate.getHours() >= 12 ? 'PM' : 'AM');
        var timeSinceDisplay = (includeTimeSince ? ' (' + timeSinceString + ')' : '');

        convertedDateTime = dayName + ' ' + month + '/' + day + (yearNotThis2String != '' ? '/' + yearNotThis2String : '') +
                            (removeTime === true ? '' : ' at ' + hour + ':' + min2String + (includeSeconds ? sec2String : '') + (removeAMPM ? '' : AMPM) + timeSinceDisplay);
        if (longVersion) {
            convertedDateTime = dayName + ' ' + monthName + ' ' + day + (yearNotThis2String != '' ? ', ' + yearNotThis2String : '') +
                                (removeTime === true ? '' : ' at ' + hour + ':' + min2String + (includeSeconds ? sec2String : '') + (removeAMPM ? '' : AMPM) + timeSinceDisplay);
        }
        if (shortVersion) {
            convertedDateTime = month2String + '/' + day2String + '/' + year2String +
                (removeTime === true ? '' : ' ' + hour2String + ':' + min2String + (includeSeconds ? ':' + sec2String : '') + (removeAMPM ? '' : ' ' + AMPM) + timeSinceDisplay);
        }

        return convertedDateTime;
    }
}, function (format) {
    Ext.apply(format, {
        auto: function (v) { return v; },
        // manual formatting
        // Use this when you want to specify textual format without cell markup.
        // e.g. renderer: Util.format.numberRenderer('0000')
        numberRenderer: function (f) {
            return function (v, md, rec, row, col, store, view) {
                return format.number(f, v, md, rec, row, col, store, view);
            };
        },
        moneyRenderer: function (f) {
            return function (v, md, rec, row, col, store, view) {
                return format.number(f || '$0,000.00', v, md, rec, row, col, store, view);
            };
        },
        percentRenderer: function (f) {
            return function (v, md, rec, row, col, store, view) {
                return format.percent(f || '0.00%', v * 100, md, rec, row, col, store, view);
            };
        },
        switchRenderer: function (column) {
            // intended to define the format from a column in the row, e.g. data['Format']
            return function (v, md, rec, row, col, store, view) {
                var func = format[rec.data[column || 'Format']];
                return (func) ? func.call(this, v, md, rec, row, col, store, view) : v;
            };
        },
        // pre-defined markups
        // Use this when you want to use a pre-defined formatter including markup.
        // e.g. renderer: Util.format.money_0
        number_0: function (v, md, rec, row, col, store, view) { return format.number('0,000', v, md, rec, row, col, store, view); },
        number_1: function (v, md, rec, row, col, store, view) { return format.number('0,000.0', v, md, rec, row, col, store, view); },
        number_2: function (v, md, rec, row, col, store, view) { return format.number('0,000.00', v, md, rec, row, col, store, view); },
        money_0: function (v, md, rec, row, col, store, view) { return format.number('$0,000', v, md, rec, row, col, store, view); },
        money_2: function (v, md, rec, row, col, store, view) { return format.number('$0,000.00', v, md, rec, row, col, store, view); },
        percent_0: function (v, md, rec, row, col, store, view) { return format.number('0%', v * 100, md, rec, row, col, store, view); },
        percent_1: function (v, md, rec, row, col, store, view) { return format.number('0.0%', v * 100, md, rec, row, col, store, view); },
        percent_2: function (v, md, rec, row, col, store, view) { return format.number('0.00%', v * 100, md, rec, row, col, store, view); }
    });

    if (Ext.getVersion().major < 5) {
        Ext.apply(format, {
            /**
             * Like {@link #customRenderer} for summary rows.
             */
            customSummaryRenderer: function (custom) {
                if (Ext.getVersion().minor < 2) { // 4.1
                    return function (v, sd, f) {
                        return this.grid[custom].call(this, v, sd, f);
                    };
                } else { // 4.2+
                    return function (v, sd, f) {
                        return this[custom].call(this, v, sd, f);
                    };
                }
            },
            Snumber_0: function (v) { return format.number('0,000', v); },
            Snumber_1: function (v) { return format.number('0,000.0', v); },
            Snumber_2: function (v) { return format.number('0,000.00', v); },
            Smoney_0: function (v) { return format.number('$0,000', v); },
            Smoney_2: function (v) { return format.number('$0,000.00', v); },
            Spercent_0: function (v) { return format.number('0%', v * 100); },
            Spercent_1: function (v) { return format.number('0.0%', v * 100); },
            Spercent_2: function (v) { return format.number('0.00%', v * 100); },
            // because the summary system is retarded, add a text renderer.
            Stext: function (v) { return v; }
        });
    }
});