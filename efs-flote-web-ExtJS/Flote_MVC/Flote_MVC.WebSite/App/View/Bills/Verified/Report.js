Ext.define('App.View.Reports.Bills.Verified.Report', {
    extend: 'App.View.Bills.Component.Report',
    alias: 'widget.App-View-Bills-Verified-Report',
    Report: { xtype: 'App-View-Bills-Grid', itemId: 'billVerifiedRpt' },
    tabNo: 2,
    columnsToHide: ['', 'ScanFolder', 'Imagefolder', 'Scandest_Mod', 'ImageNumber', 'batch_id', 'AP_Vendor_id', 'AP_Remit_id', 'Paid', ''],
    InvoiceStatusName: 'Verified'
});