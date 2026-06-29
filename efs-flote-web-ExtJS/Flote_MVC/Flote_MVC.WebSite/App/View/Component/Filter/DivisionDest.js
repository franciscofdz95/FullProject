/* ====================================================================================================
NAME:			[Origin Cc Filter]
BEHAVIOR:		Shows Division Origin  Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/16/2020        Rama Yagati   		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.DivisionDest', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-DivisionDest',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Division Dest:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/DivisionDest'
                  },
                  remoteFilter: true
              },
              emptyText: 'All',
              itemId: 'DivisionDest',
              width: '48%',
              //allowBlank: false,
              minChars: 3,
              typeAhead: true,
              valueField: 'DIVN_CODE',
              displayField: 'DIVN_NAME',
              value: 'All',
              editable: true,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{DIVN_NAME} ' + '</div>';
                  }
              },
          }

    ]
});