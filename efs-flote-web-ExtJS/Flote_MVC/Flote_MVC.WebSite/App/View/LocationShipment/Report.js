/* ====================================================================================================
NAME:			[Location Shipment Report]
BEHAVIOR:		Location Shipment View.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LocationShipment.Report', {
    extend: 'App.View.Component.Common.GridContainer',
    alias: 'widget.App-View-LocationShipment-Report',
    Report: { xtype: 'App-View-LocationShipment-Grid' }
});