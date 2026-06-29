Ext.define('App.View.Reports.Bills.Sent.Report', {
    extend: 'App.View.Bills.Component.Report',
    alias: 'widget.App-View-Bills-Sent-Report',
    Report: { xtype: 'App-View-Bills-GridShowCheckBox', itemId: 'billSentRpt' }, // To remove Duplicate records in Bill Tab for all status    by Sriram
    tabNo: 7,
    columnsToHide: ['', 'ScanFolder', 'Imagefolder', 'ModifiedBy', 'AP_Vendor_id', 'AP_Remit_id', ''],
    InvoiceStatusName: 'Sent'
});