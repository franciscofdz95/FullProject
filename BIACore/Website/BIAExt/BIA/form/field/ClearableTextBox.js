/**
 * Defines a text input box with a 'x' to clear the contents.
 * Also fires a 'clear' event (versus a select([]) event) to differentiate from a user
 * driven "clear".
 * see {@link BIA.form.field.ClearableComboBox}
 */
Ext.define('BIA.form.field.ClearableTextBox', {
    extend: (Ext.getVersion().major >= 5) ? (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.field.Text' : 'Ext.form.field.Text' : 'Ext.form.field.Trigger',
    alias: 'widget.clearText',

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

    onClearClick: function (event) {
        var me = this;
        me.setValue('');
        me.fireEvent('clear', me, [], event);
    }
});