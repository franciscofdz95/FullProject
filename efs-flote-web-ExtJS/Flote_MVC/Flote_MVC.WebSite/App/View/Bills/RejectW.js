/* ====================================================================================================
NAME:			[Bill Rejection Window]
BEHAVIOR:		Reject the bill window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/15/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Reports.Bills.RejectW', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Bills-RejectW',
    title: '<div style="font-weight: bold;color:white;">Bill Rejection</div>',
    width: '30%',
    modal: true,
    grid: '',
    bodyStyle: 'background:#DBD8B9',
    layout: 'vbox',
    defaults: {
        anchor: '100%'
    },
    items: [
        {
            xtype: 'textareafield', itemId: 'cmtBillRejection', bodyPadding: 10, inputWidth: 300, width: 450, fieldLabel: 'Please enter a comment why the invoice is being rejected',
            style: 'margin-left:10px; margin-right:10px;',
            labelStyle: 'font-weight:bold; font-size:12px;',
            fieldStyle: 'text-align: left;',
            margin: '5 5 5 5',
            allowBlank: false, baseCls: 'UPS_Brown_4'

        },
        {
            xtype: 'container', width: '100%', baseCls: 'UPS_Brown_4',
            defaults: { margin: '10 10 10 10', region: 'center' }, layout: 'hbox',
            items: [
                { xtype: 'tbfill' },
                   {
                       xtype: 'button',
                       margin: '5 5 5 5',
                       itemId: 'btnSaveRejection',
                       text: '<div style="font-weight: bold;color:white;">Save</div>',
                       cls: 'btn fa-lg'
                   }, {
                       xtype: 'button',
                       margin: '5 5 5 5',
                       itemId: 'btnBillRejectCancel',
                       text: '<div style="font-weight: bold;color:white;">Cancel</div>',
                       cls: 'btn fa-lg'
                   },
                  { xtype: 'tbfill' }
            ]
        }
    ]

});