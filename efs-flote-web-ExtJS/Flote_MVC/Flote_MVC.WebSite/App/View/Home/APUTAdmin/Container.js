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
Ext.define('App.View.Home.AputAdmin.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Home-AputAdmin-Container',
    title: '<Div style="font-weight:bold; font-size:14px;color:white;">Flote Message Admin</Div>',    
    baseCls: 'UPS_Blue_2',
    items: [
            {
                xtype: 'label', html: '<div style="font-weight:bold; font-size:14px;color:white;">APUT User List Admin</div>', margin: '5 5 5 5', width: '100%',
                baseCls: 'UPS_Blue_2'
            },
        {
            xtype: 'container',
            layout: 'hbox',
            border:1,
            style: { borderColor: 'white', borderStyle: 'thick', color: 'white' },
            items: [
                { xtype: 'tbfill' },
                { xtype: 'App-View-Home-APUTAdmin-AputUserList', margin: '5 5 5 5', itemId: 'aputUserListId' },
                { xtype: 'App-View-Home-APUTAdmin-CompanyCodesList', margin: '5 5 5 5', itemId: 'cmpCodesListId' },
                { xtype: 'button', margin: '20 5 5 5', itemId: 'btnAddUser', cls: 'btn', text: '<div style="font-weight: bold;color:white;">Add User</div>', disabled: true },
                { xtype: 'tbfill' }
            ]
        },
        { xtype: 'App-View-Home-APUTAdmin-AputUserGrid' },
        {
            xtype: 'label', html: '<div style="font-weight:bold; font-size:14px;color:white;">Please select the row from above grid for company codes operation.</div>', margin: '5 5 5 5', width: '100%',
            baseCls: 'UPS_Blue_2', style: { borderColor: 'white', borderStyle: 'thick', color: 'white' }, border: 1
        },
        { xtype: 'App-View-Home-APUTAdmin-CompanyCodesGrid', hidden: true }
    ]

});