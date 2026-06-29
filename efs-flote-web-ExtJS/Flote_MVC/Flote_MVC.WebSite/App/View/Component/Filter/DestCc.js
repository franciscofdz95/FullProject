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
Ext.define('App.View.Component.Filter.DestCc', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-DestCc',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Country Dest:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/DestCc'
                  },
                  remoteFilter: true
              },
              emptyText: 'All',
              itemId: 'DestCc',
              width: '48%',
              //allowBlank: false,
              minChars: 2,
              typeAhead: true,
              valueField: 'Dest_cc',
              displayField: 'Dest_cc',
              value: 'All',
              editable: true,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{Dest_cc} ' + '</div>';
                  }
              },
          }

    ]
});