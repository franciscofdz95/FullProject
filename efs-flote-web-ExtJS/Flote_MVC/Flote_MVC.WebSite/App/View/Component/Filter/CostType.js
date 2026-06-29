/* ====================================================================================================
NAME:			[Cost Type Filter]
BEHAVIOR:		Shows Cost Type Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.CostType', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-CostType',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Cost Type:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              itemId: 'CostType',
              emptyText: 'Cost Type',
              width: '48%',
              store: new Ext.data.SimpleStore({
                  data: [
                      ["", 'All'],
                      ["L", 'Local'],
                      ["M", 'Manifested']
                  ],
                  //itemId: 0,
                  fields: ['value', 'text']
              }),
              valueField: 'value',
              displayField: 'text',
              allowBlank: false,
              value: 'All',
              editable: false,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{text}' + '</div>';
                  }
              }

          }

    ]
});