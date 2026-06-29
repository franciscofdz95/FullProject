/* ====================================================================================================
NAME:			[Origin/Dest Filter]
BEHAVIOR:		Shows Origin/Dest Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.OrigDest', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-OrigDest',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Orig/Dest:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              emptyText: 'Orig/Dest',
              itemId: 'OrigDest',
              width: '48%',
              store: new Ext.data.SimpleStore({
                  data: [
                      ["", 'All'],
                      ["O", 'Origin'],
                      ["D", 'Destination']
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