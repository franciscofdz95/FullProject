/* ====================================================================================================
NAME:			[Coding Sheet Review Window]
BEHAVIOR:		Shows Coding Review Sheet Window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/28/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Reports.Bills.PopUps.CodingSheet.ReviewCodingSheetW', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Bills-PopUps-CodingSheet-ReviewCodingSheetW',
    itemId: 'scannedDocId',
    title: '<div style="font-weight: bold">Coding Sheet Review</div>',
    width: '80%',
    height: '90%',
    modal: true,
    autoScroll: true,    
    recImg: '',
    defaults: {
        anchor: '100%',
        labelWidth: 100
    },
    items: [
            { xtype: 'App-View-Bills-PopUps-CodingSheet-ReviewCodingSheetGrid', itemId: "rvwCodingSheetGridId" },
            { xtype: 'label', margin: '10 5 5 5', text: 'Note(s):', style: 'font-weight:bold; font-size:12px;' },
            { xtype: 'label', margin: '10 5 5 5', text: 'FLOTE does not reflect the same complete financial period as GPR, Khalix or other financial reports.' }
    ]
   
});