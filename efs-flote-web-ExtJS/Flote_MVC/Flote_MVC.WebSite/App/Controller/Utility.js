Ext.define('Utility.Formatting', {
    //By setting this class attribute you create an accessible Ext class that can be called and its functions can be accessed from anywhere in the app.
    //To use these functions you would make a call to Utility.Formatting.[FunctionName]([parameter1], [parameter2], etc);
    singleton: true,

    CanClickRenderer: function CanClickRenderer(value, metaData, record, rowIndex, colIndex, store, view) {
        try {
            var headerCt = this.getHeaderContainer(),
                column = headerCt.getHeaderAtIndex(colIndex);
            if (column.otherrenderer) value = column.otherrenderer(value, metaData);
            metaData.tdAttr += 'data-qtip="' + Ext.String.htmlEncode(column.hoverString) + '"';
        }
        catch (ex) { }
        metaData.style += "font-weight:bold; color:#157fcc; cursor:pointer;";
        return value
    },

    TimePeriodString: function TimePeriodString(value, metadata) {
        var v = value.toString();
        var year = v.substring(0, 4);
        var month = v.slice(-2);
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month - 1] + ' ' + year;
    },

    NumFormat_USCurrency_Thousands_2Decimals_RedNegative_GreenPositive: function NumFormat_USCurrency_Thousands_2Decimals_RedNegative_GreenPositive(value, metadata) {
        metadata.css = (value >= 0) ? "positiveNumber" : "negativeNumber";
        var formatString = "$" + "0,000.00";
        if (value < 0) formatString = "(" + formatString + ")";
        if (value < 0) value = value * -1;
        return Ext.util.Format.number(value, formatString);
    },

    NumFormat_0Decimals_Comma: function NumFormat_0Decimals_Comma(value, metadata) {
        var formatString = "0,000";
        return Ext.util.Format.number(value, formatString);
    },

    NumFormat_Thousands_0Decimals_RedNegative: function NumFormat_Thousands_0Decimals_RedNegative(value, metadata) {
        metadata.css = (value >= 0) ? "n" : "negativeNumber";
        var formatString = "0,000";
        if (value < 0) formatString = "(" + formatString + ")";
        if (value < 0) value = value * -1;
        return Ext.util.Format.number(value, formatString);
    },

    NumFormat_Thousands_1Decimals: function NumFormat_Thousands_1Decimals_RedNegative(value) {
        var formatString = "0,000.0";
        if (value < 0) formatString = "(" + formatString + ")";
        return Ext.util.Format.number(value, formatString);
    },

    NumFormat_Thousands_2Decimals: function NumFormat_Thousands_2Decimals_RedNegative(value) {
        var formatString = "0,000.00";
        if (value < 0) formatString = "(" + formatString + ")";
        return Ext.util.Format.number(value, formatString);
    },

    NumFormat_Thousands_2Decimals_RedNegative: function NumFormat_Thousands_2Decimals_RedNegative(value, metadata) {
        metadata.css = (value >= 0) ? "n" : "negativeNumber";
        var formatString = "0,000.00";
        if (value < 0) formatString = "(" + formatString + ")";
        return Ext.util.Format.number(value, formatString);
    },

    NumFormat_Thousands_3Decimals_RedNegative: function NumFormat_Thousands_3Decimals_RedNegative(value, metadata) {
        metadata.css = (value >= 0) ? "n" : "negativeNumber";
        var formatString = "0,000.000";
        if (value < 0) formatString = "(" + formatString + ")";
        return Ext.util.Format.number(value, formatString);
    },

    NumFormat_Tens_2Decimals_RedNegative: function NumFormat_Tens_2Decimals_RedNegative(value, metadata) {
        metadata.css = (value >= 0) ? "n" : "negativeNumber";
        return Ext.util.Format.number(value, "0.00");
    },

    NumFormat_Percent_1Decimals_RedNegative: function NumFormat_Percent_1Decimals_RedNegative(value, metadata) {
        metadata.css = (value >= 0) ? "n" : "negativeNumber";
        return Ext.util.Format.number(value, "0.0%");
    },

    NumFormat_Percent_1Decimals: function NumFormat_Percent_1Decimals(value, metadata) {
        return Ext.util.Format.number(value, "0.0%");
    },

    NumFormat_Percent_2Decimals: function NumFormat_Percent_2Decimals(value, metadata) {
        return Ext.util.Format.number(value, "0,0.00%");
    },

    DecimalFormat_Percent_2Decimals: function DecimalFormat_Percent_2Decimals(value, metadata) {
        return Ext.util.Format.number(value * 100, "0.00%");
    },

    NumFormat_USCurrency_Thousands_0Decimals: function NumFormat_USCurrency_Thousands_0Decimals(value, metadata) {
        return "$" + Ext.util.Format.number(value, "0,000");
    },
   
    NumFormat_USCurrency_Thousands_2Decimals: function NumFormat_USCurrency_Thousands_2Decimals(value, metadata) {
        return "$" + Ext.util.Format.number(value, "0,000.00");
    },

    NumFormat_USCurrency_0Decimals_RedNegative: function NumFormat_USCurrency_0Decimals_RedNegative(value, metadata) {
        metadata.css = (value >= 0) ? "n" : "negativeNumber";
        var formatString = "$" + "0,000";
        if (value < 0) value = value * -1;
        return Ext.util.Format.number(value, formatString);
    },

    NumFormat_USCurrency_2Decimals_RedNegative: function NumFormat_USCurrency_2Decimals_RedNegative(value, metadata) {
        metadata.css = (value >= 0) ? "n" : "negativeNumber";
        var formatString = "$" + "0,000.00";
        if (value < 0) formatString = "(" + formatString + ")";
        return Ext.util.Format.number(value, formatString);
    },

    NumFormat_Thousands_0Decimals_RedNegativePercent: function NumFormat_Thousands_0Decimals_RedNegativePercent(value, metadata) {
        metadata.css = (value >= 0) ? "n" : "negativeNumber";
        var formatString = "0,000.00" + "%";
        return Ext.util.Format.number(value, formatString);
    },

    RedNegative: function RedNegative(value, metadata) {
        if (parseFloat(value.replace(/[^0-9-.]/g, '')) >= 0) return value
        else return '<span style="color:red; font-size: 11pt">' + value + '</span>';
    },

    TruncatedNumberDisplay: function TruncatedNumberDisplay(number) {
        // Nine Zeroes for Billions
        var num = Math.abs(Number(number)) >= 1.0e+9
            ? Math.abs(Number(number)) / 1.0e+9
            : Math.abs(Number(number)) >= 1.0e+6
                ? Math.abs(Number(number)) / 1.0e+6
                : Math.abs(Number(number)) >= 1.0e+3
                    ? Math.abs(Number(number)) / 1.0e+3
                    : Math.abs(Number(number));
        return num.toString().substring(0, num.toString().indexOf('.') == -1 ? num.toString().length : num.toString().indexOf('.')) + (
            Math.abs(Number(number)) >= 1.0e+9
                ? 'B'
                : Math.abs(Number(number)) >= 1.0e+6
                    ? 'M'
                    : Math.abs(Number(number)) >= 1.0e+3
                        ? 'k'
                        : ''
        )
    },

    LocalDateTime: function LocalDateTime(value, metadata) {
        return value != null ? Utility.Formatting.ConvertDateTimeToLocal((Ext.isString(value) ? new Date(value) : value), false, false) : '';
    },

    ShortDateTime: function ShortDateTime(value, metadata) {
        return value != null ? Utility.Formatting.ConvertDateTimeToLocal((Ext.isString(value) ? new Date(value) : value), false, false, true) : '';
    },
    ConvertDateTimeToLocal: function ConvertDateTimeToLocal(date, includeTimeSince, longVersion, shortVersion) {
        date = Ext.isString(date) ? new Date(date) : date;
        var timezoneDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
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
                if (timeSince >= num) { thresholdMetIndex = index; }
                else { return false; }
            });

            var firstTimeSinceTruncatedValue = Math.floor(timeSince / timeSinceDifThresholds[thresholdMetIndex]);

            timeSinceString = firstTimeSinceTruncatedValue + '' + timeSinceDifNames[thresholdMetIndex]
                + (firstTimeSinceTruncatedValue > 1 && thresholdMetIndex > 0 && longVersion ? 's' : '');

            if (thresholdMetIndex > 0) {
                var timeSinceLeft = timeSince - (firstTimeSinceTruncatedValue * timeSinceDifThresholds[thresholdMetIndex]);

                var secondTimeSinceTruncatedValue = Math.floor(timeSinceLeft / timeSinceDifThresholds[thresholdMetIndex - 1]);

                if (secondTimeSinceTruncatedValue > 0) {
                    timeSinceString += ' ' + secondTimeSinceTruncatedValue + '' + timeSinceDifNames[thresholdMetIndex - 1]
                        + (secondTimeSinceTruncatedValue > 1 && thresholdMetIndex > 1 && longVersion ? 's' : '');
                }
            }
            timeSinceString += ' ago'
        }
        var day = timezoneDate.getDate();
        var day2String = ('00' + timezoneDate.getDate()).slice(-2);
        var dayName = days[timezoneDate.getDay()];
        var month = (timezoneDate.getMonth() + 1);
        var month2String = ('00' + (timezoneDate.getMonth() + 1)).slice(-2);
        var monthName = months[timezoneDate.getMonth()];
        var year2String = timezoneDate.getFullYear().toString().substring(2)
        var yearNotThis2String = (timezoneDate.getFullYear() != (new Date()).getFullYear() ? timezoneDate.getFullYear().toString().substring(2) : '');
        var hour = (timezoneDate.getHours() % 12 == 0 ? 12 : timezoneDate.getHours() % 12);
        var hour2String = ('00' + (timezoneDate.getHours() % 12 == 0 ? 12 : timezoneDate.getHours() % 12)).slice(-2);
        var min2String = ('00' + timezoneDate.getMinutes()).slice(-2);
        var AMPM = (timezoneDate.getHours() >= 12 ? 'PM' : 'AM');
        var timeSinceDisplay = (includeTimeSince ? ' (' + timeSinceString + ')' : '');

        convertedDateTime = dayName + ' ' + month + '/' + day + (yearNotThis2String != '' ? '/' + yearNotThis2String : '') +
            ' at ' + hour + ':' + min2String + AMPM + timeSinceDisplay;
        if (longVersion) {
            convertedDateTime = dayName + ' ' + monthName + ' ' + day + (yearNotThis2String != '' ? ', ' + yearNotThis2String : '') +
                ' at ' + hour + ':' + min2String + AMPM + timeSinceDisplay;
        }
        if (shortVersion) {
            convertedDateTime = month2String + '/' + day2String + '/' + year2String + ' ' + hour2String + ':' + min2String + AMPM + timeSinceDisplay;
        }

        return convertedDateTime;
    },
    SummaryBuyRenderer: function SummaryBuyRenderer(value, metaData, record, rowIdx, colIdx, store, view) {
        if (Ext.isNumber(record.get('Container_Alloc')) && !Ext.isNumber(record.get('invoice_detail_id')) && record.get('Container_Alloc') > 0) {
            metaData.innerCls = 'textBlueBold';
        } else if (Ext.isNumber(record.get('invoice_detail_id')) && record.get('invoice_detail_id') > 0) {
            metaData.innerCls = 'textBlackBold';
        } else if (Ext.isNumber(record.get('mbl_fk')) && record.get('mbl_fk') > 0) {
            metaData.innerCls = 'textBlackItalic';
        }
        if (record.get('rank') != 6) {
            value = Ext.String.htmlEncode(value);
            metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(Utility.Formatting.SummaryDetailRowTooltipString(record)) + '"';
            return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
        }
        else { return; }
    },
    SummaryTwoDecimalRenderer: function SummaryTwoDecimalRenderer(value, metaData, record, rowIdx, colIdx, store, view) {
        if (record.get('rank') != 6) {
            value = Ext.String.htmlEncode(value);
            metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(Utility.Formatting.SummaryDetailRowTooltipString(record)) + '"';
            return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
        }
        else { return; }
    },
    SummaryDetailsRenderer: function SummaryDetailsRenderer(value, metaData, record, rowIdx, colIdx, store, view) {
        value = Ext.String.htmlEncode(value);
        metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(Utility.Formatting.SummaryDetailRowTooltipString(record)) + '"';
        return value;
    },
    SummaryDetailRowTooltipString: function SummaryDetailRowTooltipString(record) {
        var value = 'First Name: ';
        if (Ext.isDefined(record.data.first_name)) {
            value = value + (!Ext.isEmpty(record.get('first_name')) ? record.get('first_name') : '');
        }
        value = value + ' </br> Last Name: ';
        if (Ext.isDefined(record.data.last_name)) {
            value = value + (!Ext.isEmpty(record.get('last_name')) ? record.get('last_name') : '');
        }
        value = value + ' </br> Posted User: ';
        if (Ext.isDefined(record.data.posted_user)) {
            value = value + (!Ext.isEmpty(record.get('posted_user')) ? record.get('posted_user') : '');
        }
        value = value + ' </br> Created Date: ';
        if (Ext.isDefined(record.data.create_date)) {
            value = value + (!Ext.isEmpty(record.get('create_date')) ? Ext.util.Format.date(record.get('create_date'), 'm/d/Y') : '');
        }

        return value;
    },
    LocationShipmentgridRenderedHtmlString: function LocationShipmentgridRenderedHtmlString(value, metaData) {
        value = Ext.String.htmlEncode(value);
        metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
        return value;
    }
});

