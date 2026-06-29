/* ====================================================================================================
NAME:			[Import Excel Container]
BEHAVIOR:		Shows all import excel configuration and excel sheet.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/07/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.ImportExcel.Excel.Import', {
    extend: 'Ext.container.Container',
    layout: 'border',
    alias: 'widget.App-View-ImportExcel-Excel-Import',
    border: true,
    baseCls: 'UPS_White_1',     
    items: [
        {
            xtype: 'App-View-ImportExcel-Excel-Configure',
            bodyStyle: 'padding: 6px;',
            itemId: 'pnlConfigureExcel',
            region: 'west',
            width: 250,
            collapsible: false
        },
        {
            xtype: 'App-View-ImportExcel-Excel-Sheet',
            region: 'center', 
            itemId: 'pnlExcel' 
        }
    ]
});