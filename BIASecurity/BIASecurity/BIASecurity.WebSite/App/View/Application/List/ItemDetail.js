Ext.define('App.View.Application.List.ItemDetail', {
    extend: 'App.View.Component.List.Item',
    alias: 'widget.App-View-Application-List-ItemDetail',
    cls: 'Card',
    margin: 6,
    padding: '0 0 0 6',
    application: undefined,
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'begin'
    },

    defaults: { flex: 1, margin: '0 5' },
    items: [
        {
            xtype: 'container',
            layout: { type: 'vbox', align: 'stretch', pack: 'start' },
            padding: '6 0 6',
            items: [
                { xtype: 'App-View-Application-List-Item-ListDetailInfoContainer' },
                {
                    xtype: 'container',
                    layout: { type: 'hbox', align: 'stretch', pack: 'start' },
                    flex: 1,
                    padding: '6 0 0 0',
                    items: [
                        { xtype: 'label', cls: 'ApplicationItemDescriptionLabel', showOnHeader: false, flex: 1, sort: true, sortOn: 'Description', dataField: 'Description' }//,
                        //{ xtype: 'label', text: 'Description', showOnHeader: true, sort: false, sortOn: 'ApplicationDescription', sortDisplay: 'App Description' }
                    ]
                }
            ]
        },
        { xtype: 'App-View-Component-List-Item-Usage', flex: 1 }
    ]
});