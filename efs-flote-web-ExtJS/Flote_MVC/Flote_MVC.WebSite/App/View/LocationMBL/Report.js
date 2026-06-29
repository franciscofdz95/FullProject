/* ====================================================================================================
NAME:			[Location Ocean MBL Report]
BEHAVIOR:		Location OCEAN MBL Report View .
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LocationMBL.Report', {
    extend: 'App.View.Component.Common.GridContainer',
    alias: 'widget.App-View-LocationMBL-Report',
    Report: { xtype: 'App-View-LocationMBL-Grid' }
});