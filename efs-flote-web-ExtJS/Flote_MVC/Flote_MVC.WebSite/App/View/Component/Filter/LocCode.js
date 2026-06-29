/* ====================================================================================================
NAME:			[Location  Code Filter]
BEHAVIOR:		Shows Location Code Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.LocCode', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-LocCode',
    name: 'LocCode',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Location Code:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'clearCombo',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/LocationCode'
                },
                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        var geocode = PgAtt.getGeoCode();
                        var geoid = PgAtt.getGeoId(), query = '';

                        if (Ext.ComponentQuery.query('container[name=LocCode] textfield').length > 1) {
                            query = geocode + ',' + geoid + ',' + Ext.ComponentQuery.query('container[name=LocCode] textfield')[1].getValue();
                        } else {
                            query = geocode + ',' + geoid + ',' + Ext.ComponentQuery.query('container[name=LocCode] textfield')[0].getValue();
                        }

                        operation._params.query = query;
                    }
                },
                remoteFilter: false
            },
            itemId: 'LocCode',
            emptyText: 'Location Code',
            width: '48%',
            valueField: 'location_code',
            displayField: 'location_code',
            anchor: '100%',
            minChars: 3,
            value: '',
            hideLabel: true,
            hideTrigger: true,
            typeAhead: false,
            scope: this,
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '<div>' + '{location_code} - {location_name}' + '</div>';
                }
            }
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#LocCode').getRawValue();
        // forceSelection: true makes this a bit retarded.
        return (value) ? 'Location Code: ' + value : '';
    }
});


