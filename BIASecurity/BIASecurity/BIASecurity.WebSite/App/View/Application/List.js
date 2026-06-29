Ext.define('App.View.Application.List', {
    extend: 'App.View.Component.List.Container',
    alias: 'widget.App-View-Application-List',

    //biaPageView: true,
    //biaPageViewTitle: 'Application List',

    searchList: true,

    addItemWindowClass: 'App.View.Application.NewApplicationWindow',
    addItemButtonHover: 'Add a New Application',
    addItemRequiredAccess: 'SA',

    listItem: 'App-View-Application-List-ItemGrid',
    sorts: [
        { property: 'AppCode', direction: 'ASC' }
    ],

    filterValues: {
        active: 1
    },

    cls: 'applicationList',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        { xtype: 'App-View-Application-List-View', flex: 1, itemId: 'ApplicationList' }
    ]
});