/* ====================================================================================================
NAME:			[Cbol Summary BBar Fields]
BEHAVIOR:		Shows CBOL Summary Bbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Created/Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
1/16/2016            Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.CBOL.BBar', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-CBOL-BBar',
    width: '100%',
    bodyStyle: 'background:#DFE8F6',
    layout: 'hbox',
    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            itemId: 'contUnmatchedChargesId',
            width: '100%',
            hidden: true,
            baseCls: 'UPS_Greenish_1',
            style: {
                borderColor: 'white',
                borderStyle: 'solid'
            },
            items: [
                {
                    xtype: 'textareafield',
                    itemId: 'cmtConfirmUnmatchedCharges',
                    bodyPadding: 10,
                    inputWidth: 500,
                    margin: '5 5 5 5',
                    width: 500,
                    fieldLabel: 'Comments:',
                    fieldStyle: 'text-align: right;',
                    baseCls: 'UPS_Greenish_1',
                    anchor: '100%',
                    style: 'margin-left:10px; margin-right:10px;border: 1px solid white;',
                    labelStyle: 'color:white;font-weight:bold; font-size:12px; width:100px',
                    allowBlank: false
                },
                {
                    xtype: 'button', itemId: 'btnConfirmUnmatchedCharges', docked: 'bottom', cls: 'btn', margin: '25 0 0 5', text: '<div style="font-weight: bold;color:white;">Confirm Unmatched Charges</div>'
                }
            ]
        }
    ]
});