/* ====================================================================================================
NAME:			[Bill Payment Detail Report Window]
BEHAVIOR:		Shows Bill Payment Detail Report Window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
04/02/2021        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Reports.Bills.Paymentdetails.Report', {
    extend: 'App.View.Bills.Component.Report',
    alias: 'widget.App-View-Bills-Paymentdetails-Report',
    Report: { xtype: 'App-View-Bills-PaymentDetails-Grid', itemId: 'billPaymentDetailsRpt' },
    tabNo: 9,
    //columnsToHide: ['', 'ScanFolder', 'Scandest_Mod', 'ImageNumber', 'batch_id', 'AP_Vendor_id', 'AP_Remit_id', ''],
    InvoiceStatusName: 'Payment Details'
});