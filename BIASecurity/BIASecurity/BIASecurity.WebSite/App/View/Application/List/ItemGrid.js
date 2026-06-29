Ext.define('App.View.Application.List.ItemGrid', {
    extend: 'App.View.Component.List.Item',
    alias: 'widget.App-View-Application-List-ItemGrid',
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
            layout: { type: 'hbox', align: 'stretch', pack: 'center' },
            //defaults: { flex: 1 },
            flex: 0,
            width: 40,
            items: [
                { xtype: 'App-View-Application-List-Item-Icon', iconProperty: 'hasAccess', flex: 0, width: 24, showOnHeader: false, padding: '0 2' },
                { xtype: 'App-View-Application-List-Item-Request', iconProperty: 'hasAccess', flex: 0, width: 16, showOnHeader: false, padding: '0 2' },
                { xtype: 'label', text: ' ', showOnHeader: true }
            ]
        },        
        { xtype: 'label', dataField: 'AppCode', flex: 0, width: 175, sort: true, sortDisplay: 'App Code' },
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'center' },
            defaults: { flex: 1 },
            padding: '0 15 0 0',
            items: [
                { xtype: 'App-View-Application-List-Item-AppName' }
                //{ xtype: 'label', dataField: 'AppName', showOnHeader: true, sort: true, sortDisplay: 'App Name' }
            ]
        },
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'center' },
            //defaults: { flex: 1 },
            flex: 0,
            width: 130,
            items: [
                { xtype: 'App-View-Application-List-Item-Status', showOnHeader: false },
                { xtype: 'label', dataField: 'Status', showOnHeader: true, flex: 0, sort: true, sortOn: 'Active', sortDisplay: 'Status'  }
            ]
        },
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'center' },
            //defaults: { flex: 1 },
            maxWidth: 180,
            padding: '0 15',
            items: [
                { xtype: 'App-View-Application-List-Item-Stats', showOnHeader: false, maxWidth: 125, flex: 1 },
                { xtype: 'label', dataField: 'Stats', showOnHeader: true, sort: true, sortOn: 'UsersOnlinePercent', sortDisplay: 'Users Online %' }
            ]
        },
        { xtype: 'App-View-Component-List-Item-Usage' }
    ]
});