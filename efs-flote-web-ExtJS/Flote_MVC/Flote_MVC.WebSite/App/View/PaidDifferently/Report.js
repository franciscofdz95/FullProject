/* ====================================================================================================
NAME:			[Paid Differently ]
BEHAVIOR:		Paid Differently Report View.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/06/2020          Rama Yagati     		 Created.
 ======================================================================================================*/
Ext.define('App.View.PaidDifferently.Report', {
    extend: 'App.View.Component.Common.GridContainer',
    alias: 'widget.App-View-PaidDifferently-Report',
    Report: { xtype: 'App-View-PaidDifferently-Grid' }
});