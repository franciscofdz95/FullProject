/* ====================================================================================================
NAME:			[Origin Cc Filter]
BEHAVIOR:		Shows Origin Cc Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/18/2020        Rama Yagati   		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.OriginCc', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-OriginCc',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Country Origin:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/OriginCc'
                  },
                  remoteFilter: true
              },
              emptyText: 'All',
              itemId: 'OriginCc',
              width: '48%',
              minChars:2,
              typeAhead: true,
              valueField: 'orig_cc',
              displayField: 'orig_cc',
              value: 'All',
              editable: true,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{orig_cc} ' + '</div>';
                  }
              },
          }

    ]
});