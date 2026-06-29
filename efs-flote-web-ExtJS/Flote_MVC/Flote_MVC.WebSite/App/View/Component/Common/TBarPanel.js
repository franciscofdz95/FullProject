/* ====================================================================================================
NAME:			[Bill Reports TBar Fields]
BEHAVIOR:		Shows Bill Reports Tbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
10/19/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Common.TbarPanel', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-Component-Common-TbarPanel',
    width: '100%',
    bodyStyle: 'background:#DFE8F6',
    reportType: '',
    layout: 'hbox',
    items: [
        { xtype: 'label', width: '160px', margin: '0 0 0 5', style: 'font-weight: bold', text: '' },
        { xtype: 'tbfill' },
        {
            xtype: 'button', itemId: 'btnExcelExport', icon: 'images/excel_button_16.png', margin: '0 5 0 5',
            listeners: {
                click: function () {

                    var me = this;
                    var grid = me.up('grid')
                    var colNames = '';
                    var dataIndexVal = '';
                    var array = [];
                    var colException = ["shpmnt_nbr", "mbl_nbr"];
                    var colIndexes = ["colShpNbrLS", "colMblNbr", "colShipNbr"];
                    var apiUrl = grid.store.getProxy().api.read;
                    var params = grid.store.getProxy().extraParams;
                    Ext.each(grid.store.sorters.items, function (item) { array.push(item.getState()) });
                    if (grid) {
                        for (var i = 0; i < grid.columns.length; i++) {
                            if (!grid.columns[i].hidden && grid.columns[i].text !== "" && grid.columns[i].dataIndex !== null) {
                                if (grid.columns[i].isSubHeader) {
                                    colNames = colNames + grid.columns[i].ownerCt.text;
                                }
                                colNames = colNames + grid.columns[i].text;
                                dataIndexVal = dataIndexVal + grid.columns[i].dataIndex;
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
                    this.fireEvent('btnExcelExport', this.up('panel').reportType, colNames, dataIndexVal, array, '', apiUrl, params);
                }
            }
        }

    ]
});