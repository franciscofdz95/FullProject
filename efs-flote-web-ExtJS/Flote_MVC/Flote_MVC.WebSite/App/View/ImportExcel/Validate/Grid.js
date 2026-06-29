/* ====================================================================================================
NAME:			[Import Excel Record Validation and display] 
BEHAVIOR:		Shows Import Excel Reocrds .
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/07/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.ImportExcel.Validate.Grid', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-View-ImportExcel-Validate-Grid',
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/DataFromImport',
            update: 'api/WebAPIReport/UpdateDataFromImport'
        },
        sorters: [
            { property: 'ROW_ID', direction: 'ASC' }

        ]
    },
    autoHeight: true,
    autoScroll: true,
    border: true,
    columnLines: true,
    title: '<span style="font-weight:bold;color: #FFFFFF;">Vendor Statement Review :</span>',
    selType: 'cellmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2
        })
    ],
    tbar: [
        { xtype: 'App-View-ImportExcel-Validate-TBar' }
    ],
    viewConfig: {
        enableTextSelection: true,
        stripeRows: false,
        getRowClass: function (record) {
            if (record.get('ErrorCount') === 0 && record.get('WarningCount') === 0 && record.get('ActionCount') === 0 && record.get('TotalCount') > 0) {
                if (ImportExcelSCls.getShowErrors() === true) {
                    return 'hide-row';
                }
            }
        },
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    columns: {
        defaults: { menuDisabled: false, align: 'left', border: 1, sortable: false, autoColumnResize: true },
        cls: 'UBlue',
        items: [
            {
                itemId: 'colInvoice_ID', text: 'Invoice ID', dataIndex: 'Invoice_ID', align: 'left', hidden: true
            },
            {
                itemId: 'colDuplicateFlag', text: 'Duplicates', dataIndex: 'DUPLICATE_FLAG', align: 'left', hidden: true,
                renderer: function (value, metaData, record) {
                    if (value != "" && value === "true") {
                        return "<img src='images/ActionRequired-16X16.png' title='" + "Duplicate records using CBOL, charge description, job number and container type" + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>';
                    }
                    else {
                        return '<span style="font-weight:bold; font-size:12px;"></span>';
                    }
                }
            }, {
                itemId: 'colSSRowNumber', text: 'Excel Row', dataIndex: 'SSROWNUMBER', align: 'left'
            }, {
                itemId: 'colDate', text: 'Recieved Date', dataIndex: 'DATE', align: 'left', renderer: BIA.util.Format.dateRenderer('m/d/y h:m A'),
                editor: {
                    xtype: 'datefield',
                    allowBlank: false
                }
            }, {
                itemId: 'colContainerNumber', text: 'Container Number', dataIndex: 'CONTAINER_NBR', align: 'left',
                editor: {
                    xtype: 'textfield', fieldStyle: 'text-transform:uppercase'
                }
            }, {
                itemId: 'colContainerType', text: 'Container Type', dataIndex: 'CONTAINER_TYPE', align: 'left',
                editor: {
                    xtype: 'textfield',
                    fieldStyle: 'text-transform:uppercase'
                },
                renderer: function (value, metaData, record) {
                    if (value == "" || value == null) {
                        return "<img src='images/red-warning-16X16.png' title='" + "Container Type is a required Field" + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>' + '<span style="font-weight:bold; font-size:12px;">' + value.toUpperCase() + '</span>';
                    }
                    else {
                        if (record.get('CONTAINER_TYPE_ERR') !== null && record.get('CONTAINER_TYPE_ERR') !== "") { return "<img src='images/red-warning-16X16.png' title='" + record.get('CONTAINER_TYPE_ERR_MSG') + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>' + '<span style="font-weight:bold; font-size:12px;">' + value + '</span>'; }
                        else { return record.get('CONTAINER_TYPE').toUpperCase() + '<span style="font-weight:bold; font-size:12px;"></span>'; }
                    }

                }
            }, {
                itemId: 'colContainerCount', text: 'Container Count', dataIndex: 'CONTAINER_COUNT', align: 'left',
                editor: {
                    xtype: 'textfield',
                    fieldStyle: 'text-transform:uppercase'
                }
            }, {
                itemId: 'colOriginalCarrierBOL', text: 'Original Carrier BOL', dataIndex: 'ORIGINAL_CARRIER_BOL', align: 'left', hidden: true
            },
            {
                itemId: 'colCarrierBOL', text: 'Carrier BOL', dataIndex: 'CARRIER_BOL', align: 'left',
                editor: {
                    xtype: 'textfield',
                    fieldStyle: 'text-transform:uppercase'
                },
                renderer: function (value, metaData, record) {
                    var errorMsg = '';
                    if (record.get('HBL') == null && record.get('HBL') == "") { //Show Warning message for CBOL if HBL is empty or NULL
                        if (value == "" || value == null) {
                            return "<img src='images/red-warning-16X16.png' title='" + "Carrier BOL is a required Field" + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>' + '<span style="font-weight:bold; font-size:12px;">' + value.toUpperCase() + '</span>';
                        }
                        else {
                            if (record.get('CARRIER_BOL_ERR') !== null && record.get('CARRIER_BOL_ERR') !== "") {
                                return "<img src='images/red-warning-16X16.png' title='" + record.get('CARRIER_BOL_ERR_MSG') + errorMsg + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>' + '<span style="font-weight:bold; font-size:12px;">' + value + '</span>';
                            }
                            else { return record.get('CARRIER_BOL').toUpperCase() + '<span style="font-weight:bold; font-size:12px;"></span>'; }
                        }
                    } else {
                        if (record.get('CARRIER_BOL_ERR') !== null && record.get('CARRIER_BOL_ERR') !== "") {
                            return "<img src='images/red-warning-16X16.png' title='" + record.get('CARRIER_BOL_ERR_MSG') + errorMsg + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>' + '<span style="font-weight:bold; font-size:12px;">' + value + '</span>';
                        }
                        else { return record.get('CARRIER_BOL').toUpperCase() + '<span style="font-weight:bold; font-size:12px;"></span>'; }
                    }

                }
            },
            {
                itemId: 'colJobNumber', text: 'Job Number', dataIndex: 'JOB_NBR', align: 'left',
                editor: {
                    xtype: 'textfield', fieldStyle: 'text-transform:uppercase'
                }
            }, {
                itemId: 'colChargeDesc', text: 'Charge Description', dataIndex: 'CHARGE_DESCRIPTION', align: 'left',
                editor: {
                    xtype: 'textfield', fieldStyle: 'text-transform:uppercase'
                },
                renderer: function (value, metaData, record) {
                    if (value == "" || value == null) {
                        return "<img src='images/red-warning-16X16.png' title='" + "Charge Description is a required Field" + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>' + '<span style="font-weight:bold; font-size:12px;">' + value.toUpperCase() + '</span>';
                    }
                    else {
                        if (record.get('CHARGE_DESCRIPTION_ERR') !== null && record.get('CHARGE_DESCRIPTION_ERR') !== "") { return "<img src='images/red-warning-16X16.png' title='" + record.get('CHARGE_DESCRIPTION_ERR_MSG') + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>' + '<span style="font-weight:bold; font-size:12px;">' + value + '</span>'; }
                        else { return record.get('CHARGE_DESCRIPTION').toUpperCase() + '<span style="font-weight:bold; font-size:12px;"></span>'; }
                    }
                }
            }, {
                itemId: 'colAmount', text: 'Amount', dataIndex: 'AMOUNT', align: 'left',
                editor: {
                    xtype: 'textfield', fieldStyle: 'text-transform:uppercase'
                }
            }, {
                itemId: 'colVerifiedAmt', text: 'Verified Amount', dataIndex: 'VERIFIED_AMOUNT',
                editor: {
                    xtype: 'textfield', fieldStyle: 'text-transform:uppercase'
                },
                renderer: function (value, metaData, record) {
                    if (value == "" || value == null) {
                        return "<img src='images/red-warning-16X16.png' title='" + "Verified Amount is a required Field" + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;">' + value + '</span>';
                    }
                    else {
                        if (record.get('VERIFIED_AMT_ERR') !== null && record.get('VERIFIED_AMT_ERR') !== "") { return "<img src='images/red-warning-16X16.png' title='" + record.get('VERIFIED_AMT_ERR_MSG') + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>'; }
                        else { return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData) + '<span style="font-weight:bold; font-size:12px;"></span>'; }
                    }

                }
            }, {
                itemId: 'colRatesMatch', text: 'Rates Match', dataIndex: 'RATES_MATCH', align: 'left',
                editor: {
                    xtype: 'textfield', fieldStyle: 'text-transform:uppercase'
                }

            }, {
                itemId: 'colComment', text: 'COMMENT', dataIndex: 'COMMENT', align: 'left',
                editor: {
                    xtype: 'textfield', fieldStyle: 'text-transform:uppercase'
                }
            }, {
                itemId: 'colChargeCode', text: 'Charge Code', dataIndex: 'CHARGE_CODE', align: 'right'
            }, {
                itemId: 'colHBL', text: 'HBL', dataIndex: 'HBL', align: 'left',
                editor: {
                    xtype: 'textfield', fieldStyle: 'text-transform:uppercase'
                },
                renderer: function (value, metaData, record) {
                    if (record.get('CARRIER_BOL') == null || record.get('CARRIER_BOL') == "" || record.get('CARRIER_BOL') == "NA") { //Show Warning message for HBL if CBOL is empty or NULL
                        if (value == "" || value == null) {
                            return "<img src='images/red-warning-16X16.png' title='" + "HBL is a required Field" + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>' + '<span style="font-weight:bold; font-size:12px;">' + value.toUpperCase() + '</span>';
                        }
                        else {
                            if (record.get('HBL_ERR') !== null && record.get('HBL_ERR') !== "") {
                                var errorMsg = '';
                                return "<img src='images/red-warning-16X16.png' title='" + record.get('HBL_ERR_MSG') + errorMsg + "'>&nbsp;" + '<span style="font-weight:bold; font-size:12px;"></span>' + '<span style="font-weight:bold; font-size:12px;">' + value + '</span>';
                            }
                            else { return record.get('HBL').toUpperCase() + '<span style="font-weight:bold; font-size:12px;"></span>'; }
                        }
                    } else { return record.get('HBL').toUpperCase() + '<span style="font-weight:bold; font-size:12px;"></span>'; }

                }
            }, {
                itemId: 'colID', hidden: true, dataIndex: 'ROW_ID', align: 'left'
            }, {
                itemId: 'colSortProperty', text: 'Sort Property', hidden: true, dataIndex: 'SortProperty', align: 'left'
            },
            {
                itemId: 'colStart', text: 'Start', hidden: true, dataIndex: 'START', align: 'left'
            }, {
                itemId: 'colLimit', text: 'Limit', hidden: true, dataIndex: 'LIMIT', align: 'left'
            },
            {
                xtype: 'actioncolumn', itemId: 'actionColDeleteRow', width: 40, text: 'Delete', sortable: false,
                renderer: function (value, metaData, record) { return '<span style="font-weight:bold; font-size:12px;"></span>'; },
                items: [{
                    icon: 'images/delete_16x16.jpg',  // Use a URL in the icon config
                    tooltip: 'Delete',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        this.fireEvent('actionColDeleteRow', this, rec);
                    }
                }]

            }]
    }
});
