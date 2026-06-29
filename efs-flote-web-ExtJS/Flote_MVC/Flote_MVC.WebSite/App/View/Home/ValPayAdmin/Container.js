/* ====================================================================================================
NAME:			[Value Pay Admin]
BEHAVIOR:		Value Pay Admin.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
04/25/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Home.ValPayAdmin.Container', {
    extend: 'Ext.container.Container',
    layout: 'vbox',
    alias: 'widget.App-View-Home-ValPayAdmin-Container',
    baseCls: 'UPS_Blue_2',
    items: [
             { xtype: 'label', text: 'Value Pay Locations Admin ', itemId: 'valPayAdminLbl', padding: 5, baseCls: 'UPS_WhiteLeft' },
             { xtype: 'App-View-Home-ValPayAdmin-ValuePayLocations', itemId: 'valPayAdminLocComboId' },
             { xtype: 'label', text: 'Location has been Updated Successfully ', hidden: true, itemId: 'msgLocUpdateId', padding: 5, style: 'color:white;font-weight:bold; font-size:11px;' },
             { xtype: 'App-View-Home-ValPayAdmin-ValPayAdminGrid', width: '100%', itemId: 'homeValPayAdminLocation' }            
    ]
});