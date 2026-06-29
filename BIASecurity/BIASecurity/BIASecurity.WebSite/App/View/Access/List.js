Ext.define('App.View.Access.List', {
    extend: 'App.View.Component.List.Container',
    alias: 'widget.App-View-Access-List',

    //biaPageView: false,
    //biaPageViewTitle: 'Access List',

    searchList: true,
    searchListNavigateOnChange: false,

    addItemWindowClass: 'App.View.Access.Request.Window',
    addItemButtonHover: 'Add a Access',

    listItem: 'App-View-Access-List-ItemList',
    sorts: [
        { property: 'AppCode', direction: 'ASC' },
        { property: 'AccessLevel', direction: 'ASC' }
    ],

    filterValues: {
        access: 'Pending'
    },

    cls: 'accessList',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        { xtype: 'App-View-Access-List-View', flex: 1, itemId: 'AccessList' }
    ]
});