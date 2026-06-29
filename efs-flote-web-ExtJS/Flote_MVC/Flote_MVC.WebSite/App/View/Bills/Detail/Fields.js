/* ====================================================================================================
NAME:			[Bill Detail Field Info]
BEHAVIOR:		Shows Bill Detail Field Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Bills.Detail.Fields', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-Bills-Detail-Fields',
    baseCls: 'UPS_Greenish_1',    
    layout: {
        type: 'table',
        columns: 3
    },
    loadValues: function (jsonObject) {        
        this.getForm().setValues(jsonObject);
    },
    items: [
            { xtype: 'displayfield', fieldLabel: 'Bill ID', itemId: 'billId', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', name: 'Invoice_id', border: 2, margin: '2 2 2 2' },
            { xtype: 'displayfield', fieldLabel: 'Bill Ref. No:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', name: 'InvRefNo', border: 2, margin: '2 2 2 2' },
            { xtype: 'displayfield', fieldLabel: 'E2K Carrier Code:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', name: 'e2k_carrier_code', border: 2, margin: '2 2 2 2' },
            { xtype: 'displayfield', fieldLabel: 'Vendor Name:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', name: 'vendor_name_english', border: 2, margin: '2 2 2 2' },
            { xtype: 'displayfield', fieldLabel: 'Vendor Code:', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', name: 'vendor_code', border: 2, margin: '2 2 2 2' },
            { xtype: 'displayfield', fieldLabel: 'Vendor Number:', name: 'AP_Vendor_ID', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', margin: '2 2 2 2' },
            { xtype: 'displayfield', fieldLabel: 'Vendor Site Code:', name: 'AP_Remit_id', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', margin: '2 2 2 2' },
            { xtype: 'displayfield', fieldLabel: 'Location Code:', name: 'location_code', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', margin: '2 2 2 2' },
            { xtype: 'displayfield', fieldLabel: 'Bill Currency:', name: 'Invoice_CID', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', margin: '2 2 2 2' },
            { xtype: 'displayfield', fieldLabel: 'Bill Date:', name: 'InvoiceDate', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', margin: '2 2 2 2', renderer: BIA.util.Format.dateRenderer('m/d/Y') },
            { xtype: 'displayfield', fieldLabel: 'Bill Due Date:', name: 'InvoiceDueDate', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', margin: '2 2 2 2', renderer: BIA.util.Format.dateRenderer('m/d/Y') },
            { xtype: 'displayfield', fieldLabel: 'VAT Point Date:', name: 'VATPointDate', labelStyle: 'color:white;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', margin: '2 2 2 2', renderer: BIA.util.Format.dateRenderer('m/d/Y') }
    ]
});