/* ====================================================================================================
NAME:			[Destination Filter]
BEHAVIOR:		Shows Destination Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.Destination', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-Destination',
    layout: 'hbox',
    //layout: 'column',
    name: 'DestCode',
    width: 220,
    items: [
        { xtype: 'label', text: 'Destination:', baseCls: 'UPS_White', width: '48%' },

        {
            xtype: 'clearCombo',
            store:
            {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/LocationCode'
                },

                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        var geocode = PgAtt.getGeoCode();
                        var geoid = PgAtt.getGeoId(), query = '';

                        if (Ext.ComponentQuery.query('container[name=DestCode] textfield').length > 1) {
                            query = geocode + ',' + geoid + ',' + Ext.ComponentQuery.query('container[name=DestCode] textfield')[1].getValue();
                        } else {
                            query = geocode + ',' + geoid + ',' + Ext.ComponentQuery.query('container[name=DestCode] textfield')[0].getValue();
                        }

                        operation._params.query = query;
                    }
                },
                remoteFilter: false
            },
            emptyText: 'Destination',
            itemId: 'Destination',
            width: '48%',
            minChars: 3,
            value: '',
            hideLabel: true,
            hideTrigger: true,
            typeAhead: false,
            valueField: 'location_code',
            displayField: 'location_code',
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '<div>' + '{location_code} - {location_name}' + '</div>';
                }
            }

        }

    ]
});