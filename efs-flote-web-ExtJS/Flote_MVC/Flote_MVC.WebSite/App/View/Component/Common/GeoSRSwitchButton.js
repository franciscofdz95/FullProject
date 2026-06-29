/* ====================================================================================================
NAME:			[GeoSRSwitch Button]
BEHAVIOR:		Shows GeoSRSwitch Button.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/15/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Common.GeoSRSwitchButton', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Common-GeoSRSwitchButton',
    itemId: 'geoSRButtonId',
    border: 0,
    layout: { type: 'vbox' },
    items: [{
        xtype: 'button',
        text: '<div id="dialog_link"  style="font-weight: bold;font-family:Verdana, Arial,sans-serif; color:white;">Change Permissions (Geo/SR)</div>', height: '30px',
        itemId: 'btnGeoSRSwitchId',
    }]
});














   