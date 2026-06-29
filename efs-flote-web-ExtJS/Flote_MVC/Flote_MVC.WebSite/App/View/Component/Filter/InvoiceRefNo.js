/* ====================================================================================================
NAME:			[Invoice Ref Number Filter]
BEHAVIOR:		Shows Invoice Ref Number Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.InvoiceRefNo', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-InvoiceRefNo',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Invoice Ref No:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/InvRefNo'
                  },
                  remoteFilter: false
              },
              emptyText: 'Invoice Ref No',
              itemId: 'InvoiceRefNo',
              allowBlank: true,
              width: '48%',
              value: '',
              hideLabel: true,
              hideTrigger: true,
              typeAhead: false,
              minChars: 3,
              valueField: 'invrefno',
              displayField: 'invrefno',
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{invrefno}' + ' - ' + '{vendor_name_english} ' + '</div>';
                  }
              }
          }
    ]
});