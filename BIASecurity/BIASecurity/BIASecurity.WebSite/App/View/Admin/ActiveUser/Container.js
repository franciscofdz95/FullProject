Ext.define('App.View.Admin.ActiveUser.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-ActiveUser-Container',
    hidden: true,
    cls: 'adminActiveuserContainer',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        { xtype: 'App-View-Admin-ActiveUser-Summary' },
        { xtype: 'App-View-Admin-ActiveUser-Filter', margin: '10 0 0' },
        { xtype: 'App-View-Admin-ActiveUser-Grid', flex: 1, margin: '10 0 0' }
    ]
});