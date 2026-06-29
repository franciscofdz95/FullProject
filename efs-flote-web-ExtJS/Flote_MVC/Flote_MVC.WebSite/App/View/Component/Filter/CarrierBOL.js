/* ====================================================================================================
NAME:			[Carrier BOL Filter]
BEHAVIOR:		Shows Carrier BOL Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.CarrierBOL', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-CarrierBOL',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Carrier BOL:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/CarrierBOL'
                  },
                  remoteFilter: false
              },
              emptyText: 'Carrier BOL',
              itemId: 'CarrierCBOL',
              allowBlank: false,
              width: '48%',
              minChars: 3,
              value: '',
              hideTrigger: true,
              typeAhead: false,
              valueField: 'mbl_iata_busid',
              displayField: 'mbl_iata_busid',
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{mbl_iata_busid}' + '</div>';
                  }
              }

          }

    ]
});