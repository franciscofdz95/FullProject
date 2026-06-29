Ext.define('App.View.Component.Filter.LocCountry', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-LocCountry',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Location Country:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'clearCombo',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/LocCountry'
                },
                remoteFilter: true
            },
            emptyText: 'Location Country',
            itemId: 'LocCountry',
            typeAhead: false,
            width: '48%',
            //allowBlank: false,
            minChars: 3,
            hideLabel: true,
            hideTrigger: true,
            valueField: 'Loc_Country',
            displayField: 'Loc_Country',
            value: '',
            editable: true,
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '<div>' + '{Loc_Country} ' + '</div>';
                }
            },

        }
        
    ]
});