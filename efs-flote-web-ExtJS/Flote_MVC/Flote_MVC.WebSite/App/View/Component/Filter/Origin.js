/* ====================================================================================================
NAME:			[Origin Filter]
BEHAVIOR:		Shows Origin Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.Origin', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-Origin',
    layout: 'column',
    name: 'OrigCode',
    width: 210,
    items: [
          { xtype: 'label', text: 'Origin:', baseCls: 'UPS_White',   width: '48%'},

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

                             if (Ext.ComponentQuery.query('container[name=OrigCode] textfield').length > 1) {
                                 query = geocode + ',' + geoid + ',' + Ext.ComponentQuery.query('container[name=OrigCode] textfield')[1].getValue();
                             } else {
                                 query = geocode + ',' + geoid + ',' + Ext.ComponentQuery.query('container[name=OrigCode] textfield')[0].getValue();
                             }

                             operation._params.query = query;
                         }
                     },
                     remoteFilter: false
                 },
              emptyText: 'Origin',
              itemId:'Origin',              
              value: '',
              hideLabel: true,
              hideTrigger: true,
              typeAhead: false,
              minChars: 3,
              width: '48%',              
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