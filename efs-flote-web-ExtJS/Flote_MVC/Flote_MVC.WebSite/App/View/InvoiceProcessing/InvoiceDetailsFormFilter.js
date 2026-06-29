/* ====================================================================================================
NAME:			[Invoice Processing Filter Criteria and Form]
BEHAVIOR:		Shows Invoice  processing Detail Fields info and filter criteria panel.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.InvoiceProcessing.InvoiceDetailsFormFilter', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.App-View-InvoiceProcessing-InvoiceDetailsFormFilter',    
    layout: 'hbox',
    height: '5%',
    baseCls: 'UPS_Brown_4',
    itemId: 'invoiceDetailsFormFilterId',
    items: [
        {
            xtype: 'App-View-Component-FilteredReportPop',
            // itemId: 'FilterFieldsPopUpId',
            rowData: '',
            baseCls: 'UPS_Brown_1',
            Filter: {
                xtype: 'App-View-Component-FilterFieldsPopUp',
                title: '<Div style="font-weight:bold; font-size:12px; color:white;">Filter Criteria</div>',
                baseCls: 'UPS_Brown_1'
            }
        }
       ,
       {
           xtype: 'App-View-InvoiceProcessing-InvoiceDetailFields',
           title: '<Div style="font-weight:bold; font-size:12px;">Invoice Detail</Div>',
          // Margin: '5 5 5 5',
           width: '60%'
       }
    ]

});