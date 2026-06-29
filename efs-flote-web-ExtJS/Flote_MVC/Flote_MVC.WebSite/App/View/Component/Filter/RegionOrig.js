/* ====================================================================================================
NAME:			[Region Origin  Filter]
BEHAVIOR:		Shows Region Origin  Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/20/2020        Rama Yagati   		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.RegionOrig', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-RegionOrig',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Region Origin:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/RegionOrig'
                  },
                  remoteFilter: true
              },
              emptyText: 'All',
              itemId: 'RegionOrig',
              width: '48%',
              //allowBlank: false,
              typeAhead: false,
              valueField: 'Region_Orig',
              displayField: 'Region_Orig',
              value: 'All',
              editable: true,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{Region_Orig} ' + '</div>';
                  }
              },
          }

    ]
});