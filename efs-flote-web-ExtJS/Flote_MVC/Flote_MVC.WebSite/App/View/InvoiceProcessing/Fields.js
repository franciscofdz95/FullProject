/* ====================================================================================================
NAME:			[Invoice Processing Detail Fields]
BEHAVIOR:		Shows Invoice  processing Detail Fields info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.InvoiceProcessing.Fields', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-InvoiceProcessing-Fields',
    itemId: 'InvoiceDetailsId',
    baseCls: 'UPS_Greenish_1',
    collapsible: true,
    animCollapse: false,
    layout: {
        type: 'hbox'
    },
    loadValues: function () {
        var invId = '0';
        if (IProcessingSCls.getInvoice_id() != 0) {
            invId = IProcessingSCls.getInvoice_id();
        } else {
            invId = PgAtt.getInvoice_id();
        }
        var jsonObject = IProcessingSCls.getInvoiceChargesDetails(invId);
        this.getForm().setValues(jsonObject);
        if (jsonObject != null) {
            if (jsonObject.Total_Variance == 0 && jsonObject.VAT_Variance == 0 && jsonObject.TWH_Variance == 0 && jsonObject.Charges_Variance == 0) {
                this.down('#btnVerifyButtonLV').setVisible(true);
            }
            else {
                this.down('#btnVerifyButtonLV').setVisible(false);
            }
        }
    },
    items: [
        {
            xtype: 'fieldset',
            layout: {
                type: 'table',
                columns: 3
            },
            items: [
                { xtype: 'displayfield', width: '180px', fieldLabel: 'Bill Id', labelStyle: 'font-weight:bold; font-size:11px;', name: 'invoice_id', border: 1, margin: '0 0 0 0', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;', style: 'border: 1px solid white;border-color:#FFFFFF;', labelAlign: 'top' },
                { xtype: 'displayfield', width: '180px', fieldLabel: 'Vendor Code', labelStyle: 'font-weight:bold; font-size:11px;', name: 'vendor_code', border: 1, margin: '0 0 0 0', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;', style: 'border: 1px solid white;border-color:#FFFFFF;', labelAlign: 'top' },
                { xtype: 'displayfield', itemId: 'vendorNameIdBP', width: '200px', fieldLabel: 'Vendor Name', labelStyle: 'font-weight:bold; font-size:11px;', name: 'Vendor_Name_English', border: 1, margin: ' 0 0 0', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;', style: 'border: 1px solid white;border-color:#FFFFFF;', labelAlign: 'top' },
                { xtype: 'displayfield', itemId: 'e2kCarCodeIdBP', width: '180px', fieldLabel: 'E2k Carrier Code', labelStyle: 'font-weight:bold; font-size:11px;', name: 'E2K_CARRIER_CODE', border: 1, margin: '0 0 0 0', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;', style: 'border: 1px solid white;border-color:#FFFFFF;', labelAlign: 'top' },
                { xtype: 'displayfield', width: '180px', fieldLabel: 'Bill Ref No', labelStyle: 'font-weight:bold; font-size:11px;', name: 'InvRefNo', border: 1, margin: '0 0 0 0', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;', style: 'border: 1px solid white;border-color:#FFFFFF;', labelAlign: 'top' },
                { xtype: 'displayfield', width: '200px', fieldLabel: 'Bill Curr', labelStyle: 'font-weight:bold; font-size:11px;', name: 'Invoice_CID', border: 1, margin: '0 0 0 0', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;', style: 'border: 1px solid white;border-color:#FFFFFF;', labelAlign: 'top' },
            ]
        },
        {
            xtype: 'fieldset',
            layout: {
                type: 'table',
                columns: 3
            },
            items: [
                { xtype: 'label', width: '180px', text: 'Logged', style: 'color:#1D598E;font-weight:bold; font-size:12px;border: 1px solid white;border-color:#FFFFFF;', margin: '0 0 0 0' },
                { xtype: 'label', width: '180px', text: 'Processed', margin: '0 0 0 0', style: 'color:#1D598E;font-weight:bold; font-size:12px; border: 1px solid white;border-color:#FFFFFF;' },
                { xtype: 'label', width: '180px', text: 'Variance', margin: '0 0 0 0', style: 'color:#1D598E;font-weight:bold; font-size:12px; border: 1px solid white;border-color:#FFFFFF;' },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Charges', name: 'Charges_Logged', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', labelAlign: 'left', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Charges', name: 'Charges_Processed', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Charges', name: 'Charges_Variance', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Vat', name: 'VAT_Logged', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Vat', name: 'VAT_Processed', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Vat', name: 'VAT_Variance', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Withholding', name: 'TWH_Logged', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Withholding', name: 'TWH_Processed', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Withholding', name: 'TWH_Variance', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'OSOffset', name: 'OSOffset_Logged', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'OSOffset', name: 'OSOffset_Processed', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'OSOffset', name: 'OSOffset_Variance', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Total Billed', name: 'Total_Logged', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Total Billed', name: 'Total_Processed', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    xtype: 'displayfield', width: '180px', fieldLabel: 'Total Billed', name: 'Total_Variance', labelStyle: 'font-weight:bold; font-size:11px;', margin: '0 0 0 0', style: 'border: 1px solid white;border-color:#FFFFFF;', fieldStyle: ';font-weight:bold; font-size:10px;min-height:0px;',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                }

            ]
        },
        {
            xtype: 'container',
            baseCls: 'UPS_Greenish_1',
            items: [
                { xtype: 'button', itemId: 'btnVerifyButtonLV', hidden: true, cls: 'btn', margin: '5 0 0 5', text: '<div style="font-weight: bold;">Verify</div>' },
                { xtype: 'button', itemId: 'btnCloseButtonLV', cls: 'btn', margin: '5 0 0 5', text: '<div style="font-weight: bold;">Close</div>' }
            ]
        }
    ]
});