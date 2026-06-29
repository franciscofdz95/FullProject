/* ====================================================================================================
NAME:			[MBL Cost Basis Filter]
BEHAVIOR:		Shows MBL Cost Basis Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.MBLCostBasis', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-MBLCostBasis',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'MBL Cost Basis:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/MBLCostBasis'
                  },
                  remoteFilter: false
              },
              emptyText: 'MBL Cost Basis',
              itemId: 'MBLCostBasis',
              allowBlank: false,
              editable: false,
              width: '48%',
              valueField: 'cost_basis_code',
              displayField: 'cost_basis_code',
              value: 'All',
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{cost_basis_description}' + '</div>';
                  }
              }
          }

    ]
});