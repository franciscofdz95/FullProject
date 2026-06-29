/* ====================================================================================================
NAME:			[Country Code Filter]
BEHAVIOR:		Shows Country Code Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.Country', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-Country',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Country:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              store:
               {
                   type: 'webapi',
                   api: {
                       read: 'api/WebAPIFilter/Country'
                   },
                   remoteFilter: false
               },
              emptyText: 'Country',
              itemId: 'CountryCode',
              typeAhead: false,
              width: '48%',
              anchor: '100%',
              minChars: 2,
              hideLabel: true,
              hideTrigger: true,
              value: '',
              valueField: 'country_code',
              displayField: 'country_code',
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{Country}' + '</div>';
                  }
              }

          }

    ]
});