Ext.define('App.View.Connections.Connection.Component.ShowInactiveToggle', {
    extend: 'Ext.form.field.Checkbox',
    alias: 'widget.App-View-Connections-Connection-Component-ShowInactiveToggle',

    cls: 'connectionsConnectionComponentShowinactivetoggle',
    fieldLabel: 'Show Inactive',
    labelCls: 'ConnectionsListHeaderFilters',
    labelWidth: 90,
    value: false
});