/* ====================================================================================================
NAME:			[Accrual Report Tab]
BEHAVIOR:		Shows all Accrual Reports.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Accrual.AccrualsTab', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.App-View-Accrual-AccrualsTab',
    cls: 'tabpanel',
    title: 'Accruals',
    items: [
        //{
        //    xtype: 'App-View-Accrual-JournalEntry-Report',
        //    title: 'Accrual Monthly Journal Entry',
        //    itemId: 'accuralMonJrnlId'
        //},
        {
            xtype: 'App-View-Accrual-Details-Report',
            title: 'Accrual Monthly Details',
            itemId: 'accuralMonDetail'
        },
        {
            xtype: 'App-View-Accrual-Accuracy-Report',
            title: 'Accrual Accuracy Report',
            itemId: 'accrualAccuracyId'
        }
        //,
        //{
        //    xtype: 'App-View-PaidDifferently-Report',
        //    title: 'Paid Differently',
        //    itemId: 'PaidDifferentlyId'

        //},
        //{
        //    xtype: 'App-View-PaidDifferently-Report',
        //    title: 'Demurrage',
        //    itemId: 'DemurrageId',
        //    disabled: true

        //}
    ]

});