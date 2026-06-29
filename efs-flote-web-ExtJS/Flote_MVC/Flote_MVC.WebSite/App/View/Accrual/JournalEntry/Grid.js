/* ====================================================================================================
NAME:			[Accrual Month Journal Entry Report]
BEHAVIOR:		Shows Accrual Accuracy Month Journal Entry Report.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Accrual.JournalEntry.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-Accrual-JournalEntry-Grid',
    border: true,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/AccrualMonJrnlRpt'
        },

        sorters: [
            { property: 'cost_loc_code', direction: 'ASC' }

        ]
    },
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    tbar: [
         {
             xtype: 'App-View-Component-Common-TbarPanel', reportType: 'accrualMonJEntry', listeners: {
                 afterrender: function () {
                     this.down('label').setText('Accrual Monthly Journal Entry');
                 }
             }
         }
    ],
    columnLines: true,
    columns: {
        defaults: { menuDisabled: false, align: 'left', border: 1,  sortable: true, autoColumnResize: true },
        cls: 'UBlue',
        items: [
                {
                    text: 'COMP.', dataIndex: 'COMPANY'

                },
                {
                    text: 'RRDD', dataIndex: 'RRDD'

                },
                {
                    text: 'CENTER', dataIndex: 'CENTER'

                },
                {
                    text: 'OPERATION', dataIndex: 'OPERATION'

                },
                  {
                      text: 'PROD.', dataIndex: 'PRODUCT'

                  },
                   {
                       text: 'ACC.', dataIndex: 'ACCOUNT'

                   },
                {
                    text: 'DEBIT', align: 'right', dataIndex: 'DEBIT'
                    , renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'CREDIT', align: 'right', dataIndex: 'CREDIT'
                    , renderer: Utility.Formatting.NumFormat_Thousands_2Decimals

                },
                {
                    text: 'LINE DESCRIPTION', dataIndex: 'LINE_DESCRIPTION'

                },
                {
                    text: 'STAT AMOUNT', align: 'right', dataIndex: 'STATAMOUNT'
                    , renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'Captured Info', dataIndex: 'Captured_Info_DFF'

                }

        ]
    }
});