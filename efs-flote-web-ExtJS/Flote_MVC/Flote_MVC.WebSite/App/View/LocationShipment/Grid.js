/* ====================================================================================================
NAME:			[Location Shipment Report Grid]
BEHAVIOR:		Shows Location Shipment Report Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LocationShipment.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-LocationShipment-Grid',
    pageSize: 20,
    rowData: '',
    autoPageSize: false,
    addAPUT: false,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/LocShipReport'
        },
        sorters: [{
            property: 'shpmnt_nbr',
            direction: 'DESC'
        }]
    },
    tbar: [
        {
            xtype: 'App-View-Component-Common-TbarPanel', reportType: 'locationshipment', listeners: {
                afterrender: function () {
                    this.down('label').setText('Location Shipment Summary');
                }
            }
        }
    ],
    bbar: [{ xtype: 'App-View-LocationShipment-BBar', width: '100%' }],
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true },
    cls: 'UBlue',
    border: 1,
    columns: [
        {
            text: 'Rcvd at date', dataIndex: 'rcvd_at_dt', renderer: BIA.util.Format.dateRenderer('m/d/Y')
        },
        {
            text: 'Location <BR> code', dataIndex: 'location_code', maxWidth: 61
        },
        {
            text: 'Orig.', dataIndex: 'orig_tp'
        },
        {
            text: 'Dest.', dataIndex: 'dest_tp'
        },
        {
            text: 'Shipment</BR>Number',
            maxWidth: '100px',
            columns: [
                {
                    text: '', itemId: 'colShpNbrLS', dataIndex: 'shpmnt_nbr', cls: 'colColBlueBorderThin', width: 60,
                    renderer: function (value, metaData) {
                        metaData.style = "text-decoration: underline;cursor: pointer";
                        return '<a><span style="color:#1D598E;" >' + value + '</span></a>';
                    }
                },
                {
                    text: '', itemId: 'colShpNbrSortLS', dataIndex: 'shpmnt_nbr', cls: 'colColBlueBorderThin', width: 30, renderer: function (value, metaData, record, row, col, store, gridView) {
                        if (value !== "") {
                            if (PgAtt.getShipment_number() != '') {
                                return '<i title="Remove Shipment Number Filter" class="fa fa-search-minus"></i>';
                            }
                            else {
                                return '<i title="Add Shipment Number Filter" class="fa fa-search-plus"></i>';
                            }
                        }
                    }
                }
            ]
        },
        {
            text: 'O/D', dataIndex: 'OD_ind'
        },
        {
            text: 'I/U', dataIndex: 'Charge_Status'
        },
        {
            text: 'O/A', dataIndex: 'Invoice_Status'
        },
        {
            text: 'Service', dataIndex: 'service_code'
        },
        {
            text: 'Status', dataIndex: 'Status_Code'
        },
        {
            text: 'Teu/ </BR> Cont.', dataIndex: 'SHIPMENT_TEU', align: 'right',
            renderer: function (value, metaData, record) {
                var val = '';
                if (Ext.isDefined(record.get('service_code')) && !Ext.isEmpty(record.get('service_code')) && record.get('service_code') === 'OF22') {
                    val = record.get('cont_Count');
                } else {
                    val = Ext.util.Format.number(value, '0.00');
                }
                return val;
            }
        },
        {
            text: 'M3', dataIndex: 'Cubic_mtrs', align: 'right'
        },
        {
            text: 'Customer </BR> Group', dataIndex: 'CUSTOMER_GROUP',
            renderer: Utility.Formatting.LocationShipmentgridRenderedHtmlString
        },
        {
            text: 'Shipper', dataIndex: 'SHIPPER_NAME',
            renderer: Utility.Formatting.LocationShipmentgridRenderedHtmlString
        },
        {
            text: 'Consignee', dataIndex: 'CONSIGNEE_NAME',
            renderer: Utility.Formatting.LocationShipmentgridRenderedHtmlString
        },
        {
            text: 'Freight </BR> Payer', dataIndex: 'CUST_NAME',
            renderer: Utility.Formatting.LocationShipmentgridRenderedHtmlString
        },
        {
            text: 'Charge Count', dataIndex: 'ChargeCount', align: 'right'
        },
        {
            text: 'Manifested (' + PgAtt.getDisplay_currency() + ')',
            itemId: 'colManifestedShip',
            columns: [
                {
                    text: 'Sell Amt', align: 'right', dataIndex: 'ManifestedSellAmtUSD', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'Buy Amt', align: 'right', dataIndex: 'ManifestedBuyAmtUSD', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'Diff', align: 'right', dataIndex: 'Man_Diff', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                }
            ]
        },
        {
            text: 'Local (' + PgAtt.getDisplay_currency() + ')',
            itemId: 'colLocalShip',
            columns: [
                {
                    text: 'Sell Amt', align: 'right', dataIndex: 'UnManifestedSellAmtUSD', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'Buy Amt', align: 'right', dataIndex: 'UnManifestedBuyAmtUSD', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'Diff', align: 'right', dataIndex: 'Loc_Diff', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                }
            ]
        },
        {
            text: 'Orig. Net', align: 'right', dataIndex: 'Orig_Net', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: 'Dest. Net', align: 'right', dataIndex: 'Dest_Net', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: 'Total Diff <BR> Amt (' + PgAtt.getDisplay_currency() + ')', dataIndex: 'Tot_Diff', itemId: 'colTotDiffShip',
            renderer: Utility.Formatting.NumFormat_Thousands_2Decimals, align: 'right'
        },
        {
            text: 'Pass-Through', align: 'right', dataIndex: 'BalanceSheetAmtUSD', hidden: true,
            renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        }
    ],
    features: [{
        ftype: 'remotesummary', dock: 'bottom', style: '', renderer: function (value, metaData, record, row, col, store, gridView) {
            metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
            return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
        }
    }]

});
