Ext.define('App.View.Main.TabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.App-View-Main-TabPanel',
    defaults: { hidden: false, border: true },
    items: [
        {
            xtype: 'App-View-Home-Report', title: 'Home',
            itemId: 'floteHomeTabId'
        },
        {
            xtype: 'App-View-LocationShipment-Report',
            html: HTMLFontElement,
            title: 'Location Shipment',
            itemId: 'locShipmentTabId'
        },
        {
            xtype: 'App-View-LocationMBL-Report',
            itemId: 'locOceanMBLTabId',
            title: 'Location Ocean MBL'
        },
        {
            xtype: 'App-View-Bills-TabPanel',
            itemId: 'AppBillTabPanelId'
        },
        {
            xtype: 'App-View-LocationVendor-Report',
            itemId: 'locVendorTabId',
            title: 'Location Vendor'
        },
        {
            xtype: 'App-View-VendorShipment-Report',
            itemId: 'vendorShipTabId',
            title: 'Vendor Shipment'
        },
        {
            xtype: 'App-View-Vendors-Report',
            itemId: 'vendorTabId',
            title: 'Vendors'
        },
        {
            xtype: 'App-View-Accrual-AccrualsTab',
            title: 'Accruals',
            itemId: 'AppAccrualsTabId'

        }, {
            xtype: 'App-View-CBOL-TabPanel',
            title: 'Vendor Statement Summary',
            itemId: 'appCbolSumId',
            disabled: true
        },
        {
            xtype: 'App-View-InvoiceProcessing-Report',
            title: 'Invoice Processing',
            itemId: 'InvoiceProcessingId',
            disabled: true
        },
        {
            xtype: 'App-View-PaidDifferently-Report',
            title: 'Paid Differently',
            itemId: 'PaidDifferentlyId'

        }

    ]
});


