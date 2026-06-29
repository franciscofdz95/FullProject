Ext.define('App.View.Admin.News.Component.NewsIdDisplay', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Admin-News-Component-NewsIdDisplay',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        { xtype: 'hiddenfield', fieldLabel: 'News Id', itemId: 'NewsId', labelWidth: 85 }
    ]
});