/* ====================================================================================================
NAME:			[Import Excel Main Deck]
BEHAVIOR:		Shows Import Excel Main entry.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/07/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.ImportExcel.Report', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'card',
    alias: 'widget.App-View-ImportExcel-Report',
    border: true,
    title: '<span style="font-weight:bold; color:white;font-size:14px;">Import from Excel</span>',
    itemId: 'ImportExcelId',
    frame: true,
    items: [
        { xtype: 'App-View-ImportExcel-Excel-Import', itemId: 'cardExcelImport' },
        { xtype: 'App-View-ImportExcel-Validate-Grid', itemId: 'cardValidate' }
    ]
});