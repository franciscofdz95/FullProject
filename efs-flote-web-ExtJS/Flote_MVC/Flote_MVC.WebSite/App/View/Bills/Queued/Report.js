Ext.define('App.View.Reports.Bills.Queued.Report', {
    extend: 'App.View.Bills.Component.Report',
    alias: 'widget.App-View-Bills-Queued-Report',
    Report: { xtype: 'App-View-Bills-GridShowCheckBox', itemId: 'billQueuedRpt' }, // To remove Duplicate records in Bill Tab for all status    by Sriram
    tabNo: 6,
    columnsToHide: ['', 'ScanFolder', 'Imagefolder', 'ModifiedBy', 'batch_id', 'AP_Vendor_id', 'AP_Remit_id', 'Paid', ''],
    InvoiceStatusName: 'Queued'
});