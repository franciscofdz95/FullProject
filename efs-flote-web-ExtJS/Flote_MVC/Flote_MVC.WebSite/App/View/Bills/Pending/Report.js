Ext.define('App.View.Reports.Bills.Pending.Report', {
    extend: 'App.View.Bills.Component.Report',
    alias: 'widget.App-View-Bills-Pending-Report',
    Report: { xtype: 'App-View-Bills-Grid', itemId: 'billPendingRpt' },
    tabNo: 1,
    columnsToHide: ['', 'ScanFolder', 'Imagefolder', 'Scandest_Mod', 'ImageNumber', 'batch_id', 'AP_Vendor_id', 'AP_Remit_id', 'Paid', ''],
    InvoiceStatusName: 'Pending'
});