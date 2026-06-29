/* ====================================================================================================
NAME:			[Review Coding Sheet grid]
BEHAVIOR:		Shows the Review Coding Sheet Grid for selected invoice id.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/28/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Reports.Bills.PopUps.CodingSheet.ReviewCodingSheetGrid', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-View-Bills-PopUps-CodingSheet-ReviewCodingSheetGrid',
    border: true,
    rec: '',
    store:
    {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/GetReviewCodingSheet'
        },
        pageSize: 15
    },
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'Click Search to begin.',
        forceFit: true
    },
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left' },
    cls: 'UBlue',
    columns: [
        {
            text: '<Div style="color:white;">Shipment<BR> Number</Div>', dataIndex: 'shipment_nbr', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Service<BR>Code</Div>', dataIndex: 'service_code', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Charge<BR>Type</Div>', dataIndex: 'charge_type_code', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Ocn/<BR>Trk</Div>', dataIndex: 'ocean_truck_flag', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Split<BR>Code</Div>', dataIndex: 'rev_split', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Charge<BR>Code</Div>', dataIndex: 'charge_code', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Charge Description</Div>', dataIndex: 'charge_description', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Cost Loc <BR> Code</Div>', dataIndex: 'cost_loc_code', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Company</Div>', dataIndex: 'company', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">RRDD</Div>', dataIndex: 'rrdd', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        }
        ,
        {
            text: '<Div style="color:white;">Center</Div>', dataIndex: 'center_code', cls: 'UBlue', border: 1, autoColumnResize: true,
            xtype: 'widgetcolumn',
            widget: {
                xtype: 'textfield',
                itemId: 'center_code',
                maxLength: 6,
                enforceMaxLength: true
            },
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Ops</Div>', dataIndex: 'ops_type_code', cls: 'UBlue', border: 1, autoColumnResize: true,
            xtype: 'widgetcolumn',
            widget: {
                xtype: 'textfield',
                itemId: 'ops_type_code',
                maxLength: 4,
                enforceMaxLength: true
            },
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Account</Div>', dataIndex: 'account_code', cls: 'UBlue', border: 1, autoColumnResize: true,
            xtype: 'widgetcolumn',
            widget: {
                xtype: 'textfield',
                itemId: 'account_code',
                maxLength: 6,
                enforceMaxLength: true
            },
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Product</Div>', dataIndex: 'product', cls: 'UBlue', border: 1, autoColumnResize: true,
            xtype: 'widgetcolumn',
            widget: {
                xtype: 'textfield',
                itemId: 'product',
                maxLength: 4,
                enforceMaxLength: true
            },
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">PO<BR>Number</Div>', dataIndex: 'PO_number', cls: 'UBlue', border: 1, autoColumnResize: true,
            xtype: 'widgetcolumn',
            widget: {
                xtype: 'textfield',
                itemId: 'PO_number',
                maxLength: 20,
                enforceMaxLength: true
            },
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Amount</Div>', dataIndex: 'total_line_amount', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: function (value, metaData, record, row, col, store, gridView) {
                return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
            }
        }
    ]


});
