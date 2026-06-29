/* ====================================================================================================
NAME:			[Location MBL Ocean Report Grid]
BEHAVIOR:		Shows Location MBL Ocean Report Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LocationMBL.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-LocationMBL-Grid',
    border: false,
    store: {
        type: 'webapi',
        pageSize: 25,
        api: {
            read: 'api/WebAPIReport/LocOceanMBLRpt'
        },
        sorters: [
            { property: 'mbl_depart_date', direction: 'DESC' },
           { property: 'mbl_nbr', direction: 'ASC' }
        ]
    },
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'

    },
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true },
    cls: 'UBlue',
    tbar: [
        {
            xtype: 'App-View-Component-Common-TbarPanel', reportType: 'locationmasterbill', listeners: {
                afterrender: function () {
                    this.down('label').setText('Location Ocean MBL');
                }
            }
        }
    ],
    columnLines: true,
    columns: [
            {
                text: 'MBL Depart </BR> Date </BR> (mm/dd/yyyy)', dataIndex: 'mbl_depart_date', renderer: BIA.util.Format.dateRenderer('m/d/Y')
            },
            {
                text: 'Location', dataIndex: 'location_code'
            },
            {
                text: 'MBL </BR> Orig.</BR>Port', dataIndex: 'mbl_orig_port'
            },
            {
                text: 'MBL</BR>Dest.</BR>Port', dataIndex: 'mbl_dest_port'
            },
             {
                 text: 'MBL Number',
                 columns: [
                            {
                                text: '', itemId: 'colMblNbr', dataIndex: 'mbl_nbr', cls: 'colColBlueBorderThin', renderer: function (value, metaData, record, row, col, store, gridView) {
                                    metaData.style = "text-decoration: underline;cursor: pointer";
                                    return '<a><span style="color:#1D598E;" >' + value + '</span></a>';
                                }
                            },
                             {
                                 text: '', itemId: 'colMblNbrSortLocM', dataIndex: 'mbl_nbr', cls: 'colColBlueBorderThin', renderer: function (value, metaData, record, row, col, store, gridView) {
                                     if (value !== "") {
                                         if (PgAtt.getMbl_number() != '') {
                                             return '<i title="Remove Mbl Number Filter"  class="fa fa-search-minus"></i>';
                                         }
                                         else {
                                             return '<i title="Add Mbl Number Filter"  class="fa fa-search-plus"></i>';
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
                text: 'Cost</BR>Basis</BR>Code', dataIndex: 'mbl_cost_basis'
            },
            {
                text: 'Shipment</BR>Count', dataIndex: 'ShipmentCount', align: 'right'
            },
            {
                text: 'Manifested (' + PgAtt.getDisplay_currency() + ')',
                itemId: 'colManifested',
                columns: [
                          {
                              text: 'Sell Amt', align: 'right', dataIndex: 'ManifestedSellAmtUSD', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                          },
                          {
                              text: 'Buy Amt', align: 'right', dataIndex: 'ManifestedBuyAmtUSD', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                          },
                          {
                              text: 'Diff Amt', align: 'right', dataIndex: 'Man_Diff', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                          }
                ]
            },
            {
                text: 'Local (' + PgAtt.getDisplay_currency() + ')',
                itemId: 'colLocal',
                columns: [
                              {
                                  text: 'Sell Amt', align: 'right', dataIndex: 'UnManifestedSellAmtUSD', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                              },
                            {
                                text: 'Buy Amt', align: 'right', dataIndex: 'UnManifestedBuyAmtUSD', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                            },
                            {
                                text: 'Diff Amt', align: 'right', dataIndex: 'Loc_Diff', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                            },
                            {
                                text: 'Pass-Through', align: 'right', dataIndex: 'BalanceSheetAmtUSD', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                            }
                ]
            },
            {
                text: 'Total Diff <BR> Amt(' + PgAtt.getDisplay_currency() + ')', dataIndex: 'Tot_Diff',
                itemId: 'colTotDiff', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals, align: 'right'
            }
    ],
    features: [{
        ftype: 'remotesummary', dock: 'bottom', style: '', renderer: function (value, metaData, record, row, col, store, gridView) {
            metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
            return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
        }
    }]


});