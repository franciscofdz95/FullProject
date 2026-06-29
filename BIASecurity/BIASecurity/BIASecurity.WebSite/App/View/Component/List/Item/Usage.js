Ext.define('App.View.Component.List.Item.Usage', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-List-Item-Usage',

    cls: 'componentListItemUsage',
    margin: '0 3 0 0',
    layout: { type: 'hbox', align: 'stretch', pack: 'start' },
    maxWidth: 300,
    //maxHeight: 60,

    items: [
        { xtype: 'App-View-Component-List-Item-Usage-Graph', showOnHeader: false, flex: 1 },
        { xtype: 'label', dataField: 'Usage', showOnHeader: true, padding: '0 0 0 12' },
        {
            xtype: 'container',
            showOnHeader: false,
            itemId: 'componentListItemUsageButtons',
            layout: { type: 'vbox', align: 'begin', pack: 'center' },
            defaults: { margin: '2 4' },
            padding: '2 0',
            items: [
                { xtype: 'App-View-Component-List-Item-Usage-TypeToggle', hidden: true },
                { xtype: 'App-View-Component-List-Item-Usage-TimeToggle', hidden: true }
            ]
        }
    ]
});