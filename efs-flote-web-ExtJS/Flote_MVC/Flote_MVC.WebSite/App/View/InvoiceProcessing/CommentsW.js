/* ====================================================================================================
NAME:			[Comments winow]
BEHAVIOR:		This window show for invoice process comments.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
5/8/2019            Narender Jeggari	  Created.
 ======================================================================================================*/

Ext.define('App.View.InvoiceProcessing.CommentsW', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-InvoiceProcessing-CommentsW',
    itemId: 'exchangeRateId',
    border: true,
    title: '<Div style="color:white;">Comments</Div>',
    width: '40%',
    modal: true,
    parentRefWin: '',
    rowDetails: '',
    grid: '',
    items:
        [
            {
                xtype: 'container',
                itemId: 'commentContinerId',
                layout: 'vbox',
                baseCls: 'UPS_Brown_4',
                title: 'Comment',
                style: {
                    borderColor: 'white',
                    borderStyle: 'solid'
                },
                items: [
                    { xtype: 'label', text: 'Comments:', style: 'border: 1px solid ;font-weight:bold; font-size:12px;' },
                    { xtype: 'label', itemId: 'msgCommentId', text: '', margin: '5 5 5 5', style: 'background-color : white;color:red;font-weight:bold; font-size:12px;border: 1px solid white;border-color:#FFFFFF;' },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        width: '100%',
                        items: [
                            { xtype: 'displayfield', itemId: 'shipNoExchId', fieldLabel: 'Shipment Number', border: 1, margin: '5 5 5 5', labelAlign: 'top', style: 'border: 1px solid white;border-color:#FFFFFF;' },
                            { xtype: 'displayfield', itemId: 'codeChargeExchId', fieldLabel: 'Charge Code', border: 1, margin: '5 5 5 5', labelAlign: 'top', style: 'border: 1px solid white;border-color:#FFFFFF;' },
                            { xtype: 'displayfield', itemId: 'codeDescExchId', fieldLabel: 'Code Description', border: 1, margin: '5 5 5 5', labelAlign: 'top', style: 'border: 1px solid white;border-color:#FFFFFF;' }
                        ]
                    },
                    {
                        xtype: 'App-View-InvoiceProcessing-PaidDifferentlyreasons',itemId :'Pdr'                    },
                    {
                        xtype: 'textareafield',
                        itemId: 'cmtExchRateId',
                        bodyPadding: 10,
                        inputWidth: 300,
                        width: 350,
                        height: '10%',
                        labelAlign: 'top',
                        fieldLabel: 'Comments',
                        fieldStyle: 'text-align: right;',
                        anchor: '100%',
                        margin: '5 5 5 5',
                        style: 'margin-left:10px; margin-right:10px;border: 1px solid white;',
                        labelStyle: 'color:white;font-weight:bold; font-size:12px; width:100px'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        width: '100%',
                        items: [
                            { xtype: 'button', itemId: 'btnSaveCommentId', docked: 'bottom', cls: 'btn', margin: '5 5 5 200', text: '<div style="font-weight: bold;color:white;">Save Comment</div>' },
                            { xtype: 'button', itemId: 'btnCancelExchangeId', docked: 'bottom', cls: 'btn', margin: '5 5 5 5', text: '<div style="font-weight: bold;color:white;">Cancel</div>' }
                        ]
                    },
                    {
                        xtype: 'label', text: '   Note: Comments will be monitored so please ensure valuable information is entered', style: 'font-weight:bold; font-size:12px;color:red',hidden:true
                    }
                ]
            }
        ]

});
