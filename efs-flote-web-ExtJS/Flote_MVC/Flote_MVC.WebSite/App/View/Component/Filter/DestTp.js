/* ====================================================================================================
NAME:			[Origin Tp Filter]
BEHAVIOR:		Shows Origin Tp Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/18/2020        Rama Yagati   		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.DestTp', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-DestTp',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Shipment - Dest:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/DestTp'
                  },
                  remoteFilter: false
              },
              emptyText: 'Shipment - Dest',
              itemId: 'DestTp',
              width: '48%',
              //allowBlank: true,
              minChars: 3,
              hideLabel: true,
              hideTrigger: true,
              typeAhead: false,
              valueField: 'Dest_tp',
              displayField: 'Dest_tp',
              value: '',
              editable: true,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{Dest_tp} ' + '</div>';
                  }
              },
        }
  
    ]
});