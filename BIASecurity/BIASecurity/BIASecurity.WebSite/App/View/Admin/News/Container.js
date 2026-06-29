Ext.define('App.View.Admin.News.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-News-Container',
    hidden: true,  
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    items: [          
        { xtype: 'App-View-Admin-News-HeaderContainer'},
        //{ xtype: 'App-View-Admin-News-Component-AddBIANews', margin: '10 0 10'},
        { xtype: 'App-View-Admin-News-List', margin: '10 0 0', flex: 1.9 }
    ]
});