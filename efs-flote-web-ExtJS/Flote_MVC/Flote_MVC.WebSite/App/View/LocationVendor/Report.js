/* ====================================================================================================
NAME:			[Location Vendor Report]
BEHAVIOR:		Location Vendor View.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LocationVendor.Report', {
    extend: 'App.View.Component.Common.GridContainer',
    alias: 'widget.App-View-LocationVendor-Report',
    Report: { xtype: 'App-View-LocationVendor-Grid'}  
});