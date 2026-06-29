Ext.define('BIA.form.field.ClearableNumber', {
    extend: (Ext.getVersion().major >= 5) ? (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.field.Text' : 'Ext.form.field.Text' : 'Ext.form.field.Trigger',
    alias: 'widget.clearNumber',

    stripCharsRe: new RegExp('[^1234567890]', 'gi'),
    nanText: '{0} is not a valid number',
    
    constructor: function (config) {
        var config = config || {},
            me = this;

        if (Ext.getVersion().major >= 5) {
            var triggers = config.triggers || {};
            Ext.applyIf(triggers, {
                clear: {
                    cls: 'x-form-clear-trigger',
                    handler: 'onClearClick',
                    scope: 'this'
                }
            });
            config.triggers = triggers;
        } else {
            Ext.applyIf(config, {
                trigger1Cls: 'x-form-clear-trigger',
                onTrigger1Click: me.onClearClick
            });
        }
        me.callParent([config]);
    },

    getErrors: function (value) {
        var me = this,
            errors = me.callParent(arguments),
            format = Ext.String.format;

        value = Ext.isDefined(value) ? value : me.processRawValue(me.getRawValue());

        if (isNaN(value)) {
            errors.push(format(me.nanText, value));
        }

        return errors;
    },

    onClearClick: function (event) {
        var me = this;
        me.setValue();
        me.fireEvent('clear', me, [], event);
    }
});