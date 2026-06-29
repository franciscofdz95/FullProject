Ext.define('Utility.Formatting', {
    //By setting this class attribute you create an accessible Ext class that can be called and its functions can be accessed from anywhere in the app.
    //To use these functions you would make a call to Utility.Formatting.[FunctionName]([parameter1], [parameter2], etc);
    singleton: true,

    NumFormat_Thousands_0Decimals_RedNegative: function NumFormat_Thousands_0Decimals_RedNegative(value, metadata) {

        metadata.css = (value >= 0) ? "n" : "negativeNumber";
        var formatString = "0,000";
        if (value < 0) formatString = "(" + formatString + ")";
        if (value < 0) value = value * -1;

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

    NumFormat_Percent_1Decimals: function NumFormat_Percent_1Decimals(value) {

        return Ext.util.Format.number(value, "0.0%");

    },

    NumFormat_Percent_0Decimals: function NumFormat_Percent_0Decimals(value) {

        return Ext.util.Format.number(value * 100, "0%");

    },

    NumFormat_USCurrency_Thousands_0Decimals: function NumFormat_USCurrency_Thousands_0Decimals(value) {

        return "$" + Ext.util.Format.number(value, "0,000");

    },

    NumFormat_Thousands_2Decimals: function NumFormat_Thousands_2Decimals(value) {

        return Ext.util.Format.number(value, "0,000.00");

    },

    NumFormat_Thousands_0Decimals: function NumFormat_Thousands_0Decimals(value) {

        return Ext.util.Format.number(value, "0,000");

    },

    NumFormat_USCurrency_Thousands_2Decimals: function NumFormat_USCurrency_Thousands_2Decimals(value) {

        return "$" + Ext.util.Format.number(value, "0,000.00");

    },

    NumFormat_USCurrency_0Decimals_RedNegative: function NumFormat_USCurrency_0Decimals_RedNegative(value, metadata) {

        metadata.css = (value >= 0) ? "n" : "negativeNumber";

        var formatString = "$" + "0,000";
        if (value < 0) formatString = "(" + formatString + ")";
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
        //if (value < 0) formatString = formatString;

        return Ext.util.Format.number(value, formatString);
    },


    RedNegative: function RedNegative(value) {

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
        /*return num.toString().substring(0, num.toString().indexOf('.') + (num.toString().indexOf('.') > 1 ? 0 : 2)) + (
                Math.abs(Number(number)) >= 1.0e+9
                ? 'B'
                : Math.abs(Number(number)) >= 1.0e+6
                    ? 'M'
                    : Math.abs(Number(number)) >= 1.0e+3
                        ? 'k'
                        : ''
            )*/
    },

    LocalDateTime: function LocalDateTime(value, metadata) {
        return value != null ? BIA.util.Format.ConvertDateTimeToLocal((Ext.isString(value) ? new Date(value) : value), false, false) : '';
    },

    ShortDateTime: function ShortDateTime(value, metadata) {
        return value != null ? BIA.util.Format.ConvertDateTimeToLocal((Ext.isString(value) ? new Date(value) : value), false, false, true) : '';
    },

    ShortDateTimeNotUTCDate: function ShortDateTimeNotUTCDate(value, metadata) {
        return value != null ? BIA.util.Format.ConvertDateTimeToLocal((Ext.isString(value) ? new Date(value) : value), false, false, true, true) : '';
    },

    ShortDateTimeWithTimeSinceNotUTCDate: function ShortDateTimeWithTimeSinceNotUTCDate(value, metadata) {
        return value != null ? BIA.util.Format.ConvertDateTimeToLocal((Ext.isString(value) ? new Date(value) : value), true, false, true, true) : '';
    },

    MinsToLargestTimeInterval: function MinsToLargestTimeInterval(mins) {
        var valueLabel = 'min',
            smValueLabel = null,
            value = mins,
            smValue = null,
            valueDiv = 1,
            smValueDiv = null;
        if (mins / 525600 > 1.0) {
            valueLabel = 'yr';
            smValueLabel = 'mon';
            valueDiv = 525600;
            smValueDiv = 43800;
        }
        else if ((mins / 131400) > 1.0) {
            valueLabel = 'qtr';
            smValueLabel = 'mon';
            valueDiv = 131400;
            smValueDiv = 43800;
        }
        else if ((mins / 43800) > 1.0) {
            valueLabel = 'mon';
            smValueLabel = 'day';
            valueDiv = 43800;
            smValueDiv = 1440;
        }
        else if ((mins / 10080) > 1.0) {
            valueLabel = 'wk';
            smValueLabel = 'day';
            valueDiv = 10080;
            smValueDiv = 1440;
        }
        else if ((mins / 1440) > 1.0) {
            valueLabel = 'day';
            smValueLabel = 'hr';
            valueDiv = 1440;
            smValueDiv = 60;
        }
        else if ((mins / 60) > 1.0) {
            valueLabel = 'hr';
            smValueLabel = 'min';
            valueDiv = 60;
            smValueDiv = 1;
        }

        value = (mins / valueDiv);
        smValue = smValueDiv != null ? ((value - Math.floor(value)) * valueDiv) / smValueDiv : null;
        return mins = 0 ? mins.toString(0) : Math.floor(value) + ' ' + valueLabel + (smValue != null && Math.floor(smValue) > 0 ? ' ' + Math.floor(smValue) + ' ' + smValueLabel : '');
    },

    ProcessStatusIcon: function ProcessStatusIcon(process) {
        if (process && Ext.isObject(process)) {
            //var PastAvg = process.PastAvg;
            //var OutOfDate = process.OutOfDate;
            //if (OutOfDate != null && OutOfDate == 1) return '<i class="fa fa-times-circle OutOfDate" data-qtip="Process is out of determined SLA"></i>';
            //else if (PastAvg != null && PastAvg == 1) return '<i class="fa fa-exclamation-triangle PastAvg" data-qtip="Process is in danger of being out of determined SLA"></i>';
            if (process.Status == 2) return '<i class="fa fa-times-circle OutOfDate" data-qtip="Process is out of determined SLA"></i>';
            else if (process.Status == 1) return '<i class="fa fa-exclamation-triangle PastAvg" data-qtip="Process is in danger of being out of determined SLA"></i>';
            else if (process.Status == 9) return '<i class="fa fa-wrench Remediated" data-qtip="Process SLA has been remediated."></i>';
            else if (process.Status == -1) return '<i class="fa fa-lock fa-fw Inactive" data-qtip="Process is Inactive."></i>';
        }
        return '';
    },

    ProcessHistoryStatusIcon: function ProcessHistoryStatusIcon(history) {
        if (history && Ext.isObject(history)) {
            //var PastAvg = history.HistoryStatus === 1 ? true : false;
            //var OutOfDate = history.HistoryStatus === 2 ? true : false;
            var Rerun = history.Rerun;
            if (Rerun != null && Rerun === true) return '<i class="fa fa-retweet fa-fw fa-rotate-90 Rerun" data-qtip="Run is a rerun"></i>';
            //else if (OutOfDate != null && OutOfDate === true) return '<i class="fa fa-times-circle fa-fw OutOfDate" data-qtip="Run is out of determined SLA"></i>';
            //else if (PastAvg != null && PastAvg === true) return '<i class="fa fa-exclamation-triangle fa-fw PastAvg" data-qtip="Run is in danger of being out of determined SLA"></i>';
            else if (history.HistoryStatus == 2) return '<i class="fa fa-times-circle fa-fw OutOfDate" data-qtip="Run is out of determined SLA"></i>';
            else if (history.HistoryStatus == 1) return '<i class="fa fa-exclamation-triangle fa-fw PastAvg" data-qtip="Run is in danger of being out of determined SLA"></i>';
            else if (history.HistoryStatus == 9) return '<i class="fa fa-wrench fa-fw Remediated" data-qtip="Process SLA has been remediated."></i>';
        }
        return '<i class="fa fa-check-circle fa-fw InSLA" data-qtip="Run is compliant with determined SLA"></i>';
    },

    ProcessProjectManager: function ProcessProjectManager(process, field) {
        var display = 'None Found';
        if (process && Ext.isObject(process)) {
            var projMgrName = process.ProjectMgr;
            var projMgrEmail = process.ProjectMgr_Email;
            if (projMgrName) {
                if (!Ext.isEmpty(projMgrEmail)) {
                    display = '<a class="ProjectManagerEmail" href="mailto:' + projMgrEmail + '">' + projMgrName + '</a>' +
                        '<a href="sip:' + projMgrEmail + '" style="margin-left:5px;"><i class="fa fa-comment" style="color:#AAA;"></i></a>';

                }
                else display = projMgrName;
            }
            display += (process.NotifyEmailSent === true
                ? '<div class="NotifyEmailSent" style="float:right">' +
                '<span class="fa-stack"data-qtip="Missed SLA Email Sent">' +
                '<i class="fa fa-envelope fa-stack-2x"></i>' +
                '<i class="fa fa-check-circle fa-stack-1x"></i>' +
                '</span>' +
                '</div>' +
                '<span style="clear:both"></span>'
                : ''
            );
        }
        return display
    },

    ProcessProcessedDate: function ProcessProcessedDate(process, includeDOW) {
        if (process && Ext.isObject(process)) {
            var pDt = process.ProcessedDate || process.LastUpdatedDate;
            var oPDt = process.OriginalProcessedDT
            if (pDt && Ext.isDate(pDt)) {
                var dateString = Utility.Formatting.ShortDateTimeNotUTCDate(pDt) + (includeDOW === true ? ' (' + Ext.Date.format(pDt, 'D') + ')' : '');
                if (oPDt && Ext.isDate(oPDt) && pDt - oPDt != 0) return '<span style="color:#e94d4d; font-weight: bold;" data-qtip="Processed Date has been over-ridden">' + dateString + '</span>'
                else return dateString;
            }
            else return pDt;
        }
        return 'N/A'
    },

    ProcessNextDate: function ProcessNextDate(process) {
        if (process && Ext.isObject(process)) {
            var nextDate = process.NextDate;
            if (nextDate && Ext.isDate(nextDate)) {
                return Utility.Formatting.ShortDateTimeWithTimeSinceNotUTCDate(nextDate);
            }
            else return nextDate;
        }
        return 'N/A'
    },

    ProcessLastDate: function ProcessLastDate(process) {
        if (process && Ext.isObject(process)) {
            var lateDate = process.LateDate;
            if (lateDate && Ext.isDate(lateDate)) {
                if (process.Status > 0) return Utility.Formatting.ShortDateTimeWithTimeSinceNotUTCDate(lateDate);
                else return '';
            }
            else return lateDate;
        }
        return 'N/A'
    },

    ProcessSLAIrregularIcon: function ProcessSLAIrregularIcon(process) {
        if (process && Ext.isObject(process) && process.SLAIrregular === true) return '<i class="fa fa-flag" data-qtip="Irregular SLA"></i>';
        return '';
    },

    SLATypeObjects: function SLATypeObjects() {
        return [
            { value: 'Hour', display: 'Hourly' },
            //{ value: 'Day', display: 'Daily' },
            //{ value: 'Week', display: 'Weekly' },
            //{ value: 'Month', display: 'Monthly' },
            //{ value: 'Quarter', display: 'Quarterly' },
            //{ value: 'Year', display: 'Annually' },
            { value: 'EBD', display: 'End of Business Day' },
            { value: 'EOD', display: 'End of Day' },
            { value: 'WedRule', display: 'UPS Wed Rule' },
            { value: 'Monthly_20', display: 'Monthly 20th Day' }
            //{ value: 'NA', display: 'N/A' }
        ];
    },
    Last4WeekLineGraphSeriesTooltip: function Last4WeekLineGraphSeriesTooltip(storeItem, item) {
        var title = item.series.getTitle();
        this.setHtml(storeItem.get(item.series.getXField()) + ' (' + storeItem.get(item.series.getYField() + 'Date') + ') of ' + title + ': ' + storeItem.get(item.series.getYField()));
    },
    UserAppAccess: function UserAppAccess(AppAccess, field, metaData) {
        if (field.up('[header=true]')) return AppAccess;
        else return (Ext.isEmpty(AppAccess) || !Ext.isNumeric(AppAccess) ? 0 : AppAccess) + (AppAccess === 1 ? ' App' : ' Apps');
    },
    ApplicationDayHitsTooltip: function ApplicationDayHitsTooltip(storeItem, item) {
        setHtml('Day ' + item.data.Day + ': ' + item.data.Hits + ' Hits');
        setVisible(false);
    },
    UserProfileEmailDisplay: function UserProfileEmailDisplay(value, field, metaData) {
        return '<a href="mailto:' + value + '">' + value + '</a>';
    },
    AppAddEditViewTitleDisplay: function AppAddEditViewTitleDisplay(value) {
        return (!Ext.isEmpty(value) ? ' > ' + value : null);
    },
    ConnectionsViewColumnIcon: function ConnectionsViewColumnIcon(value, metaData, record, rowIndex, colIndex, store, view) {
        return '<i class="fa fa-info-circle" data-qtip="View Info"></i>';
    },
    ConnectionsEditColumnIcon: function ConnectionsEditColumnIcon(value, metaData, record, rowIndex, colIndex, store, view) {
        return '<i class="fa fa-pencil" data-qtip="Edit Info"></i>';
    },
    ConnectionsUserPasswordEditIcon: function ConnectionsUserPasswordEditIcon(value, metaData, record, rowIndex, colIndex, store, view) {
        return '<i class="fa fa-key" data-qtip="Update Password"></i>';
    },
    ConnectionsActiveColumnIcon: function ConnectionsActiveColumnIcon(value, metaData, record, rowIndex, colIndex, store, view) {
        return value === 1 ? '<i class="fa fa-toggle-on" style="cursor: default;" data-qtip="Active"></i>' : '<i class="fa fa-toggle-off" style="cursor: default;" data-qtip="Not Active"></i>';
    },
    ApplicationConnectionTestIcon: function ApplicationConnectionTestIcon(value, metaData, record, rowIndex, colIndex, store, view) {
        return '<i class="fa fa-circle" style="color:#3376f0" data-qtip="Test Connection"></i>';
    },
    BIANewsEditColumnIcon: function BIANewsEditColumnIcon(value, metaData, record, rowIndex, colIndex, store, view) {
        return '<i class="fa fa-pencil" data-qtip="Edit News"></i>';
    },

    BIANewsMessageTypeIcon: function BIANewsMessageTypeIcon(me, column, record, rowIndex, td, tr) {
        switch (record.get('MessageTypeClass')) {            
            case 'Attention':
                return '<div unselectable="on"><i class="fa fa-exclamation-circle fa-lg" style="color: #FBC638" data-qtip="Attention"></i></div>';
                break;
            case 'Critical':
                return '<div unselectable="on"><i class="fa fa-exclamation-circle fa-lg" style="color: #F31A12" data-qtip="Critical"></i></div>';
                break;
            case 'Info':
                return '<div unselectable="on"><i class="fa fa-info-circle fa-lg" style="color: #3376F0" data-qtip="Info"></i></div>';
                break;
            case 'Warning':
                return '<div unselectable="on"><i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true" style="color: #F68B20" data-qtip="Warning"></i></div>';
                break;
            case 'Status':
                return '<div unselectable="on"><i class="fa fa-desktop fa-lg" aria-hidden="true", data-qtip="Status"></i></div>'
                break;
        }

    },

    BIANewsStatusIcon: function BIANewsStatusIcon(value, metaData, record, rowIndex, colIndex, store, view) {
        return value === 1 ? '<i class="fa fa-check-circle fa-lg" style="cursor: default;color: #83B93C" data-qtip="Active"></i>' : '<i class="fa fa-check-circle fa-lg" style="cursor: default;color: #A6A6A3" data-qtip="Not Active"></i>';
    },

    VPNViewColumnIcon: function VPNViewColumnIcon(value, metaData, record, rowIndex, colIndex, store, view) {
        return value === 1 ? '<i class="fa fa-wifi fa-lg" data-qtip="Yes"></i>' : '<i class="fa fa-building fa-lg" data-qtip="No"></i>';
    },

    UserEmailColumnIcon: function UserEmailColumnIcon(value, metaData, record, rowIndex, colIndex, store, view) {
        return Ext.String.format('<a href="mailto:{0}" style="color: #E1AA57"><i class="fa fa-envelope fa-lg" data-qtip={1}></i></a>', value, value);
    },

    DateToLargestTimeInterval: function DateToLargestTimeInterval(value, metaData, record, rowIndex, colIndex, store, view) {
        var currentDate  = record.get('SessionCreatedDt'),
            modifiedDate = record.get('modifiedDt');
        if (currentDate !== null) {
            var seconds = Math.floor((modifiedDate - (currentDate)) / 1000),
                minutes = Math.floor(seconds / 60),
                hours = Math.floor(minutes / 60),
                days = Math.floor(hours / 24);

            hours = hours - (days * 24);
            minutes = minutes - (days * 24 * 60) - (hours * 60);
            seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

            return days + ' day(s) ' + hours + ' hr ' + minutes + ' min ' + seconds + ' sec';
        }
        else return '';
    },

    ConvertDateTimeToLocal: function ConvertDateTimeToLocal(value, metaData, record, rowIndex, colIndex, store, view) {
        var date = value,
            longVersion = false;

        if (date !== null) {
            var timezoneDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
            var convertedDateTime = '';
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            var daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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


            convertedDateTime = days[timezoneDate.getDay() - 1] + ' ' +
                (longVersion ? months[timezoneDate.getMonth()] + ' ' : (timezoneDate.getMonth() + 1) + '/') +
                timezoneDate.getDate() +
                (timezoneDate.getFullYear() != (new Date()).getFullYear() ? (longVersion ? ', ' + timezoneDate.getFullYear() : '/' + timezoneDate.getFullYear().toString().substring(2)) : '') +
                ' at ' + (timezoneDate.getHours() % 12 == 0 ? 12 : timezoneDate.getHours() % 12) + ':' +
                ('00' + timezoneDate.getMinutes()).substr(('00' + timezoneDate.getMinutes()).length - 2) +
                (timezoneDate.getHours() >= 12 ? 'PM' : 'AM') + ' (' + timeSinceString + ')';

            return convertedDateTime;
        }
        else { return '';}
    },

    LongDateTime: function LongDateTime(value, metaData, record, rowIndex, colIndex, store, view) {
        var date = value,
            longVersion = false;

        if (date !== null) {
            var valueDate = new Date(date.getTime() - 0 * 60 * 1000);
            var convertedDateTime = '';
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            var daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            var timeSinceDifThresholds = [1, 1000, (1000 * 60), (1000 * 60 * 60), (1000 * 60 * 60 * 24), (1000 * 60 * 60 * 24 * 7),
                (1000 * 60 * 60 * 24 * daysOfMonth[(new Date()).getMonth()]), (1000 * 60 * 60 * 24 * ((new Date()).getFullYear() % 4 == 0 ? 366 : 365))];
            var timeSinceDifNames = (longVersion ? ['ms', 'sec', 'min', 'hr', 'day', 'wk', 'mnth', 'yr'] : ['ms', 's', 'm', 'h', 'd', 'wk', 'mo', 'y']);
            var timeSince = Date.now() - valueDate.getTime();
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


            convertedDateTime = days[valueDate.getDay() - 1] + ' ' +
                (longVersion ? months[valueDate.getMonth()] + ' ' : (valueDate.getMonth() + 1) + '/') +
                valueDate.getDate() +
                (valueDate.getFullYear() != (new Date()).getFullYear() ? (longVersion ? ', ' + valueDate.getFullYear() : '/' + valueDate.getFullYear().toString().substring(2)) : '') +
                ' at ' + (valueDate.getHours() % 12 == 0 ? 12 : valueDate.getHours() % 12) + ':' +
                ('00' + valueDate.getMinutes()).substr(('00' + valueDate.getMinutes()).length - 2) +
                (valueDate.getHours() >= 12 ? 'PM' : 'AM') + ' (' + timeSinceString + ')';

            return convertedDateTime;
        }
        else { return ''; }
    }

});