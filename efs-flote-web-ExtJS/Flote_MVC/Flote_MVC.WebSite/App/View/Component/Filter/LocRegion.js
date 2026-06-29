Ext.define('App.View.Component.Filter.LocRegion', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-LocRegion',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Location Region:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'clearCombo',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/LocRegion'
                },
                remoteFilter: true
            },
            emptyText: 'All',
            itemId: 'LocRegion',
            width: '48%',
            typeAhead: false,
            valueField: 'Loc_Region',
            displayField: 'Loc_Region',
            value: 'All',
            editable: true,
           listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '<div>' + '{Loc_Region} ' + '</div>';
                }
            },
        }

    ]
});