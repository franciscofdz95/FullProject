Ext.define('App.View.Connections.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Connections-Container',

    cls: 'connectionsContainer',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    viewList: 'Default',
    viewListConfig: {
        Default: [
            { xtype: 'App-View-Connections-Header-Container' },
            { xtype: 'App-View-Connections-Connection-List', flex: 1 }
        ],
        Connections: [
            { xtype: 'App-View-Connections-Header-Container' },
            { xtype: 'App-View-Connections-Connection-List', flex: 1 }
        ],
        Servers: [
            { xtype: 'App-View-Connections-Header-Container' },
            { xtype: 'App-View-Connections-Server-List', flex: 1 }
        ],
        Databases: [
            { xtype: 'App-View-Connections-Header-Container' },
            { xtype: 'App-View-Connections-Database-List', flex: 1 }
        ],
        ConnectionUsers: [
            { xtype: 'App-View-Connections-Header-Container' },
            { xtype: 'App-View-Connections-ConnectionUser-List', flex: 1 }
        ]
    }
});