Ext.define('App.View.Access.List.Item.Actions', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Access-List-Item-Actions',
    cls: 'AccessListActions',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    defaults: {flex: 0, margin: '0 5 0 5' },
    items: [
        { xtype: 'label', text: 'Actions', hidden: true, showOnHeader: true, flex: 0,  sort: false },
        { xtype: 'App-View-Access-List-Item-Actions-Approve', hidden: true, showOnHeader: false },
        { xtype: 'App-View-Access-List-Item-Actions-Deny', hidden: true, showOnHeader: false },
        { xtype: 'App-View-Access-List-Item-Actions-EA', hidden: true, showOnHeader: false },
        { xtype: 'App-View-Access-List-Item-Actions-Remove', hidden: true, showOnHeader: false }
    ]
});