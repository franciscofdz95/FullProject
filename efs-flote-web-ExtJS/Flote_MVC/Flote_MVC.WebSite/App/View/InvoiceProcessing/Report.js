/* ====================================================================================================
NAME:			[Invoice Processing Report]
BEHAVIOR:		Invoice Processing View.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.InvoiceProcessing.Report', {
    extend: 'App.View.Component.Common.GridContainer',
    alias: 'widget.App-View-InvoiceProcessing-Report',
    Report: { xtype: 'App-View-InvoiceProcessing-Grid' }
});