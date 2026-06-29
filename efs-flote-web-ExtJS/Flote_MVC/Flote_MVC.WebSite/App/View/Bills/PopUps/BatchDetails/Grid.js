/* ====================================================================================================
NAME:			[Scan Image Search]
BEHAVIOR:		Scan Image search result grid for Invoice Reference Number.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/22/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Reports.Bills.PopUps.BatchDetails.Grid', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-View-Bills-PopUps-BatchDetails-Grid',
    border: true,
    rec: '',
    store:
        {
            type: 'webapi',
            api: {
                read: 'api/WebAPIReport/GetBatchDetailsData'
            }
        },
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'Click Search to begin.',
        forceFit: true
    },
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left' },
    cls: 'UBlue',
    columns: [
         {
             text: '<Div style="color:white;">Batch Id</Div>', dataIndex: 'batch_id', cls: 'UBlue', border: 1, autoColumnResize: true,
             style: {
                 borderColor: 'white',
                 borderStyle: 'thin'
             },
             renderer: function (value, metaData, record, row, col, store, gridView) {
                 var win = this.up('window');
                 if (row == 0) {
                     if (record.get("BYPASS_IM") == "N") {
                         win.down('#btnArchivedBatchId').setVisible(false);
                     } else {
                         win.down('#btnArchivedBatchId').setVisible(true);
                     }
                 }
                 return value;
             }

         },

           {
               text: '<Div style="color:white;">Invoice Attached</Div>', dataIndex: 'invoices_attached', cls: 'UBlue', border: 1, autoColumnResize: true,
               style: {
                   borderColor: 'white',
                   borderStyle: 'thin'
               }
           },
           {
               text: '<Div style="color:white;">Total Buy Amount</Div>', dataIndex: 'total_buy_amount', cls: 'UBlue', border: 1, autoColumnResize: true,
               style: {
                   borderColor: 'white',
                   borderStyle: 'thin'
               }
           },
           {
               text: '<Div style="color:white;">Processed Dt</Div>', dataIndex: 'processed_dt', cls: 'UBlue', border: 1, autoColumnResize: true,
               style: {
                   borderColor: 'white',
                   borderStyle: 'thin'
               }
           }
    ]

});