Ext.define('Utility.Accessors', {
    singleton: true,

    BaseClassSearch: function BaseClassSearch(me, baseClassName) {
        var recursiveSearch = function (me, className) {
            if (me.$className == className) {
                return true;
            }

            if (!Object.getPrototypeOf(me)) {
                return false;
            }
            return recursiveSearch(Object.getPrototypeOf(me), className);
        }
        return recursiveSearch(me, baseClassName)
    },

    ClassPropertyBaseTypeSearch: function ClassPropertyBaseTypeSearch(me, baseTypeName, matchingObjectProperties) {
        matchingObjectProperties = matchingObjectProperties || [];
        if (Ext.isArray(me)) {
            for (var i = 0; i < me.length; i++) {
                ClassPropertyBaseTypeSearch(me[i], baseTypeName, matchingObjectProperties);
            }
        }
        else if (Ext.isObject(me)) {
            Ext.Object.each(me, function (prop, value, myself) {
                if (Ext.isObject(myself[prop]) && BaseClassSearch(myself[prop], baseTypeName)) {
                    matchingObjectProperties.push({ object: myself, property: prop });
                }
            });
        }

        return matchingObjectProperties;
    },

    GetControllerReference: function GetControllerReference(controllerClass) {
        var controller = undefined;
        App.getApplication().controllers.items.forEach(function (item, index, array) {
            if ((item.$className == 'App.Controller.' + controllerClass || item.$className == 'App.controller.' + controllerClass) && !controller) { controller = item; }
        });

        return controller;
    }
});

