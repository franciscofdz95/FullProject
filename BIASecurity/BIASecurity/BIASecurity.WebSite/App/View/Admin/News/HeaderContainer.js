Ext.define('App.View.Admin.News.HeaderContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-News-HeaderContainer',

    cls: 'connectionsHeaderContainer',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    padding: '0 5 5 0',
    defaults: { margin: '0 0 0 5 ' },
    items: [       
        { xtype: 'tbfill', flex: 1 },
        { xtype: 'App-View-Admin-News-Component-AddBIANews', margin: '10 0 0' }        
    ]
});