Ext.define('App.View.Reports.Bills.Archived.Report', {
    extend: 'App.View.Bills.Component.Report',
    alias: 'widget.App-View-Bills-Archived-Report',
    Report: { xtype: 'App-View-Bills-Grid', itemId: 'billArchivedRpt' },
    tabNo: 8,
    columnsToHide: ['', 'Imagefolder', 'ModifiedBy', 'AP_Vendor_id', 'AP_Remit_id', ''],
    InvoiceStatusName: 'Archived'
});