Ext.define('Utility.Dates', {
    singleton: true,

    getLastDateOfPrevMonth: function getLastDateOfPrevMonth() {
        var today = new Date();
        today.setDate(1);
        today.setDate(today.getDate() - 1);
        return today
    },

    getFirstDateOfCurrentYear: function getFirstDateOfCurrentYear() {
        var today = new Date();
        today.setDate(1);
        today.setMonth(0);
        return today
    },

    getLastDateOfCurrentYear: function getLastDateOfCurrentYear() {
        var today = new Date();
        today.setDate(1);
        today.setMonth(0);
        today.setYear(today.getFullYear() + 1);
        today.setDate(today.getDate() - 1);
        return today
    },

    get9MonthAgoDate: function get9MonthAgoDate() {
        var today = new Date();
        today.setMonth(today.getMonth() - 9);
        return today;
    },

    getFirstDateOfCurrentMonth: function getFirstDateOfCurrentMonth() {
        var today = new Date();
        today.setDate(1);
        return today
    },

    getCurrentDate: function getCurrentDate() {
        return new Date();
    },

    getPreviousTimePeriod: function () {
        var today = new Date();
        return (today.getFullYear().toString() + ('00' + today.getMonth()).slice(-2)) * 1;
    },

    getPreviousDate: function () {
        var today = new Date();
        today.setDate(today.getDate() - 1);
        return today
    }
});

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target", "_hive");

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}
