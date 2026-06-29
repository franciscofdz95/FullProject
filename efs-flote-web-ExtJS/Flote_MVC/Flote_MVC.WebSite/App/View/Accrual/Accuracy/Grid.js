/* ====================================================================================================
NAME:			[Accrual Accuracy Report]
BEHAVIOR:		Shows Accrual Accuracy Report.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Accrual.Accuracy.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-Accrual-Accuracy-Grid',
    border: true,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/AccrualAccuracy'
        },

        sorters: [
            { property: 'acctg_per_year', direction: 'ASC' },
            { property: 'acctg_per_month', direction: 'DESC' }
        ]
    },
    viewConfig: {
        deferEmptyText: false,
        enableTextSelection: true,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    tbar: [
         {
             xtype: 'App-View-Component-Common-TbarPanel', reportType: 'accrualaccuracy', listeners: {
                 afterrender: function () {
                     this.down('label').setText('Accrual Accuracy Report');
                 }
             }
         }
    ],
    columnLines: true,
    columns: {
        defaults: { menuDisabled: false, align: 'left', border: 1,  sortable: true, autoColumnResize: true },
        cls: 'UBlue',
        items: [
                { text: 'Year', dataIndex: 'acctg_per_year' },
                { text: 'Month', dataIndex: 'acctg_per_month' },
                { text: 'Region', dataIndex: 'Region' },
                { text: 'District', dataIndex: 'District' },
                { text: 'Location', dataIndex: 'Location_code' },
                { text: 'Amount</BR>Paid', align: 'right', dataIndex: 'AmountPaid', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals },
                { text: 'Amount</BR>Accrued', align: 'right', dataIndex: 'AmountAccrued', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals },
                { text: 'Diff.</BR> Amount', align: 'right', dataIndex: 'DiffAmount', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals },
                { text: 'Overall %</BR>Accuracy', align: 'right', dataIndex: 'OverallPercentageAccuracy', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals },
                { text: 'ABS Diff.', align: 'right', dataIndex: 'ABSDiff', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals },
                { text: 'ABS %</BR>Accuracy', align: 'right', dataIndex: 'ABSPercentageAccuracy', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals }

        ]
    }
});