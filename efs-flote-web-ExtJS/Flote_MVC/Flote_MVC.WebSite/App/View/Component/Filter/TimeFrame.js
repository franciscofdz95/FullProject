/* ====================================================================================================
NAME:			[Time Frame Filter]
BEHAVIOR:		Shows Time Frame Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/20/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.TimeFrame', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-TimeFrame',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Time Frame:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              emptyText: 'Time Frame',
              itemId: 'TimeFrame',
             // allowBlank: false,
              width: '48%',
              store: new Ext.data.SimpleStore({
                  data: [
                      ['0', '0'],
                      ['1', '1']
                  ],
                  //itemId: 0,
                  fields: ['value', 'text']
              }),
              valueField: 'text',
              value: 'All',
              displayField: 'text',
              triggerAction: 'all',
              editable: false

          }

    ]
});