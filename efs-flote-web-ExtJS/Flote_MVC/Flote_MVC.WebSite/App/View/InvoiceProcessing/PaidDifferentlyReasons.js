/* ====================================================================================================
NAME:			[PAID DIFFERENTLY REASON DROPDOWN ]
BEHAVIOR:		Shows the paid differently Reason dropdown
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
01/29/2020        Rama Yagati		     Created.
 ======================================================================================================*/
Ext.define('App.View.InvoiceProcessing.PaidDifferentlyreasons', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-InvoiceProcessing-PaidDifferentlyreasons',
    layout: 'hbox',
    hidden: false,
    itemId: 'PaidDifferentlyreasonsId',
    width:500,
    items: [
         { xtype: 'label', text: 'Paid Differently Reason',style: 'font-weight:bold; font-size:12px;' },
         {
             xtype: 'combobox',
             emptyText: 'Select Tax Paid Differently reasons',
             store: {
                 type: 'webapi',
                 api: {
                     read: 'api/WebAPIReport/LoadPaidDifferentlyReasons'
                 },
                
             },
             valueField: 'PaidDifferentlyReason',
             displayField: 'PaidDifferentlyReason',
             minChars: 3,
             matchFieldWidth: true, 
             width: 200,
             editable: false,
             listConfig: {
                 loadingText: 'Searching...',
                 emptyText: 'No matching posts found.',
                 // Custom rendering template for each item
                 getInnerTpl: function () {
                     return '<div>' + '{PaidDifferentlyReason} ' + '</div>';
                 }
             },             
             listeners: {                 
             }
         }]
});