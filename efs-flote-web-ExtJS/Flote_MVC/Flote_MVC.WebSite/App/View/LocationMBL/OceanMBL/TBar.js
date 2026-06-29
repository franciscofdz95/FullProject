/* ====================================================================================================
NAME:			[OceanMBL Summary TBar Fields]
BEHAVIOR:		Shows OceanMBL Summary Tbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
06/27/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LocationMBL.OceanMBL.TBar', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-LocationMBL-OceanMBL-TBar',
    width: '100%',
    bodyStyle: 'background:#DFE8F6',
    layout: 'hbox',
    items: [
            { xtype: 'label', itemId: 'lblTitleOceanMBL', margin: '5 10 5 5', style: 'font-weight: bold', html: 'MBL Number:' },
            { xtype: 'label', itemId: 'lblOceanMBLLoc', margin: '5 10 5 5', style: 'font-weight: bold', html: 'MBL Number:' },
            { xtype: 'tbfill', itemId: 'tbSep35' },
            { xtype: 'App-View-LocationMBL-OceanMBL-Currency', margin: '5 5 5 5', itemId: "oceanMBLDisplayCurr" },
            {
                xtype: 'button', itemId: 'btnOceanMBLExport', icon: 'images/excel_button_16.png', margin: '5 5 5 5'
            }

    ]

});