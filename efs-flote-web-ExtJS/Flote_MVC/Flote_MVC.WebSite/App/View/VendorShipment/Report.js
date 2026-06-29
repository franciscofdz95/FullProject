/* ====================================================================================================
NAME:			[Vendor Shipment Report]
BEHAVIOR:		Vendor Shipment View.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.VendorShipment.Report', {
    extend: 'App.View.Component.Common.GridContainer',
    alias: 'widget.App-View-VendorShipment-Report',
    Report: { xtype: 'App-View-VendorShipment-Grid' }
});