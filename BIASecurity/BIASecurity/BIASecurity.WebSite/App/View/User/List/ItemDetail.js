Ext.define('App.View.User.List.ItemDetail', {
    extend: 'App.View.Component.List.Item',
    alias: 'widget.App-View-User-List-ItemDetail',

    componentCls: 'userListItem',
    cls: 'Card CardSlim',
    padding: 3,
    user: undefined,
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    defaults: { flex: 1, margin: '0 5' },
    items: [
        { xtype: 'App-View-User-List-Item-ListDetailInfoContainer' }//,
        //{ xtype: 'App-View-Component-List-Item-Usage' }
    ]
});