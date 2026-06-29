Ext.define('App.View.Component.Permissions.Item.View', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Permissions-Item-View',
    cls: 'Card',

    padding: 5,
    style: {
        borderRadius: '5px',
        //backgroundColor: '#CCCCCC',
        //border: 'none',
        //backgroundImage: 'none !important',
        fontSize: '16px'
    },

    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'begin'
    },
    defaults: {
        margin: '0 3'
    },

    items: [
        { xtype: 'App-View-Component-Permissions-Item-StatusIcon' },
        { xtype: 'App-View-Component-Permissions-Item-TypeIcon' },
        { xtype: 'App-View-Component-Permissions-Item-Name', flex: 1 },
        { xtype: 'App-View-Component-Permissions-Item-Close' }
    ]
});