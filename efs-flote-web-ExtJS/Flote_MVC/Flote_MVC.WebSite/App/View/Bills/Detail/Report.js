/* ====================================================================================================
NAME:			[Bill Detail Report Window]
BEHAVIOR:		Shows Bill Detail Report Window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Bills.Detail.Report', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Bills-Detail-Report',
    border: true,
    title: '<div style="font-weight: bold">Bill Detail Report</div>',
    modal: true,
    rowDetails: '',
    autoScroll: true,
    rec: '',
    items:
       [
           {
               xtype: 'container',
               baseCls: 'UPS_Greenish_1',
               layout: 'hbox',
               height: '25%',
               scrollable: true,
               items: [
                   { xtype: 'App-View-Bills-Detail-Fields', width: '50%', margin: '5 10 5 5', border: true, scrollable: true },
                   { xtype: 'App-View-Bills-Detail-VAT', width: '50%', margin: '5 5 5 10', border: true, scrollable: true }                  
               ]
           },
       { xtype: 'App-View-Bills-Detail-Grid', itemId: 'billDetailGridId' }
       ]

});