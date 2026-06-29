Ext.define('App.View.Connections.Connection.Component.EnvironmentFilter', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.App-View-Connections-Connection-Component-EnvironmentFilter',

    cls: 'connectionsConnectionComponentEnvironmentfilter',
    fieldLabel: 'Environment',
    labelWidth: 80,
    valueField: 'Value',
    displayField: 'Display',
    autoLoadOnValue: true,
    value: -1,
    store: { type: 'webapi', api: { read: 'api/BIASecurity/ConnectionEnvironmentFilter' } }
});