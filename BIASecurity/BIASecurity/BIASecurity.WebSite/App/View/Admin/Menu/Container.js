Ext.define('App.View.Admin.Menu.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-Menu-Container',
    xtype: 'adminMenu',

    hidden: true,

    width: 300,
    style: {
        backgroundColor: 'white',
        border: 'solid #3892d3 3px',
        borderRight: 'none'
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        { xtype: 'adminMenuTitle' },
        {
            xtype: 'container',
            itemId: 'menuItemContainer',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            defaults: {
                margin: '8 15 0'
            },
            items: [
                //{ xtype: 'App-View-Admin-ADSM-MenuItem' },
                { xtype: 'App-View-Connections-AdminMenuItem' },
                { xtype: 'App-View-Admin-ActiveUser-AdminMenuItem' },
                { xtype: 'App-View-Admin-Logs-AdminMenuItem' },               
                { xtype: 'App-View-Admin-ComponentCatalog-AdminMenuItem' },                
                { xtype: 'App-View-Admin-News-AdminMenuItem' }                
            ]
        }
    ]
});