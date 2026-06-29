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
Ext.define('App.View.Component.Filter.MblNbrFlag', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-MblNbrFlag',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Masterbill Charge', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              emptyText: 'Masterbill Charge',
              itemId: 'MblNbrFlag',
              //allowBlank: false,
              width: '48%',
              store: new Ext.data.SimpleStore({
                  data: [
                      ['Yes', 'Yes'],
                      ['No', 'No']
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