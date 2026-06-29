/**
 * Defines a combo box with a 'x' to clear the contents.
 * Also fires a 'clear' event (versus a select([]) event) to differentiate from a user
 * driven "clear".
 */
Ext.define('BIA.form.field.ClearableComboBox', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.clearCombo',

    /**
     * @cfg {String} [valueField='Id']
     * The model field to return as the 'value' when getValue() is called.
     */
    valueField: 'Id',

    /**
     * @cfg {String} [displayField='Name']
     * The model field to return as the 'display' when getDisplayValue() is called.
     */
    displayField: 'Name',

    constructor: function (config) {
        var config = config || {},
            me = this;

        if (Ext.getVersion().major >= 5) {
            var triggers = config.triggers || {};
            // weight is the order the items appear in.
            Ext.applyIf(triggers, {
                clear: {
                    cls: 'x-form-clear-trigger',
                    handler: 'onClearClick',
                    weight: -10,
                    scope: 'this'
                }
            });
            config.triggers = triggers;
        } else {
            Ext.applyIf(config, {
                trigger1Cls: 'x-form-clear-trigger',
                trigger2Cls: 'x-form-arrow-trigger',
                // don't need to define an onTrigger2Click, since it defaults to the search function.
                onTrigger1Click: me.onClearClick
            });
        }
        me.callParent([config]);
    },

    setValue: function (value) {
        var me = this;
        if (Ext.isArray(value) && !me.multiSelect) {
            value = (value.length > 0) ? value[0] : null;
        }
        me.callParent([value]);
    },

    onClearClick: function (event) {
        var me = this;
        me.clearValue();
        me.fireEvent('clear', me, [], event);
    },

    listeners: {
        render: function (field) {
            field.triggerEl.each(function (trigger) {
                if (trigger.dom.className.indexOf('x-form-clear-trigger') > -1) {
                    Ext.create('Ext.tip.ToolTip', { target: trigger.id, html: 'Click to reset this filter' });
                }
            });
        }
    }
});