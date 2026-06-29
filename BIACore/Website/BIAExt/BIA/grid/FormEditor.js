Ext.define('BIA.grid.FormEditor', {
    extend: 'Ext.window.Window',
    alias: 'widget.formeditor',

    modal: true,
    closable: false,
    header: false,
    resizable: false,

    form: {},
    buttons: {},
    items: [],

    initFormConfig: function () {
        var me = this;
        return Ext.apply({
            xtype: 'form',
            border: false,
            dockedItems: [
                me.initButtonsConfig()
            ]
        }, me.form);
    },

    initButtonsConfig: function () {
        var me = this,
            plugin = me.editingPlugin;
        return Ext.apply({
            xtype: 'toolbar', dock: 'bottom',
            defaults: { width: 50 },
            items: [
                { xtype: 'tbfill' },
                {
                    xtype: 'button', itemId: 'update',
                    text: plugin.saveBtnText,
                    handler: plugin.completeEdit,
                    disabled: me.updateButtonDisabled,
                    scope: plugin
                },
                {
                    xtype: 'button',
                    text: plugin.cancelBtnText,
                    handler: plugin.cancelEdit,
                    scope: plugin
                },
                { xtype: 'tbfill' }
            ]
        }, me.buttons);
    },

    initComponent: function () {
        var me = this;

        me.items = [].concat(me.items, me.initFormConfig());
        delete me.form;
        delete me.buttons;

        me.callParent(arguments);

        if (me.fields) {
            me.addFieldsForColumn(me.fields, true);
            me.insertColumnEditor(me.fields);
            delete me.fields;
        }

        var form = me.getForm();
        form.trackResetOnLoad = true;
        form.on('validitychange', me.onValidityChange, me);
    },

    // validity
    onValidityChange: function () {
        var me = this,
            form = me.getForm(),
            valid = form.isValid();

        me.updateButton(valid);
        me.isValid = valid;
    },

    updateButton: function (valid) {
        var button = this.down('#update');
        if (button) {
            button.setDisabled(!valid);
        } else {
            this.updateButtonDisabled = !valid;
        }
    },
    // validity

    // Edit section
    beforeEdit: function () {
        var me = this;
        if (me.isVisible() && me.errorSummary && !me.autoCancel && me.isDirty()) {
            me.showToolTip();
            return false;
        }
    },

    cancelEdit: function () {
        var me = this,
            form = me.getForm(),
            fields = form.getFields();

        me.hide();
        form.clearInvalid();

        fields.each(function (field) { field.suspendEvents(); });
        form.reset();
        fields.each(function (field) { field.resumeEvents(); });
    },

    completeEdit: function () {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            return false;
        }

        form.updateRecord(me.context.record);
        me.hide();
        return true;
    },

    startEdit: function (record) {
        var me = this,
            editingPlugin = me.editingPlugin,
            context = me.context = editingPlugin.context;

        if (!me.isVisible()) {
            me.show();
        }

        context.grid.getSelectionModel().select(record);
        me.loadRecord(record);
    },

    validateEdit: function () {
        var me = this,
            context = me.context;

        return me.fireEvent('validateedit', me, context) !== false && !context.cancel;
    },
    // Edit section

    // Form section
    addFieldsForColumn: function (column, initial) {
        var me = this,
            i, len, field;

        if (Ext.isArray(column)) {
            for (i = 0, len = column.length; i < len; ++i) {
                me.addFieldsForColumn(column[i], initial);
            }
            return;
        }

        if (column.getEditor) {
            field = column.getEditor(null, {
                xtype: 'displayfield',
                getModelData: function () { return null; }
            });

            if (column.align === 'right') {
                field.fieldStyle = 'text-align:right';
            }

            if (column.xtype === 'actioncolumn') {
                field.fieldCls += ' ' + Ext.baseCSSPrefix + 'form-action-col-field';
            }

            if (me.isVisible() && me.context) {
            }

            if (column.hidden) {
                me.onColumnHide(column);
            } else if (column.rendered && !initial) {
                me.onColumnShow(column);
            }
        }
    },

    insertColumnEditor: function (column) {
        var me = this,
            len, i;

        if (Ext.isArray(column)) {
            for (i = 0, len = column.length; i < len; ++i) {
                me.insertColumnEditor(column[i]);
            }
            return;
        }

        if (!column.getEditor) { return; }

        me.down('>form').insert(column.getVisibleIndex(), column.getEditor());
    },

    loadRecord: function (record) {
        var me = this,
            form = me.getForm(),
            fields = form.getFields(),
            items = fields.items,
            len = items.length,
            i, isValid;

        for (i = 0; i < len; ++i) {
            items[i].suspendEvents();
        }

        form.loadRecord(record);

        for (i = 0; i < len; ++i) {
            items[i].resumeEvents();
        }

        isValid = form.isValid();
        if (me.errorSummary) {
            if (isValid) {
                me.hideToolTip();
            } else {
                me.showToolTip();
            }
        }

        me.updateButton(isValid);
    },

    getForm: function () {
        return this.down('>form').getForm();
    }
    // Form section
});