/* ====================================================================================================
NAME:			[Vendor  Shipment Summary Report Grid]
BEHAVIOR:		Shows Vendor Shipment Summary Report Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.VendorShipment.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-VendorShipment-Grid',
    //border: false,    
    autoScroll: true,
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    store: {
        type: 'webapi',
        pageSize: 20,
        api: {
            read: 'api/WebAPIReport/VendorShipmentRpt'
        }
    },
    tbar: [
        {
            xtype: 'App-View-Component-Common-TbarPanel', reportType: 'vendorshipment', listeners: {
                afterrender: function () {
                    this.down('label').setText('Vendor Shipment Summary');
                }
            }
        }
    ],
    bbar: [{ xtype: 'App-View-VendorShipment-BBar', width: '100%' }],
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true },
    cls: 'UBlue',
    border: 1,
    columns: [
        {
            xtype: 'actioncolumn',
            width: '40%',
            text: '*',
            sortable: false,
            tdCls: 'x-grid-cell-Other',
            icon: '',
            handler: function (view, rowIndex, colIndex, item, ev, record) {
                if (record.data['invoice_id'] !== 0) {
                    var win = Ext.widget('App-View-Bills-Detail-Report');
                    win.rec = record;
                    win.show();
                }
                record.dirty = false;
                view.refresh();
            },
            renderer: VendorShipSinCls.VSColumnRenderSort

        },
        {
            text: 'Rcvd at <BR> date', dataIndex: 'rcvd_at_dt', renderer: BIA.util.Format.dateRenderer('m/d/Y')
        },
        {
            text: 'Loc</BR> Code', dataIndex: 'location_code'
        },
        {
            text: 'Vendor<BR>Carrier </BR>Name', itemId: 'colVenCarrName', dataIndex: 'vendor_code'
            , renderer: VendorShipSinCls.VSColumnRenderSort
        },
        {
            text: 'MBL</BR>Number', itemId: 'colMblNbr', dataIndex: 'MBL_nbr',
            renderer: VendorShipSinCls.VSColumnRenderSort
        },
        {
            text: 'CBOL', itemId: 'colCBOL', dataIndex: 'mbl_iata_busid',
            renderer: VendorShipSinCls.VSColumnRenderSort
        },
        {
            text: 'Shipment </BR> Number',
            columns: [
                {
                    text: '', itemId: 'colShipNbr', dataIndex: 'shpmnt_nbr', renderer: VendorShipSinCls.VSColumnRenderSort, cls: 'colColBlueBorderThin'
                },
                {
                    text: '', itemId: 'colShipNbrSort', dataIndex: 'shpmnt_nbr', cls: 'colColBlueBorderThin', renderer: VendorShipSinCls.VSColumnRenderSort
                }
            ]
        },
        {
            text: 'Charge</BR>Split', dataIndex: 'rev_split'
        },
        {
            text: 'Charge',
            columns: [
                {
                    text: 'Code <BR> Type', itemId: 'colChargeCode', dataIndex: 'charge_code',
                    renderer: VendorShipSinCls.VSColumnRenderSort
                },
                {
                    text: 'Description', dataIndex: 'CHARGE_DESCRIPTION'
                }
            ]
        },
        {
            text: 'Sell',
            columns: [
                {
                    text: 'Amt', align: 'right', dataIndex: 'sellamt', sortable: false,
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'Curr.', dataIndex: 'sell_cid', sortable: false
                },
                {
                    text: 'Amt <BR> (' + PgAtt.getDisplay_currency() + ')', align: 'right', dataIndex: 'sellamtUser',
                    itemId: 'colSellAmt_VS', sortable: false, renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                }
            ]
        },
        {
            text: 'Buy',
            columns: [
                {
                    text: 'Amt', align: 'right', dataIndex: 'buy_amt', sortable: false,
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'Curr.', dataIndex: 'buy_cid', sortable: false,
                    renderer: VendorShipSinCls.VSColumnRenderSort
                },
                {
                    text: 'Amt </BR> (' + PgAtt.getDisplay_currency() + ')', align: 'right', dataIndex: 'buy_amt_user',
                    sortable: false, itemId: 'colBuyAmt_VS',
                    renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                }
            ]
        },
        {
            text: 'Diff Amt <BR>(' + PgAtt.getDisplay_currency() + ')', align: 'right', dataIndex: 'diff_amt',
            sortable: false, itemId: 'colDiffAmt_VS', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: '', dataIndex: '', sortable: false, renderer: VendorShipSinCls.VSColumnRenderSort
        },
        {
            text: 'Margin %', dataIndex: '', sortable: false, renderer: VendorShipSinCls.VSColumnRenderSort, format: '0.00', align: 'right'
        },
        {
            text: 'A', dataIndex: '', sortable: false, renderer: VendorShipSinCls.VSColumnRenderSort

        }
    ],
    features: [{
        ftype: 'remotesummary', dock: 'bottom', style: '', renderer: function (value, metaData, record, row, col, store, gridView) {
            metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
            return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
        }
    }]

});