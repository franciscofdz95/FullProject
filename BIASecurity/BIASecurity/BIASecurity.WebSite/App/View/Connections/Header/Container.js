Ext.define('App.View.Connections.Header.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Connections-Header-Container',

    cls: 'connectionsHeaderContainer',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    padding: '0 5 5 0',
    defaults: { margin: '0 0 0 5 ' },
    items: [
        { xtype: 'App-View-Connections-Header-Search' },
        { xtype: 'tbfill', flex: 1 },
        { xtype: 'App-View-Connections-Header-AddServer' },
        { xtype: 'App-View-Connections-Header-AddDatabase' },
        { xtype: 'App-View-Connections-Header-AddConnectionUser' },
        { xtype: 'App-View-Connections-Header-AddConnection' }
    ]
});