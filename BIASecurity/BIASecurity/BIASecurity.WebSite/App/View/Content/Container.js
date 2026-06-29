Ext.define('App.View.Content.Container', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.App-View-Content-Container',
    xtype: 'content',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    padding: 7,
    style: {
        backgroundImage: 'none',
        backgroundColor: 'white'
    },

    defaults: {
        flex: 1
    },

    items: [            
        //{ xtype: 'contentInitial', flex: 1 }
    ]
});