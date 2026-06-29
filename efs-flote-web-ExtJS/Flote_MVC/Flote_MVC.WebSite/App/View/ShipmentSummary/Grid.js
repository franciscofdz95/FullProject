/* ====================================================================================================
NAME:			[Shipment Summary Report Grid]
BEHAVIOR:		Shows Shipment Summary Report Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/16/2016        Sheetal Karre		 Created.
 ======================================================================================================*/

Ext.define('App.View.ShipmentSummary.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.App-View-ShipmentSummary-Grid',
    border: true,
    autoScroll: false,
    autoPageSize: false,
    cls: 'UBlue',
    layout: 'fit',
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.',
        forecefit: false
    },
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/ShipmentRpt'
        },
        remoteSort: false,        
        grouper: {
            groupFn: function (item) {
                return '<span style="color:#358ac8;">' + item.get('rank') + '</span>' + item.get('type');
            }
        },
        autoLoad: false
    },
    dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        items: [

            { xtype: 'tbfill' },
            { xtype: 'App-View-VendorShipment-Currency', margin: '5 5 5 5', itemId: "vendorShipDisplayCurr" },
            {
                xtype: 'button',
                itemId: 'btnShipDetailExport', icon: 'images/excel_button_16.png', margin: '5 15 5 5'
            }

        ]
    }],
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
        }],
    groupHeaderTpl: '{type}',
    columnLines: true,
    defaults: {
        menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true, autoSizeColumn: true, scrollable: true
    },
    columns: [
        {
            //    text: 'type',
            //    flex: 1,
            //    tdCls: 'type',
            //    sortable: false, border: 1,
            //    dataIndex: 'type', autoColumnResize: true,
            //    hideable: false,
            //    summaryType: 'count',
            //    summaryRenderer: function (value, summaryData, dataIndex) {
            //        return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
            //    }
            //}, {
            header: 'Location',
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            width: 75,
            sortable: false, border: 1,
            dataIndex: 'location_code', autoColumnResize: true,
            summaryType: 'count',
            renderer: Utility.Formatting.SummaryDetailsRenderer,
            summaryRenderer: function (value, summaryData, dataIndex, record) {                
                if (value != undefined && (value === 0 || value > 0)) { this.up('grid').valCount += value; }
                return ((value === 0 || value > 1) ? (record.record.ownerGroup || 'Grand Total') + ' - ' + value + ' Records' : (record.record.ownerGroup || 'Grand Total') + ' - ' + this.up('grid').valCount + ' Record');
            },
            field: {
                xtype: 'numberfield'
            }
        }, {
            header: 'Row <BR> Type',
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            width: 60,
            sortable: false, border: 1,
            dataIndex: 'rowtype', autoColumnResize: true,
            renderer: Utility.Formatting.SummaryDetailsRenderer
        },
        {
            header: 'Status', dataIndex: 'CHARGE_STATUS', border: 1, sortable: false, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: Utility.Formatting.SummaryDetailsRenderer
        },
        {
            header: 'Vendor Code', dataIndex: 'vendor_name', border: 1, sortable: false, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: Utility.Formatting.SummaryDetailsRenderer
        },
        {
            header: 'MBL<BR>Number', dataIndex: 'mbl_nbr', border: 1, sortable: false, width: 130,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: Utility.Formatting.SummaryDetailsRenderer
        },
        {
            header: 'Charge Code', dataIndex: 'charge_code', border: 1, sortable: false, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: Utility.Formatting.SummaryDetailsRenderer
        },
        {
            header: 'Charge Desc', dataIndex: 'CHARGE_DESCRIPTION', border: 1, sortable: false, width: 250,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: Utility.Formatting.SummaryDetailsRenderer
        },
        {
            header: 'Charge Split', dataIndex: 'rev_split', border: 1, sortable: false, width: 100,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: Utility.Formatting.SummaryDetailsRenderer
        },
        {
            header: 'Rev Top<BR>Ind', dataIndex: 'intl_ahl_topline_ind', border: 1, sortable: false, width: 65,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: Utility.Formatting.SummaryDetailsRenderer
        },
        {
            header: 'Sell<BR>Amount', dataIndex: 'sell_amt', border: 1, sortable: false, autoColumnResize: true, align: 'right',
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }, //Shipment Detail Screen Sizing - FLOTE V2 14011 Sriram
            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                var val = 0
                if (record.get('DuplicateFlag') != 'Y') { val = value; }
                return Utility.Formatting.SummaryTwoDecimalRenderer(val, metaData, record);
            } //Shipment Detail Screen Sizing - FLOTE V2 14011 Sriram
        },
        {
            header: 'Sell<BR>Curr.', dataIndex: 'sell_cid', border: 1, sortable: false, width: 50,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: Utility.Formatting.SummaryDetailsRenderer
        },
        {
            header: 'Sell <BR> Amt <BR>(' + PgAtt.getDisplay_currency() + ')', align: 'right',
            width: 120,
            sortable: false, border: 1, autoColumnResize: true, itemId: 'colSellAmt_VS',
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                var val = 0
                if (record.get('DuplicateFlag') != 'Y') { val = value; }
                return Utility.Formatting.SummaryTwoDecimalRenderer(val, metaData, record);
            },
            summaryType: function (records, values) {
                var i = 0,
                    length = records.length,
                    total = 0,
                    record;

                for (; i < length; ++i) {
                    record = records[i];
                    if (record.get('DuplicateFlag') != 'Y') {
                        total += record.get('sell_usd');
                    }

                }
                return total;
            },
            summaryRenderer: function (value, summaryData, dataIndex) {
                return Utility.Formatting.NumFormat_Thousands_2Decimals(value, summaryData);
            },
            dataIndex: 'sell_usd',
            field: {
                xtype: 'numberfield'
            }
        },
        {
            header: 'Buy <BR> Amount', dataIndex: 'buy_amt', border: 1, sortable: false, autoColumnResize: true, align: 'right',
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }, //Shipment Detail Screen Sizing - FLOTE V2 14011 Sriram
            renderer: Utility.Formatting.SummaryBuyRenderer,
            //summaryRenderer: function (value, summaryData, dataIndex) {
            //    return Utility.Formatting.NumFormat_Thousands_2Decimals(value, summaryData);
            //},                
            field: {
                xtype: 'numberfield'
            } //Shipment Detail Screen Sizing - FLOTE V2 14011 Sriram
        },
        {
            text: 'Buy <BR> Curr.', dataIndex: 'buy_cid', border: 1, sortable: false, width: 50,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: Utility.Formatting.SummaryDetailsRenderer
        },
        {
            header: 'Buy <BR> Amt  <BR>(' + PgAtt.getDisplay_currency() + ')', align: 'right',
            width: 120,
            sortable: false, border: 1, autoColumnResize: true, itemId: 'colBuyAmt_VS',
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: Utility.Formatting.SummaryBuyRenderer,
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
            header: 'Margin <BR> Amt  <BR>(' + PgAtt.getDisplay_currency() + ')', border: 1, sortable: false, autoColumnResize: true, dataIndex: 'margin_amt', itemId: 'colMrgAmt_VS', align: 'right',
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                if (record.get('rank') != 6) {
                    metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(Utility.Formatting.SummaryDetailRowTooltipString(record)) + '"';
                    //margin_amt 
                    if (record.get('DuplicateFlag') != 'Y') {
                        return Utility.Formatting.NumFormat_Thousands_2Decimals(record.get('sell_usd') - record.get('buy_usd'), metaData);
                    } else { return Utility.Formatting.NumFormat_Thousands_2Decimals(0 - record.get('buy_usd'), metaData); }

                } else { return; }
            },
            summaryType: function (records, values) {
                var i = 0,
                    length = records.length,
                    total = 0,
                    record;

                for (; i < length; ++i) {
                    record = records[i];
                    if (record.get('DuplicateFlag') != 'Y') {
                        total += record.get('sell_usd') - record.get('buy_usd');
                    }
                    else { total = total - record.get('buy_usd'); }
                }
                return total;
            },
            summaryRenderer: function (value, summaryData, dataIndex) {
                return Utility.Formatting.NumFormat_Thousands_2Decimals(value, summaryData);
            }
        },
        {
            header: 'Margin <BR> Pct  <BR>(' + PgAtt.getDisplay_currency() + ')', border: 1, sortable: false, autoColumnResize: true, dataIndex: 'margin_per', itemId: 'colMrgPct_VS', align: 'right',
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                var pct = 0;
                if (record.get('sell_usd') != 0 && record.get('DuplicateFlag') != 'Y') {
                    pct = ((record.get('sell_usd') - record.get('buy_usd')) / record.get('sell_usd')) * 100;
                }
                if (record.get('rank') != 6) {
                    metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(Utility.Formatting.SummaryDetailRowTooltipString(record)) + '"';
                    return Utility.Formatting.NumFormat_Percent_1Decimals(pct, metaData);
                } else { return; }
            },
            summaryType: function (records, values) {
                var i = 0,
                    length = records.length,
                    total = 0,
                    totalSellUsd = 0,
                    totalBuyUsd = 0,
                    record;

                for (; i < length; ++i) {
                    record = records[i];
                    totalBuyUsd += record.get('buy_usd');
                    if (record.get('DuplicateFlag') != 'Y') {
                        totalSellUsd += record.get('sell_usd');
                    }


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

