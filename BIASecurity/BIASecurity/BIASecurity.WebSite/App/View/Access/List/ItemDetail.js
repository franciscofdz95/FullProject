Ext.define('App.View.Access.List.ItemDetail', {
    extend: 'App.View.Component.List.Item',
    alias: 'widget.App-View-Access-List-ItemDetail',

    componentCls: 'accessListItemdetail',
    cls: 'Card CardSlim',
    padding: 3,
    access: undefined,
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'begin'
    },

    defaults: { flex: 1, margin: '0 5' },
    items: [
        { xtype: 'label', dataField: 'UserName', flex: 0, width: 205, showOnHeader: true, sort: true, sortDisplay: 'User Id', sortOn: 'UserId' },
        { xtype: 'label', dataField: 'AppCode', flex: 0, width: 110, showOnHeader: true, sort: true, sortDisplay: 'App Code' },
        { xtype: 'label', dataField: 'AppName', showOnHeader: true, sort: true, sortDisplay: 'App Name' },
        { xtype: 'label', dataField: 'BusinessUnit', flex: 0, width: 80, showOnHeader: true, sort: true, sortDisplay: 'Bus. Unit' },
        { xtype: 'label', dataField: 'GeoGroupCode', flex: 0, width: 80, showOnHeader: true, sort: true, sortDisplay: 'Geo Group' },
        { xtype: 'label', dataField: 'GeoCode', flex: 0, width: 80, showOnHeader: true, sort: true, sortDisplay: 'Geo' },
        { xtype: 'label', dataField: 'GeoId', flex: 0, width: 80, showOnHeader: true, sort: true, sortDisplay: 'Geo ID' },
        { xtype: 'label', dataField: 'GeoName', flex: 0, width: 110, showOnHeader: true, sort: true, sortDisplay: 'Geo Name' },
        {
            xtype: 'container', layout: { type: 'hbox', align: 'stretch', pack: 'center' }, flex: 0, width: 110, defaults: { flex: 1 },
            items: [
                { xtype: 'App-View-Access-List-Item-AccessLevel', iconProperty: 'AccessLevel', flex: 0, width: 30, showOnHeader: false, padding: '0 2' },
                { xtype: 'label', dataField: 'AccessLevel', showOnHeader: true, sort: true, sortDisplay: 'Access Level' }
            ]
        },
        { xtype: 'label', dataField: 'PendingRequest', flex: 0, width: 125, showOnHeader: true, sort: true, sortDisplay: 'Pending Request', renderer: Ext.util.Format.dateRenderer('m/d/y g:i a') },
        { xtype: 'label', dataField: 'Access', flex: 0, width: 80, showOnHeader: true, sort: true, sortDisplay: 'Access' },
        { xtype: 'App-View-Access-List-Item-Actions', showOnHeader: false, width: 90 },
        { xtype: 'label', dataField: 'ApprovedBy', flex: 0, width: 115, showOnHeader: true, sort: true, sortDisplay: 'Approved By' },
        { xtype: 'label', dataField: 'ApprovedDate', flex: 0, width: 125, showOnHeader: true, sort: true, renderer: Ext.util.Format.dateRenderer('m/d/y g:i a') },
    ]
});