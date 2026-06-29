Ext.define('App.View.Connections.Database.Component.GlobalNameEntry', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Database-Component-GlobalNameEntry',

    cls: 'connectionsDatabaseComponentGlobalnameentry',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsTextfield', itemId: 'GlobalName', fieldLabel: 'Global Name', flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'GlobalName' }
        },
        { xtype: 'container', html: 'For Oracle Only', cls: 'connectionsFieldInfoMsg' }
    ]
});