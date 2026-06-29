Ext.define('App.View.Bills.PopUps.BillReference.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Bills-PopUps-BillReference-Window',
    itemId: 'BillRef',
    width: '90%',
    modal: true,
    autoScroll: false,
    layout: {
        type: 'vbox',
        align: 'stretch',
        bodyStyle: 'padding:15px'
    },
    
    items: [
                    { xtype: 'label', margin: '10 5 5 5',  itemId: 'billRefId',  style: 'font-weight:bold; font-size:12px;' },
                    { xtype: 'label', margin: '10 5 5 5',  itemId: 'VendorCode', style: 'font-weight:bold; font-size:12px;' },
                    { xtype: 'label', margin: '10 5 5 5',  itemId: 'VendorName', style: 'font-weight:bold; font-size:12px;' },
                    { xtype: 'label', margin: '10 5 5 5',  itemId: 'billStatus', style: 'font-weight:bold; font-size:12px;' },
                    { xtype: 'App-View-Bills-PopUps-BillReference-Grid',layout:'auto', itemId: "BillReferenceGridId" }
    ]

});