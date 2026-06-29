/* ====================================================================================================
NAME:			[Region Destination  Filter]
BEHAVIOR:		Shows Region Destination  Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/20/2020        Rama Yagati   		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.RegionDest', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-RegionDest',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Region Dest:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/RegionDest'
                  },
                  remoteFilter: true
              },
              emptyText: 'All',
              itemId: 'RegionDest',
              width: '48%',
              //allowBlank: false,
              typeAhead: false,
              valueField: 'Region_Dest',
              displayField: 'Region_Dest',
              value: 'All',
              editable: true,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{Region_Dest} ' + '</div>';
                  }
              },
          }

    ]
});