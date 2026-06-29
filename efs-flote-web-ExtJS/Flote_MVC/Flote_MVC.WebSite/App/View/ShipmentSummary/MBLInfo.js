/* ====================================================================================================
NAME:			[Shipment MBL Info]
BEHAVIOR:		Shows Shipment MBL Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/16/2016        mmw7kwz		 Created.
 ======================================================================================================*/
Ext.define('App.View.ShipmentSummary.MBLInfo', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.App-View-ShipmentSummary-MBLInfo',
    border: false,    
    autoScroll: true,
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found!'
    },
    store: {
        type: 'webapi',
        pageSize: 20,
        api: {
            read: 'api/WebAPIReport/MBLSummary'
        }
    },
    tbar: [
          {
              xtype: 'App-View-Component-Common-TbarPanel', reportType: 'ShipmentMBLInfo', listeners: {
                  afterrender: function () {
                      this.down('label').setText('MBL Fact');
                      this.down('#btnExcelExport').setVisible(false);
                  }
              }
          }
    ],
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true },
    cls: 'UBlue',
    columns: [

            {
                text: '<Div style="color:white;">MBL Number</Div>', dataIndex: 'mbl_nbr', renderer: function (value, metaData, record, row, col, store, gridView) {
                    metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                    return value;
                }
            },
            {
                text: '<Div style="color:white;">Mode</Div>', dataIndex: 'mode'
            },
            {
                text: '<Div style="color:white;">E2K<br/>Carrier<br/>Code</Div>', dataIndex: 'vendor_code'
            },
            {
                text: '<Div style="color:white;">Carrier BOL</Div>', dataIndex: 'carrier_bol', renderer: function (value, metaData, record, row, col, store, gridView) {
                    metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                    return value;
                }
            },
            {
                text: '<Div style="color:white;">Depart Date</Div>', dataIndex: 'mbl_depart_date', renderer: BIA.util.Format.dateRenderer('Y/m/d')
            },
            {
                text: '<Div style="color:white;">MBL<br/>Origin</Div>', dataIndex: 'orig_tp'
            },
            {
                text: '<Div style="color:white;">MBL<br/>Destination</Div>', dataIndex: 'dest_tp'
            },
            {
                text: '<Div style="color:white;">Cost<br/>Basis<br/>Code</Div>', dataIndex: 'mbl_cost_basis'
            },
            {
                text: '<Div style="color:white;align:left;">Total<br/>MBL Cost<br/>USD</Div>', align: 'right', dataIndex: 'Total_buy_USD', sortable: false,
                renderer: Utility.Formatting.NumFormat_Thousands_2Decimals

            },
            {
                text: '<Div style="color:white;">Closed Date</Div>', dataIndex: 'mbl_closed_date', renderer: BIA.util.Format.dateRenderer('Y-m-d'), border: 1
            }

    ]

});