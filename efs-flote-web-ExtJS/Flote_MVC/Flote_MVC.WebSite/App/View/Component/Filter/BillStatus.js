/* ====================================================================================================
NAME:			[Bill Status Filter]
BEHAVIOR:		Shows Bill Status Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.BillStatus', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-BillStatus',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Bill Status:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              emptyText: 'Invoice Status',
              itemId: 'InvoiceStatus',
              allowBlank: false,
              width: '48%',
              store: new Ext.data.SimpleStore({
                  data: [
                      ['All', 'All'],
                      ['Logged', 'Logged'],
                      ['Pending', 'Pending'],
                      ['Verified', 'Verified'],
                      ['Approved', 'Approved'],
                      ['Printed', 'Printed'],
                      ['Scanned', 'Scanned'],
                      ['Queued', 'Queued'],
                      ['Sent', 'Sent'],
                      ['Archived', 'Archived']
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