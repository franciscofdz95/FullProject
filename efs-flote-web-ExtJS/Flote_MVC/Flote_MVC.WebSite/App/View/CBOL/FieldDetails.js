/* ====================================================================================================
NAME:			[Invoice Processing Detail Fields]
BEHAVIOR:		Shows Invoice  processing Detail Fields info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/30/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.CBOL.FieldDetails', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-CBOL-FieldDetails',
    itemId: 'cbolFieldDetailsId',
    title: '<Div style="backfont-size:16px;font-weight:bold;background-color : #1D598E;color:white;">Vendor Statement Summary :</Div>',
    baseCls: 'UPS_Brown_4',
    layout: 'hbox',
    margin: '5 5 5 5',
    loadValues: function () {
        var pageType = 'All'
        if (CBOLSinCls.getCbolPageType() == 'CC') {
            pageType = 'Total';
        }
        var jsonObject = IProcessingSCls.getInvoiceChargesDetails(PgAtt.getInvoice_id(), pageType);
        this.getForm().setValues(jsonObject);
    },
    items: [
        { xtype: 'displayfield', width: '5%', fieldLabel: 'Bill Id:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', name: 'invoice_id', border: 1, margin: '22 0 5 0', labelAlign: 'top', fieldStyle: ';font-weight:bold; font-size:10px;', style: 'border: 1px solid ;' },
        { xtype: 'displayfield', width: '7%', fieldLabel: 'Vendor Code:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', name: 'vendor_code', border: 1, margin: '22 0 5 0', labelAlign: 'top', fieldStyle: ';font-weight:bold; font-size:10px;', style: 'border: 1px solid ;' },
        { xtype: 'displayfield', width: '20%', fieldLabel: 'Vendor Name:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', name: 'Vendor_Name_English', border: 1, margin: '22 0 5 0', labelAlign: 'top', fieldStyle: ';font-weight:bold; font-size:10px;', style: 'border: 1px solid ;' },
        { xtype: 'displayfield', width: '7%', fieldLabel: 'Bill Ref No:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', name: 'InvRefNo', border: 1, margin: '22 0 5 0', labelAlign: 'top', fieldStyle: ';font-weight:bold; font-size:10px;', style: 'border: 1px solid ;' },
        { xtype: 'displayfield', width: '7%', fieldLabel: 'Bill Currency:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', name: 'Invoice_CID', border: 1, margin: '22 0 5 0', labelAlign: 'top', fieldStyle: ';font-weight:bold; font-size:10px;', style: 'border: 1px solid ;' },
        {
            xtype: 'displayfield', width: '10%', fieldLabel: 'Tot Invoice Amt:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', name: 'Tot_Invoice_Amt', margin: '22 0 5 0', labelAlign: 'top', style: 'border: 1px solid ;', fieldStyle: ';font-weight:bold; font-size:10px;',
            renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            xtype: 'displayfield', width: '10%', fieldLabel: 'Tot E2k Buy Amt:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', name: 'Tot_E2k_buy_Amt', margin: '22 0 5 0', labelAlign: 'top', style: 'border: 1px solid ;', fieldStyle: ';font-weight:bold; font-size:10px;',
            renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            xtype: 'displayfield', width: '10%', fieldLabel: 'Tot Diff Amt:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', name: 'Tot_Diff_Amt', margin: '22 0 5 0', labelAlign: 'top', style: 'border: 1px solid ;', fieldStyle: ';font-weight:bold; font-size:10px;',
            renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            xtype: 'displayfield', width: '10%', fieldLabel: 'Selected Charges:', name: 'Total_Processed', labelStyle: 'color:white;font-weight:bold; font-size:11px;', margin: '22 0 5 0', labelAlign: 'top', style: 'border: 1px solid ;', fieldStyle: ';font-weight:bold; font-size:10px;',
            renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            xtype: 'displayfield', width: '10%', fieldLabel: 'Unselected Charges:', name: 'UnSelectedCharges', labelStyle: 'color:white;font-weight:bold; font-size:11px;', margin: '22 0 5 0', labelAlign: 'top', style: 'border: 1px solid ;', fieldStyle: ';font-weight:bold; font-size:10px;',
            renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        }
    ]
});