Ext.define('App.form.field.MultiCombo', {
    extend: 'BIA.form.field.ClearableComboBox',
    alias: ['widget.combotemp', 'widget.comboarray'],
    getValue: function () {
        var result = this.callParent();
        return (result) ? [result] : [];
    }
});