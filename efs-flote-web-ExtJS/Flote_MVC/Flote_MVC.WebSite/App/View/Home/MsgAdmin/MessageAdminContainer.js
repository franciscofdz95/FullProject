/* ====================================================================================================
NAME:			[ Message Admin Screen]
BEHAVIOR:		Shows admin screen with update and clear functionality
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
04/25/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Home.MsgAdmin.MessageAdminContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Home-MsgAdmin-MessageAdminContainer',
    title: '<Div style="font-weight:bold; font-size:14px;color:white;">Flote Message Admin</Div>',
    layout: 'vbox',
    baseCls: 'UPS_Blue_2',
    items: [
            {
                xtype: 'label', html: '<div style="font-weight:bold; font-size:14px;color:white;">Flote Message Admin</div>', margin: '5 5 5 5', width: '100%',
                baseCls: 'UPS_Blue_2'

            },
             {
                 xtype: 'textareafield', itemId: 'msgAdminTextAreaId', bodyPadding: 10, inputWidth: 500, width: '50%', fieldLabel: 'Message:',
                 style: 'margin-left:10px; margin-right:10px;',
                 labelStyle: 'font-weight:bold; font-size:12px;color:white;',
                 fieldStyle: 'text-align: left;',
                 allowBlank: false
             },
             { xtype: 'checkbox', itemId: 'chkRequiredMsgFlag', margin: '5 5 5 5', boxLabel: '<div style="font-weight: bold;color:white;">Required</div>' },
             {
                 xtype: 'container',
                 layout: 'hbox',
                 items: [
                     { xtype: 'tbfill' },
                     { xtype: 'button', margin: '5 5 5 5', itemId: 'btnMsgAdminClearId', cls: 'btn', text: '<div style="font-weight: bold;color:white;">Clear Message</div>' },
                     { xtype: 'button', margin: '5 5 5 5', itemId: 'btnMsgAdminUpdateId', cls: 'btn', text: '<div style="font-weight: bold;color:white;">Update Message</div>' },
                     { xtype: 'tbfill' }
                 ]
             }

    ]

});