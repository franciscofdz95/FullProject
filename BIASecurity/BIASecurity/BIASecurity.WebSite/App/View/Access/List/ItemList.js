Ext.define('App.View.Access.List.ItemList', {
    extend: 'App.View.Component.List.Item',
    alias: 'widget.App-View-Access-List-ItemList',

    componentCls: 'accessListItemlist',
    cls: 'Card CardSlim',
    padding: 3,
    access: undefined,
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    defaults: { flex: 1, margin: '0 5' },
    items: [
        { xtype: 'label', dataField: 'UserName', flex: 0, width: 205, showOnHeader: true, sort: true, sortDisplay: 'User Id', sortOn: 'UserId' },
        { xtype: 'label', dataField: 'AppCode', flex: 0, width: 110, showOnHeader: true, sort: true, sortDisplay: 'App Code' },
        { xtype: 'label', dataField: 'AppName', showOnHeader: true, sort: true, sortDisplay: 'App Name' },
        { xtype: 'label', dataField: 'BusinessUnit', flex: 0, width: 60, showOnHeader: true, sort: true, sortDisplay: 'Bus. Unit' },
        { xtype: 'label', dataField: 'GeoGroupCode', flex: 0, width: 60, showOnHeader: true, sort: true, sortDisplay: 'Geo Group' },
        { xtype: 'label', dataField: 'GeoCode', flex: 0, width: 60, showOnHeader: true, sort: true, sortDisplay: 'Geo' },
        { xtype: 'label', dataField: 'GeoId', flex: 0, width: 60, showOnHeader: true, sort: true, sortDisplay: 'Geo ID' },
        { xtype: 'label', dataField: 'GeoName', flex: 0, width: 110, showOnHeader: true, sort: true, sortDisplay: 'Geo Name' },
        {
            xtype: 'container', layout: { type: 'hbox', align: 'stretch', pack: 'center' }, flex: 0, width: 100,
            items: [
                { xtype: 'App-View-Access-List-Item-AccessLevel', iconProperty: 'AccessLevel', flex: 0, width: 24, showOnHeader: false, padding: '0 2' },
                { xtype: 'label', dataField: 'AccessLevel', flex: 0, width: 76, showOnHeader: true, sort: true, sortDisplay: 'Access Level' }
            ]
        },
        {
            xtype: 'container', layout: { type: 'hbox', align: 'stretch', pack: 'start' }, flex: 0, width: 84,
            items: [
                { xtype: 'label', dataField: 'Access', flex: 0, width: 70, showOnHeader: true, sort: true, sortDisplay: 'Access' },
                {
                    xtype: 'container',
                    cls: 'ReasonListIcon ClickableIcon',
                    itemId: 'ReasonContainer',
                    padding: '0',
                    flex: 0,
                    width: 20,
                    showOnHeader: false,
                    html: '<i class="fa fa-info-circle"></i>',
                    hoverWindow: {
                        showOnClick: false,
                        showOnHover: true,
                        parentDataProperties: 'access',
                        windowXtype: 'App-View-Access-List-Item-ReasonWindow'
                    }
                }
            ]

        },
        { xtype: 'App-View-Access-List-Item-Actions', flex: 0, width: 70 },
        { xtype: 'label', dataField: 'UpdatedBy', flex: 0, width: 205, showOnHeader: true, sort: true, sortDisplay: 'Updated By' },
        { xtype: 'label', dataField: 'StatusDate', flex: 0, width: 125, showOnHeader: true, sort: true, sortDisplay: 'Status Date', renderer: Ext.util.Format.dateRenderer('m/d/y g:i a') },
        { xtype: 'label', dataField: 'ExtendedAttribPath', hidden: true, showOnHeader: false }
    ]
});