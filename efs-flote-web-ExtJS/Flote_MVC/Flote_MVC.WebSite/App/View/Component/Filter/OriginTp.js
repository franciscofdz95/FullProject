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
Ext.define('App.View.Component.Filter.OriginTp', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-OriginTp',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Shipment - Orig:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/OriginTp'
                  },
                  remoteFilter: true
              },
              emptyText: 'Shipment - Orig',
              itemId: 'OriginTp',
              width: '48%',
              //allowBlank: true,
              typeAhead: false,
              minChars: 3,
              hideLabel: true,
              hideTrigger: true,
              valueField: 'orig_tp',
              displayField: 'orig_tp',
              value: '',
              editable: true,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{orig_tp} ' + '</div>';
                  }
              },
        }

        
    ]
});