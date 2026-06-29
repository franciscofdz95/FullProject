Ext.define('App.View.Admin.News.FieldContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-News-FieldContainer',

    componentCls: 'connectionsComponentFieldcontainer',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    padding: '0 5 5 0',
    defaults: { margin: '0 0 0 5 ' },
    items: [
        { xtype: 'App-View-Admin-News-Component-MessageTypeFilter' },
        { xtype: 'App-View-Admin-News-Component-MessageDate', itemId: 'biaNewsDate', fieldLabel: 'Date' }
    ]
   
});