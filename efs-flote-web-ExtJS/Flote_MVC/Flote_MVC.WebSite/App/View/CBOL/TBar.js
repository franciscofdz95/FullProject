/* ====================================================================================================
NAME:			[Cbol Summary TBar Fields]
BEHAVIOR:		Shows CBOL Summary Tbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Created/Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
1/16/2016            Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.CBOL.TBar', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-CBOL-TBar',
    width: '100%',
    bodyStyle: 'background:#DFE8F6',
    layout: 'hbox',
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            baseCls: 'UPS_Greenish_1',
            width: '100%',
            height: 'auto',
            items: [
                { xtype: 'button', itemId: 'btnCloseButton', cls: 'btn', margin: '5 0 0 1000', text: '<div style="font-weight: bold;">Close</div>' },
                { xtype: 'button', hidden: true, margin: '5 5 5 5', itemId: 'btnCbolBack', cls: 'uButton', text: '<div style="font-weight: bold; color:white;">BackVendorSummary</div>' },
                { xtype: 'App-View-CBOL-FieldDetails', width: '100%' },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    baseCls: 'UPS_Greenish_1',
                    height: 'auto',
                    items: [
                        {
                            xtype: 'radiogroup',
                            itemId: 'rdoCBOLId',
                            style: 'font-weight: bold',
                            items: [
                                {
                                    boxLabel: '<Div style="font-weight: bold;">By Carrier Bol</Div>',
                                    width: 150,
                                    name: 'rdGroup',
                                    checked: true,
                                    inputValue: 'ByCarrierBol'
                                },
                                {
                                    boxLabel: '<Div style="font-weight: bold;">By Charge Code</Div>',
                                    width: 150,
                                    name: 'rdGroup',
                                    checked: false,
                                    inputValue: 'ByChargeCode'
                                },
                                {
                                    boxLabel: '<Div style="font-weight: bold;">By HBL</Div>',
                                    width: 150,
                                    name: 'rdGroup',
                                    checked: false,
                                    inputValue: 'ByHBL'
                                }
                            ]
                        },
                        { xtype: 'button', hidden: true, margin: '5 5 5 5', itemId: 'btnProcessExcelDataToFlote', cls: 'uButton', text: '<div style="font-weight: bold; color:white;">Process All Matched Charges</div>' }
                    ]
                }
            ]
        }
    ]
});