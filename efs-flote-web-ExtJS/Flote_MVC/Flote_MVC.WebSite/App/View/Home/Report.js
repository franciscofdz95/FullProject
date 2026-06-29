/* ====================================================================================================
NAME:			[Home view ]
BEHAVIOR:		Shows Home page window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Home.Report', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Home-Report',
    baseCls: 'UPS_Blue_1',
    width: '100%',
    height: '100%',
    layout: {
        type: 'hbox'
    },
    items: [
        {
            xtype: 'container',
            width: '70%',
            height: '100%',
            layout: {
                type: 'vbox'
            },
            items: [
                {
                    xtype: 'container', type: 'hbox', itemId: 'btnHomeScreenMsgId', pack: 'center', width: '100%', baseCls: 'UPS_Blue_2', hidden: true,
                    items: [
                        { xtype: 'button', margin: '5 5 5 5', itemId: 'btnHomeScreenId', cls: 'btn', text: '<div style="font-weight: bold;color:white;">Home</div>' },
                    ]
                },
                {
                    xtype: 'container', type: 'hbox', itemId: 'homeDateContainerId', pack: 'center', width: '100%', baseCls: 'UPS_Blue_2', height: '60%',
                    items: [
                        { xtype: 'label', text: 'E2K Update Date and Time:', baseCls: 'UPS_WhiteLeft', itemId: 'e2kUpdDateTime', padding: 5 },
                        { xtype: 'label', text: 'Vendor table last updated on:', baseCls: 'UPS_WhiteRight', itemId: 'venLstUpdated', padding: 5 },
                        {
                            xtype: 'label', centered: true, style: 'margin-left:30%; margin-top:25px; margin-right:30%;', baseCls: 'UPS_WhiteLeft', itemId: 'adminMessage2', padding: 5
                        }
                    ]
                },
                {
                    xtype: 'App-View-Home-ValPayAdmin-Container', layout: 'vbox', itemId: 'homeValPayAdminContainer', hidden: true, width: '100%'
                },
                {
                    xtype: 'App-View-Home-MsgAdmin-MessageAdminContainer', hidden: true, margin: '5 5 5 5', itemId: 'homeMsgAdminId', pack: 'center', width: '100%'
                },
                {
                    xtype: 'App-View-Home-AputAdmin-Container', pack: 'center', width: '100%', itemId: 'homeAputAdminId', hidden: true
                }
            ]
        },
        {
            xtype: 'App-View-Home-FloteImagesMsg', pack: 'center', width: '30%', itemId: 'homeFloteImageMsgId'

        }
    ]
});