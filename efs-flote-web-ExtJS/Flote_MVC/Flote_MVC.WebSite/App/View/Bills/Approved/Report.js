Ext.define('App.View.Reports.Bills.Approved.Report', {
    extend: 'App.View.Bills.Component.Report',
    alias: 'widget.App-View-Bills-Approved-Report',
    Report: { xtype: 'App-View-Bills-Grid', itemId: 'billApprovedRpt' },
    tabNo: 3,
    columnsToHide: ['', 'ScanFolder', 'Scandest_Mod', 'ImageNumber', 'batch_id', 'AP_Vendor_id', 'AP_Remit_id','Paid' ,''],
    InvoiceStatusName: 'Approved'
});