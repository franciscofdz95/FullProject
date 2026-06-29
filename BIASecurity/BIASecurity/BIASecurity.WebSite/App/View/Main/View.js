Ext.define('App.View.Main.View', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Main-View',
    xtype: 'mainView',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    width: '100%',
    items: [
        {
            xtype: 'App-View-Navigation-NavBar',
            itemId: 'MainViewNavBar'
        },
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            items: [
                {
                    xtype: 'content',
                    itemId: 'MainViewContent',
                    flex: 1
                },
                {
                    xtype: 'adminMenu',
                    itemId: 'MainViewAdminMenu'
                }
            ]
        }
    ]
});