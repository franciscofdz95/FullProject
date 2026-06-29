Ext.define('App.View.Reports.Bills.Scanned.Report', {
    extend: 'App.View.Bills.Component.Report',
    alias: 'widget.App-View-Bills-Scanned-Report',
    Report: { xtype: 'App-View-Bills-GridShowCheckBox', itemId: 'billScannedRpt' }, // To remove Duplicate records in Bill Tab for all status    by Sriram
    tabNo: 5,
    columnsToHide: ['', 'ScanFolder', 'ImageFolder', 'batch_id', 'ModifiedBy', ''],
    InvoiceStatusName: 'Scanned'
});