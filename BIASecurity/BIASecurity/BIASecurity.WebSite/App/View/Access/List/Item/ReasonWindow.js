Ext.define('App.View.Access.List.Item.ReasonWindow', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Access-List-Item-ReasonWindow',

    cls: 'accessListItemReasonwindow',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        { itemId: 'ReasonLabel', xtype: 'label', minWidth: 200 }
    ]
});