/* ====================================================================================================
NAME:			[Charge Code Filter]
BEHAVIOR:		Shows Charge Code Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.ChargeCode', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ChargeCode',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Charge Code:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/ChargeCode'
                  },
                  remoteFilter: false
              },
              emptyText: 'Charge Code',
              itemId: 'ChargeCode',
              width: '48%',
              value: '',
              hideLabel: true,
              hideTrigger: true,
              typeAhead: false,
              minChars: 2,
              valueField: 'charge_code',
              displayField: 'charge_code',
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{charge_code}' + '</div>';
                  }
              }


          }

    ]
});