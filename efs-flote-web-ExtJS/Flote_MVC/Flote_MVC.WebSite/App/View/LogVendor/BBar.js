/* ====================================================================================================
NAME:			[Vat Amount of LVB BBar Fields]
BEHAVIOR:		Shows Vat Amount of LVB  Bbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Created/Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
5/24/2016            Sudhir Dandale		          Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.BBar', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-LogVendor-BBar',
    width: '100%',    
    cls: 'BBarCls',
    layout: 'hbox',
    items: [
            {
                xtype: 'container',
                layout: 'hbox',
                width: '60%',
                cls: 'BBarCls',               
                items: [
                    {
                        xtype: 'label',
                        width: '50%',
                        text: 'Vendor Bill Total :',
                        cls: 'BBarCls',
                        border: 1,
                        align: 'center'                       

                    },
                      {
                          xtype: 'label', itemId: 'lblVendorLogBillVal', text: '', border: 1, cls: 'BBarCls'
                      }
                ]
            }
    ]
});