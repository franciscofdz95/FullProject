Ext.define('App.View.Reports.Bills.Printed.Report', {
    extend: 'App.View.Bills.Component.Report',
    alias: 'widget.App-View-Bills-Printed-Report',
    Report: { xtype: 'App-View-Bills-Grid', itemId: 'billPrintedRpt' },
    tabNo: 4,
    columnsToHide: ['', 'ScanFolder', 'Scandest_Mod', 'ImageNumber', 'batch_id', 'ModifiedBy', 'AP_Remit_id', 'Paid', ''],
    InvoiceStatusName: 'Printed'
});