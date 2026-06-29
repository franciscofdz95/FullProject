/**
 * Defines a bunch of {@link Ext.util.Format} formatters for Charts.
 */
Ext.define('BIA.util.Chart', {
    singleton: true,

    /**
     * Base formatter
     * @param {String} format The destination format for the number
     * @param {Number} value The value to format
     * @returns {String} the formatted value or an empty string if it is unable to apply that format
     */
    number: function (format, value) {
        value = Ext.Number.from(value, NaN);
        if (isNaN(value)) {
            return '';
        }
        return Ext.util.Format.number(value, format || '0,000');
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
        return function (s, rec, attr, i, store) {
            return this[custom].call(this, s, rec, attr, i, store);
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
    }
}, function () {
    var chart = BIA.util.Chart;
    Ext.apply(BIA.util.Chart, {
        // pre-defined markups
        // Use this when you want to use a pre-defined formatter including markup.
        // e.g. renderer: Util.format.money_0
        number_0: function (v) { return chart.number('0,000', v); },
        number_1: function (v) { return chart.number('0,000.0', v); },
        number_2: function (v) { return chart.number('0,000.00', v); },
        money_0: function (v) { return chart.number('$0,000', v); },
        money_2: function (v) { return chart.number('$0,000.00', v); },
        percent_0: function (v) { return chart.number('0%', v * 100); },
        percent_1: function (v) { return chart.number('0.0%', v * 100); },
        percent_2: function (v) { return chart.number('0.00%', v * 100); }
    });
});
