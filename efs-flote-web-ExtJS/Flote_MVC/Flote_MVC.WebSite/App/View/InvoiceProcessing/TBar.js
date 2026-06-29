/* ====================================================================================================
NAME:			[Invoice Processing TBar Fields]
BEHAVIOR:		Shows Invoice Processing Tbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Created/Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/01/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.InvoiceProcessing.TBar', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-InvoiceProcessing-TBar',
    width: '100%',
    bodyStyle: 'background:#DFE8F6',
    items: [
        {
            xtype: 'App-View-InvoiceProcessing-Fields',
            title: '<Div style="font-weight:bold; font-size:12px;color:white;">Invoice Details :</Div>'
        },
        {
            xtype: 'panel',
            itemId: 'panelTBarInvProc',
            bodyStyle: 'background:#DFE8F6',
            width: '100%',
            layout: 'hbox',
            items: [
                { xtype: 'label', width: '150px', margin: '0 0 0 5', style: 'font-weight: bold', text: 'Vendor Shipment Summary' },
                { xtype: 'button', itemId: 'viewDetailPop', text: '<img title="View Detail and Approve Bill" style="width: 14px; height: 16px; vertical-align: middle;" src="images/go-24x24.png"  />', margin: '0 0 0 5' },
                { xtype: 'tbfill' },
                {
                    xtype: 'radiogroup',
                    itemId: 'radioProtocolId',
                    style: 'font-weight: bold',
                    items: [
                        {
                            boxLabel: '<Div style="font-weight: bold;">Processed Charges </Div>',
                            width: 150,
                            name: 'rdGroup',
                            checked: false,
                            inputValue: 'Processed'
                        },
                        {
                            boxLabel: '<Div style="font-weight: bold;">Selected Charges </Div>',
                            width: 150,
                            name: 'rdGroup',
                            checked: true,
                            inputValue: 'Selected'
                        }
                    ]
                },
                { xtype: 'tbfill' },
                { xtype: 'App-View-InvoiceProcessing-NonE2kCost', width: '40%' },
                { xtype: 'App-View-InvoiceProcessing-TaxWHCode', width: '25%' },
                { xtype: 'tbfill' },
                { xtype: 'tbseparator', itemId: 'tbSep2', margin: '0 0 0 5', width: '2%' },
                {
                    xtype: 'button', itemId: 'btnExcelExportInvoiceProcessId', icon: 'images/excel_button_16.png', margin: '0 5 0 5',
                    listeners: {
                        click: function () {
                            var me = this;
                            var tabPanel = me.up('#tabPanelId');
                            var grid = me.up('grid')
                            var colNames = '';
                            var dataIndexVal = '';
                            var colException = ["shpmnt_nbr"];
                            var colIndexes = ["colShipNbrIP"];
                            var array = [];
                            var apiUrl = grid.store.getProxy().api.read;
                            var params = grid.store.getProxy().extraParams;
                            Ext.each(grid.store.sorters.items, function (item) { array.push(item.getState()) });
                            if (grid) {
                                for (var i = 0; i < grid.columns.length; i++) {
                                    if (!grid.columns[i].hidden && grid.columns[i].text !== "" && grid.columns[i].dataIndex !== null) {
                                        colNames = colNames + grid.columns[i].text;
                                        dataIndexVal = dataIndexVal + grid.columns[i].dataIndex;
                                        if (grid.columns[i].dataIndex == "shpmnt_nbr") {
                                            dataIndexVal = dataIndexVal + ',Manifested_ind';
                                            colNames = colNames + ',<Div style="color:white;">Type <BR> M/L</Div>'
                                        }
                                        if (grid.columns.length - 1 > i && grid.columns.length > 1) {
                                            colNames = colNames + ",";
                                            dataIndexVal = dataIndexVal + ",";
                                        }
                                    }
                                    else {
                                        if (colException.indexOf(grid.columns[i].dataIndex) >= 0 && colIndexes.indexOf(grid.columns[i].itemId) >= 0) {

                                            if (grid.columns[i].isSubHeader) {
                                                colNames = colNames + grid.columns[i].ownerCt.text;
                                            }
                                            dataIndexVal = dataIndexVal + grid.columns[i].dataIndex;
                                            if (grid.columns.length - 1 > i && grid.columns.length > 1) {
                                                colNames = colNames + ",";
                                                dataIndexVal = dataIndexVal + ",";
                                            }
                                        }
                                    }
                                }
                            }
                            me.fireEvent('btnExcelExport', "InvoiceProcessing", colNames, dataIndexVal.replace('backCheck', 'AccrualFlag'), array, tabPanel.down('#radioProtocolId').getValue(), apiUrl, params);
                        }
                    }
                }
            ]
        },
        { xtype: 'label', html: '<div style="font-size: 11; font-weight:bold"> Note: Double click on row with non-sort column to add split charges and Light green back-ground color for Buy Amt/Buy Curr. columns/rows  indicates add/editable charges to Invoice. </div>' }
    ]
});