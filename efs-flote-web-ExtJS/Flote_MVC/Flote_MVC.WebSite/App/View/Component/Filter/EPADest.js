/* ====================================================================================================
NAME:			[Origin Cc Filter]
BEHAVIOR:		Shows EPA LOC Destination Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/13/2020        Rama Yagati   		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.EPADest', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-EPADest',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'EPA Dest:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/EPADest'
                  },
                  remoteFilter: true
              },
              emptyText: 'All',
              itemId: 'EPADest',
              width: '48%',
              //allowBlank: false,
              minChars: 3,
              typeAhead: true,
              valueField: 'EPA_DEST',
              displayField: 'EPA_DEST',
              value: 'All',
              editable: true,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{EPA_DEST} ' + '</div>';
                  }
              },
          }

    ]
});