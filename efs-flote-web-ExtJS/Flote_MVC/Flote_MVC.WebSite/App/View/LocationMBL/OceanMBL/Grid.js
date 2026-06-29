/* ====================================================================================================
NAME:			[Ocean MBL Details Summary Grid]
BEHAVIOR:		Shows Ocean MBL Details Summary Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/16/2016        Sheetal Karre		 Created.
 ======================================================================================================*/

Ext.define('App.View.LocationMBL.OceanMBL.grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.App-View-LocationMBL-OceanMBL-Grid',
    border: true,
    layout: 'fit',
    autoScroll: true,
    cls: 'UBlue',
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    tbar: [{ xtype: 'App-View-LocationMBL-OceanMBL-TBar' }],
    lastChargeCode: '',
    valCount: 0,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/OceanMBLSummary'
        },
        remoteSort: false,
        grouper: {
            groupFn: function (item) {
                return '<span style="color:#358ac8;">' + item.get('rank') + '</span>' + item.get('type');
            }
        },
        autoLoad: false,
        listeners: {
            load: {
                fn: function (store, records, successful, operation, eOpts) {
                    var totalMarginPer = 0,
                        totalMarginAmt = 0,
                        totalBuyUsd = 0,
                        totalSellUsd = 0;
                    var lastChg = '';
                    if (store != null && store != undefined) {
                        store.each(function (record) {
                            if (record.get('charge_code') == lastChg) {
                                record.set('sell_amt', 0);
                                record.set('sell_usd', 0);
                                record.set('margin_amt', 0);
                                record.dirty = false;
                                record.commit();
                            }
                            if (record.get('type') != 'PTotal Freight Charge') {
                                totalBuyUsd += record.get('buy_usd');
                                totalSellUsd += record.get('sell_usd');
                                lastChg = record.get('charge_code');
                            }
                        });
                    }
                    totalMarginAmt += totalSellUsd - totalBuyUsd;

                    if (totalSellUsd != 0) {
                        totalMarginPer += ((totalSellUsd - totalBuyUsd) / totalSellUsd) * 100;

                    }
                    store.summary[0].set('margin_amt', totalMarginAmt);
                    store.summary[0].set('margin_per', totalMarginPer);

                }
            }
        }
    },
    features: [
        {
            id: 'group',
            ftype: 'groupingsummary',
            groupHeaderTpl: '{[values.rows[0].data.type]} - {[values.rows.length]} Records',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        },
        {
            ftype: 'summary', dock: 'bottom', cls: 'rowIncompleteInvoices'
        }
    ],
    groupHeaderTpl: '{type}', columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: false, autoColumnResize: true, autoSizeColumn: true },
    columns: [
        {
            header: 'Update Date', dataIndex: 'acctg_per_year', summaryType: 'count', width: 90, sortable: false,
            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                if (record.get('type') == "PTotal Freight Charge") {
                    view.getRow(rowIndex).style.display = 'none';
                }
                return value;
            },
            summaryRenderer: function (value, summaryData, dataIndex, record) {
                if (value != undefined && (value === 0 || value > 0)) { this.up('grid').valCount += value; }
                return ((value === 0 || value > 1) ? (record.record.ownerGroup || 'Grand Total') + ' - ' + value + ' Records' : (record.record.ownerGroup || 'Grand Total') + ' - ' + this.up('grid').valCount + ' Record');
            },
            field: {
                xtype: 'numberfield'
            }
        },
        {
            header: 'Location', dataIndex: 'location_code', sortable: false, width: 80,
            renderer: function (value) {
                return value;
            }

        }, {
            header: 'Charge Split', dataIndex: 'rev_split', autoColumnResize: true, sortable: false, width: 90,
            renderer: function (value) {
                return value;
            }
        },
        {
            header: 'Type M/L', dataIndex: 'MANIFESTED_IND', sortable: false, width: 70
        },
        {
            header: 'Vendor Code', dataIndex: 'vendor_name', sortable: false, width: 120, renderer: function (value, metaData) {
                metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                return value;
            }
        },
        {
            header: 'Charge Code', dataIndex: 'charge_code', sortable: false
        },

        {
            header: 'Charge Desc', dataIndex: 'CHARGE_DESCRIPTION', sortable: false, width: 210, renderer: function (value, metaData) {
                metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                return value;
            }
        },
        {
            header: 'Sell</BR>Amount', dataIndex: 'sell_amt', align: 'right', sortable: false, renderer: function (value, metaData, record) {
                var str = '-';
                if (this.lastChargeCode != record.get('charge_code')) {
                    return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
                } else {
                    metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                    return Utility.Formatting.NumFormat_Thousands_2Decimals(0, metaData) + str;

                }
            }
        },
        {
            header: 'Sell</BR>Curr.', dataIndex: 'sell_cid', sortable: false, width: 50
        },
        {
            header: 'Sell <BR> Amt </BR>' + '(' + PgAtt.getDisplay_currency() + ')', width: 120, itemId: 'colSellAmt', sortable: false, align: 'right',
            renderer: function (value, metaData, record) {
                var str = '-';
                if (this.lastChargeCode != record.get('charge_code')) {
                    return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
                } else {
                    metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                    return Utility.Formatting.NumFormat_Thousands_2Decimals(0, metaData) + str;

                }
            },
            summaryRenderer: function (value, summaryData, dataIndex) {
                return Utility.Formatting.NumFormat_Thousands_2Decimals(value, summaryData);
            },
            dataIndex: 'sell_usd',
            summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            }
        },
        {
            header: 'Buy </BR> Amount', dataIndex: 'buy_amt', sortable: false, align: 'right',
            renderer: function (value, metaData, record, row, col, store, gridView) {
                var str = '';
                if (Ext.isNumeric(record.get('mbl_fk')) && record.get('mbl_fk') != 0) { str = '*' }
                var val = Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
                return val + ' ' + str;
            },

        },
        {
            text: 'Buy </BR> Curr.', dataIndex: 'buy_cid', sortable: false, width: 50
        },
        {
            header: 'Buy <BR> Amt <BR> ' + '(' + PgAtt.getDisplay_currency() + ')', itemId: 'colBuyAmt', sortable: false, align: 'right',
            width: 120,
            renderer: function (value, metaData, record) {
                return Utility.Formatting.NumFormat_Thousands_2Decimals(record.get('buy_usd'), metaData);
            },
            summaryRenderer: function (value, summaryData, dataIndex) {
                return Utility.Formatting.NumFormat_Thousands_2Decimals(value, summaryData);
            },
            dataIndex: 'buy_usd',
            summaryType: 'sum',
            field: {
                xtype: 'numberfield'
            }
        },
        {
            header: 'Margin <BR> Amt <BR> ' + '(' + PgAtt.getDisplay_currency() + ')', itemId: 'colMarginAmt', dataIndex: 'margin_amt', sortable: false, align: 'right',
            renderer: function (value, metaData, record) {
                var str = '-';
                if (this.lastChargeCode != record.get('charge_code')) {
                    return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
                } else {
                    metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                    return Utility.Formatting.NumFormat_Thousands_2Decimals(0, metaData) + str;
                }

            },
            field: {
                xtype: 'numberfield'
            },
            summaryType: function (records, values) {
                var i = 0,
                    length = records.length,
                    total = 0,
                    record;

                for (; i < length; ++i) {
                    record = records[i];
                    total += record.get('sell_usd') - record.get('buy_usd');
                }
                return total;
            },
            summaryRenderer: function (value, summaryData, dataIndex) {
                return Utility.Formatting.NumFormat_Thousands_2Decimals(value, summaryData);
            }
        },
        {
            header: 'Margin <BR> Pct <BR>' + '(' + PgAtt.getDisplay_currency() + ')', itemId: 'colMarginPer', dataIndex: 'margin_per', sortable: false, align: 'right',
            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                var pct = 0, lastChg = '';
                if (record.get('sell_usd') != 0) {
                    pct = ((record.get('sell_usd') - record.get('buy_usd')) / record.get('sell_usd')) * 100;
                }
                if (this.getStore().data.length != rowIdx) {
                    this.lastChargeCode = record.get('charge_code');
                } else {
                    this.lastChargeCode = '';
                }
                if (rowIdx > 0 && rowIdx != undefined) {
                    lastChg = this.getStore().getAt(rowIdx - 1).get('charge_code');
                }
                if (value != 0 && lastChg != record.get('charge_code')) {
                    return Utility.Formatting.NumFormat_Percent_1Decimals(pct, metaData);
                } else {
                    return Utility.Formatting.NumFormat_Percent_1Decimals(0.00, metaData);
                }
            },
            field: {
                xtype: 'numberfield'
            },
            summaryType: function (records, values) {
                var i = 0,
                    length = records.length,
                    total = 0,
                    totalMarginAmt = 0,
                    totalBuyUsd = 0,
                    totalSellUsd = 0,
                    record;

                for (; i < length; ++i) {
                    record = records[i];
                    totalMarginAmt += record.get('margin_amt');
                    totalBuyUsd += record.get('buy_usd');
                    totalSellUsd += record.get('sell_usd');

                }
                if (totalSellUsd != 0)
                    total += ((totalSellUsd - totalBuyUsd) / totalSellUsd) * 100;
                return total;
            },
            summaryRenderer: function (value, summaryData, dataIndex) {
                return Utility.Formatting.NumFormat_Percent_2Decimals(value, summaryData);
            }
        }
    ]



}



);

