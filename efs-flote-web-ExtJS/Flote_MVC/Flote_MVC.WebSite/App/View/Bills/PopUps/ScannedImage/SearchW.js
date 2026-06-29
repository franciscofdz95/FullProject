/* ====================================================================================================
NAME:			[Scan Image Search Window]
BEHAVIOR:		Searches scan Image for Invoice Reference Number
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/22/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/

Ext.define('App.View.Reports.Bills.PopUps.ScannedImage.SearchW', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Bills-PopUps-ScannedImage-SearchW',
    itemId: 'ScanImageSearchId',
    border: true,
    title: '',
    width: '65%',
    modal: true,
    rowDetScan: '',
    items:
       [
           {
               xtype: 'panel',
               baseCls: 'UPS_Greenish_1',
               layout: 'hbox',
               height: '25%',
               items: [
                    { xtype: 'textfield', itemId: 'venInvoiceNoSS', fieldLabel: 'Vendor Invoice Number:', labelStyle: 'color:white;font-weight:bold; font-size:12px;', border: 2, margin: '2 2 2 2' },
                    { xtype: 'hiddenfield', itemId: 'invIdScanDocId', allowBlank: false, value: '' },
                    { xtype: 'button', width: '100px', margin: '10 5 5 5', itemId: 'btnScanSearch', cls: 'uButton', text: '<div style="font-weight: bold; color:white;">Search</div>' }
               ]
           },
           { xtype: 'App-View-Bills-PopUps-ScannedImage-SearchGrid', itemId: "scanSearchGridId" }
       ]

});
