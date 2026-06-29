Ext.define('BIA.grid.plugin.FormEditing', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.grid.plugin.Editable' : 'Ext.grid.plugin.Editing',
    alias: 'plugin.formediting',

    //requires: [
    //    'BIA.grid.FormEditor'
    //],

    editStyle: 'form',

    saveBtnText: 'Update',
    cancelBtnText: 'Cancel',

    destroy: function () {
        Ext.destroy(this.editor);
        this.callParent(arguments);
    },

    getEditor: function () {
        var me = this;

        if (!me.editor) {
            me.editor = me.initEditor();
        }

        return me.editor;
    },

    initEditor: function () {
        return new BIA.grid.FormEditor(this.initEditorConfig());
    },

    initEditorConfig: function () {
        var me = this,
            grid = me.grid,
            headerCt = grid.headerCt;

        return {
            fields: headerCt.getGridColumns(),
            editingPlugin: me
        };
    },

    startEdit: function () {
        var me = this,
            editor = me.getEditor(),
            context;

        if (editor.beforeEdit() !== false) {
            context = me.callParent(arguments);
            if (context) {
                me.context = context;

                editor.startEdit(context.record, context.column, context);
                return true;
            }
        }
        return false;
    },

    cancelEdit: function () {
        var me = this;

        if (me.editing) {
            me.getEditor().cancelEdit();
            me.callParent(arguments);
        }
        return true;
    },

    completeEdit: function () {
        var me = this;

        if (me.editing && me.validateEdit()) {
            me.editing = false;
            me.fireEvent('edit', me, me.context);
        }
    },

    validateEdit: function () {
        var me = this,
            editor = me.editor,
            context = me.context,
            record = context.record,
            newValues = {},
            originalValues = {},
            editors = editor.getForm().getFields(),
            name;

        editors.each(function (item) {
            name = item.name;

            newValues[name] = item.getValue();
            originalValues[name] = record.get(name);
        });

        Ext.apply(context, {
            newValues: newValues,
            originalValues: originalValues
        });

        return me.callParent(arguments) && editor.completeEdit();
    },

    getColumnField: function (columnHeader) {
        var field = this.callOverridden(arguments);

        field.setFieldLabel(columnHeader.text);

        return field;
    }

});