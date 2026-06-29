/* ====================================================================================================
NAME:			[Log Vendor Bill Window]
BEHAVIOR:		Shows Log Vendor Bill Window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.LogVendorBill', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-LogVendor-LogVendorBill',
    itemId: 'LogVendorBill',
    title: '<div style="font-weight: bold">Log Vendor Bill</div>',
    width: '55%',
    modal: true,
    height: '90%',
    autoScroll: true,
    bodyPadding: 10,
    bodyStyle: 'background:#EEEEEE',
    defaults: {
        anchor: '100%',
        labelWidth: 100
    },
    items: [
        {
            xtype: 'panel',
            itemId: "panel6",
            layout: 'hbox',
            baseCls: 'UPS_Brown_0',
            border: 0,
            items: [{ xtype: 'label', width: '880px', itemId: 'LVBTips', text: 'All form fields are required.', style: 'background-color : #EEEEEE;color:red;font-weight:bold; font-size:11px;' }]
        },
        {
            xtype: 'panel',
            itemId: "panel4",
            border: 0,
            baseCls: 'UPS_Brown_0',
            // layout: 'hbox',
            layout: {
                type: 'table',
                columns: 4
            },
            items: [
                { xtype: 'App-View-LogVendor-Filter-VendorLocation', margin: '5 5 5 5', itemId: 'filVendorLoctionLVB' },
                { xtype: 'App-View-LogVendor-Filter-Vendor', margin: '5 5 5 5', itemId: 'filVendorLVB' },
                { xtype: 'App-View-LogVendor-Filter-SupplierId', margin: '5 5 5 5', itemId: 'filSupplierIdLVB' },
                { xtype: 'App-View-LogVendor-Filter-RemoteCheckLoc', margin: '5 5 5 5', itemId: 'filRemoteCheckLocLVB' },
                { xtype: 'label', margin: '5 5 5 5', itemId: 'lblEmptyLVB', text: '', hidden: true },
                { xtype: 'App-View-LogVendor-Filter-BillRefNo', margin: '5 5 5 5', itemId: 'filBillRefNoLVB' },
                { xtype: 'App-View-LogVendor-Filter-StampNumber', margin: '5 5 5 5', itemId: 'filStampNumberLVB' },
                { xtype: 'App-View-LogVendor-Filter-OtherRef', margin: '5 5 5 5', itemId: 'filOtherRefLVB' },
                { xtype: 'label', margin: '5 5 5 5', itemId: 'lblOneId', text: '' },
                { xtype: 'App-View-LogVendor-Filter-BillDate', margin: '5 5 5 5', itemId: 'filBillDateLVB' },
                { xtype: 'App-View-LogVendor-Filter-BillDueDate', margin: '5 5 5 5', itemId: 'filBillDueDateLVB' },
                { xtype: 'App-View-LogVendor-Filter-VatPtDate', margin: '5 5 5 5', itemId: 'filVatPtDateLVB' },
                { xtype: 'label', margin: '5 5 5 5', itemId: 'lblTwoId', text: '' },
                { xtype: 'App-View-LogVendor-Filter-BillCurr', margin: '5 5 5 5', itemId: 'filBillCurrLVB' },
                { xtype: 'App-View-LogVendor-Filter-TaxExptAmt', margin: '5 5 5 5', itemId: 'filTaxExptAmtLVB' },
                { xtype: 'App-View-LogVendor-Filter-ACCNo', margin: '5 5 5 5', itemId: 'filACCNoLVB' },
                { xtype: 'label', margin: '5 5 5 5', itemId: 'filGLCurrRateLVB' },
                { xtype: 'label', margin: '5 5 5 5', itemId: 'lblThreeId', text: '', hidden: true },
                { xtype: 'App-View-LogVendor-Filter-UPSRefType', margin: '5 5 5 5', itemId: 'filUPSRefTypeLVB' },
                { xtype: 'App-View-LogVendor-Filter-UPSReference', margin: '5 5 5 5', itemId: 'filUPSReferenceLVB' },
                { xtype: 'App-View-LogVendor-Filter-InvoiceType', margin: '5 5 5 5', itemId: 'filInvoiceTypeLVB' },
                { xtype: 'label', margin: '5 5 5 5', itemId: 'lblFourId', text: '' },
                { xtype: 'App-View-LogVendor-Filter-PayAlone', margin: '5 5 5 5', itemId: 'filPayAloneLVB' }
            ]

        },
        {
            xtype: 'container',
            itemId: 'checkDetailsLVB',
            layout: 'hbox',
            margin: '5 5 5 5',
            baseCls: 'UPS_Brown_0',
            border: 0,
            items:
                [
                    { xtype: 'App-View-LogVendor-Filter-CheckAmt', margin: '5 5 5 5', itemId: 'filCheckAmtLVB' },
                    { xtype: 'App-View-LogVendor-Filter-CheckNo', margin: '5 5 5 5', itemId: 'filCheckNoLVB2' },//
                    { xtype: 'App-View-LogVendor-Filter-BankInfo', margin: '5 5 5 5', itemId: 'filBankInfoLVB' },
                    { xtype: 'App-View-LogVendor-Filter-CheckDate', margin: '5 5 5 5', itemId: 'filCheckDateLVB' }
                ]
        },
        {
            xtype: 'container',
            itemId: 'VatTaxContainer',
            layout: 'hbox',
            border: 1,
            items:
                [
                    { xtype: 'label', text: 'Vat Taxable Amt:', itemId: "lblVatTaxAmt", baseCls: 'UPS_BlackLeft' },
                    { xtype: 'tbfill' },
                    { xtype: 'App-View-LogVendor-Filter-ShowAllVats', margin: '5 5 5 5', itemId: 'filShowAllVatsLVB' }
                ]
        },
        { xtype: 'App-View-LogVendor-VatTaxAmt', itemId: "VatTaxAmtId" },
        { xtype: 'App-View-LogVendor-Filter-LVBButtons', margin: '5 5 5 5' },
        {
            xtype: 'container',
            itemId: 'SiteCodeWarningContainerLS',
            layout: 'hbox',
            border: 0,
            defaults: { margins: '10 10 10 10', region: 'center' },
            // width: '100%',
            items:
                [
                    { xtype: 'tbfill' },
                    {
                        xtype: 'displayfield', fieldLabel: '', labelAlign: 'left', maxWidth: '40%', centered: true, itemId: 'siteCodeWarning', value: '<BR>&nbsp;  STOP – Is Correct SITE CODE Selected? <BR>  <BR>   &nbsp; Otherwise Payment will be Held or Delayed   &nbsp; <BR> &nbsp;',
                        border: 4, bodyPadding: 10, margin: '10 10 10 10', style: 'background-color:yellow;borderColor: black; borderStyle: solid; text-align: center; padding:15 15 15 15;', fieldStyle: 'text-align: center;color:black;font-weight:bold; font-size:14px;'
                    }, { xtype: 'tbfill' }]
        },
        { xtype: 'hiddenfield', itemId: 'SiteCodeCurr', allowBlank: false, value: '' },
        { xtype: 'hiddenfield', itemId: 'VendorHiddenId', allowBlank: false, value: '' },
        { xtype: 'hiddenfield', itemId: 'InvoiceAmt_Org', allowBlank: false, value: '' },
        { xtype: 'hiddenfield', itemId: 'Scan_dest', allowBlank: false, value: '' },
        { xtype: 'hiddenfield', itemId: 'VATTotal_Org', allowBlank: false, value: '0' },
        { xtype: 'hiddenfield', itemId: 'InvoiceAmt_Org', allowBlank: false, value: 'NewInv' },
        { xtype: 'hiddenfield', itemId: 'TotalBillAmount', allowBlank: false, value: '0' },
        { xtype: 'hiddenfield', itemId: 'country_code', allowBlank: false, value: '' },
        { xtype: 'hiddenfield', itemId: 'Inv_ID', allowBlank: false, value: '0' },
        { xtype: 'hiddenfield', itemId: 'edit_Invoice_Click', allowBlank: false, value: '0' },
        { xtype: 'hiddenfield', itemId: 'Inv_InvalidList', allowBlank: false, value: '' },
        { xtype: 'hiddenfield', itemId: 'TWHFlag', allowBlank: false, value: 'N' },
        { xtype: 'hiddenfield', itemId: 'Inv_Location', allowBlank: false, value: 'N' },
        { xtype: 'hiddenfield', itemId: 'Invoice_Status', allowBlank: false, value: '' },
        { xtype: 'hiddenfield', itemId: 'SupplierId', allowBlank: false, value: 'N' }

    ]

}
);
