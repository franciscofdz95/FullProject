Ext.define('App.View.Connections.ConnectionUser.Component.UsernameSelect', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.App-View-Connections-ConnectionUser-Component-UsernameSelect',

    cls: 'connectionsConnectionuserComponentUsernameselect',
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/ConnectionUsernameList'
        }
    },
    fieldLabel: 'Username',
    valueField: 'Value',
    displayField: 'Display',
    width: 400,
    plugin: { ptype: 'componentstorebind', dataField: 'UserId' }
});