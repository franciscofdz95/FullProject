Ext.define('App.View.Reports.Bills.Logged.Report', {
    extend: 'App.View.Bills.Component.Report',
    alias: 'widget.App-View-Bills-Logged-Report',
    Report: { xtype: 'App-View-Bills-Grid', itemId: 'billLoggedRpt' },
    tabNo: 0,
    columnsToHide: ['', 'detail_cnt', 'ScanFolder', 'Imagefolder', 'Scandest_Mod', 'ImageNumber', 'batch_id', 'AP_Vendor_id', 'AP_Remit_id', 'Paid', ''],
    InvoiceStatusName: 'Logged'
});