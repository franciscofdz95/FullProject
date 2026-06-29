/* ====================================================================================================
NAME:			[Charge Status Filter]
BEHAVIOR:		Shows Charge Status Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.ChargeStatus', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ChargeStatus',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Charge Status:', baseCls: 'UPS_White',   width: '48%'},

          {
              xtype: 'clearCombo',
              emptyText: 'Charge Status',
              itemId:'ChargeStatus',
              allowBlank: false,
              inputWidth: 100,
              width: '48%',           
              store: new Ext.data.SimpleStore({
                   data: [
                       ["", 'All'],
                       ["I", 'Invoiced'],
                       ["U", 'Unreleased']
                   ],                   
                   fields: ['value', 'text']
               }),
               valueField: 'value',
               displayField: 'text',              
               value: 'All',
               editable: false
          }

    ]
});