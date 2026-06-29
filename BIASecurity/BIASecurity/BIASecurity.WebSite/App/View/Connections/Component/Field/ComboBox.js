Ext.define('App.View.Connections.Component.Field.ComboBox', {
    //extend: 'Ext.form.field.ComboBox',
    extend: 'App.View.Component.Form.Field.CustomCombo',
    alias: 'widget.App-View-Connections-Component-Field-ComboBox',
    xtype: 'connectionsComboBox',

    componentCls: 'connectionsComponentFieldCombobox',
    labelWidth: 85,
    growToLongestValue: true,
    autoLoadOnValue: true,
    valueField: 'Value',
    displayField: 'Display',
    margin: '0 5 0 0',
    queryParam: 'search',
    minChars: 1,
    queryDelay: 600,
    enableKeyEvents: true
});