/* ====================================================================================================
NAME:			[GeoSRSwitch Window]
BEHAVIOR:		Shows GeoSRSwitch Window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/15/2017        Sriram Sundara		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Common.GeoSRSwitchWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Component-Common-GeoSRSwitchWindow',
    itemId: 'geoSRWindowId',    
    title: '<div style="font-weight: bold">Geo/SR Switch</div>',    
    autoShow: true,
    width: '20%',
    rowDetails: '',
    items:
       [
           { xtype: 'label', itemId: 'SubHeading', html: 'Your Geo/SR Permissions <br />', style: 'color:black;font-family:Verdana, Arial,sans-serif;',  margin: '2'},

            { xtype: 'panel', itemId: 'panelUserPermissions', layout: 'vbox', margin: '5' },

           { xtype: 'button', itemId: 'btnClose', cls: 'btn', margin: '5', text: '<div style="font-weight: bold;color:white;">Close</div>', margin: '10' }
       ]
       
});
