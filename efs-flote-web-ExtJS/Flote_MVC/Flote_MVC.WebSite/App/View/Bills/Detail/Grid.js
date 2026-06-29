/* ====================================================================================================
NAME:			[Bill Detail Grid Report]
BEHAVIOR:		Shows Bill Detail Grid Report.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Bills.Detail.Grid', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-View-Bills-Detail-Grid',
    pageSize: 18,
    border: true,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/BillDetailGridData'
        },
        sorters: [
              { property: 'InvRefNo', direction: 'ASC' },
              { property: 'location_code', direction: 'ASC' },
              { property: 'CreatedBy', direction: 'ASC' },
              { property: 'ModifiedBy', direction: 'ASC' },
        ],
        autoLoad: false
    },
    rowData: '',
    autoPageSize: false,
    addAPUT: false,
    tbar: [{ xtype: 'App-View-Bills-Detail-TBar' }
    ],
    selType: 'cellmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],
    viewConfig: {
        deferEmptyText: false,
        enableTextSelection: true,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true },
    cls: 'UBlue',
    columns: [

    { text: '<Div style="color:white;">Rcvd at date</Div>', dataIndex: 'rcvd_at_dt', renderer: BIA.util.Format.dateRenderer('m/d/Y') },
    {
        text: '<Div style="color:white;">Shipment</BR>Number</Div>', dataIndex: 'shpmnt_nbr', itemId: 'colShipNoBDG',
        renderer: function (value, metaData, record, row, col, store, gridView) {
            metaData.style = "text-decoration: underline;cursor: pointer";
            return '<a><span style="color:#1D598E;" >' + value + '</span></a>';
        }
    },
    { text: '<Div style="color:white;">MBL</BR>Number</Div>', dataIndex: 'mbl_nbr' },
    { text: '<Div style="color:white;">Charge <BR> Code</Div>', dataIndex: 'Charge_code' },
    { text: '<Div style="color:white;">Description</Div>', dataIndex: 'CHARGE_DESCRIPTION' },
    {
        text: '<Div style="color:white;">E2K Created <BR> By</Div>', dataIndex: 'last_name',
        renderer: function (value, metaData, record, row, col, store, gridView) {
            return record.get('first_name') + ' ' + record.get('last_name')
        }
    },
    { text: '<Div style="color:white;">Flote<BR>Submitted</BR>By</Div>', dataIndex: 'ModifiedBy' },
    { text: '<Div style="color:white;">Flote<BR>Submitted</BR>Date</Div>', dataIndex: 'ModifiedDT', renderer: BIA.util.Format.dateRenderer('m/d/Y') },
    {
        text: '<Div style="color:white;">Orig.</BR>Buy<BR> Amt</Div>', dataIndex: 'buy_amt'
    ,
        renderer: function (value, metaData, record, row, col, store, gridView) {
            return BillsSingCls.getBuyAmtRender(this, value, metaData, record, row, col, store, gridView);
        }
    },
    { text: '<Div style="color:white;">Orig.</BR>Buy<BR>Curr.</Div>', dataIndex: 'buy_cid' },
    {
        text: '<Div style="color:white;">Charge<BR>Amt</Div>', dataIndex: 'charge_amt'
    ,
        renderer: function (value, metaData, record, row, col, store, gridView) {
            return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
        }
    },
    { text: '<Div style="color:white;">Charge<BR>Curr.</Div>', dataIndex: 'charge_cid' },
    {
        text: '<Div style="color:white;">Bill</BR>Buy<BR> Amt</Div>', dataIndex: 'invoice_amt'
    ,
        renderer: function (value, metaData, record, row, col, store, gridView) {
            return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
        }
    },
    {
        text: '<Div style="color:white;">Bill</BR>Buy<BR>Curr.</Div>', dataIndex: 'invoice_cid'

    },
    {
        text: '<Div style="color:white;">Diff<BR>Amt</Div>', dataIndex: 'diff_amt'
    ,
        renderer: function (value, metaData, record, row, col, store, gridView) {
            return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
        }
    },
    {
        text: '<Div style="color:white;">Paid Differently </br> Reason</Div>', dataIndex: 'PaidDifferentlyReason', sortable: false
    },
    {
        text: '<Div style="color:white;">Comments</Div>', dataIndex: 'comment', sortable: false
    },
    {
        xtype: 'widgetcolumn',
        text: '<Div style="color:white;">Reference</Div>', dataIndex: 'Reference', itemId: 'colReferenceId',
        widget: {
            xtype: 'textfield',
            listeners: {
                focusleave: function (text, event, eOpts) {
                    var val = Ext.util.Format.trim(this.getValue());
                    if (val != "" && val != null) {
                        var grid = this.up('grid');
                        var record = text.getWidgetRecord();
                        grid.fireEvent('colReferenceId', record, val, PgAtt.getUserId());
                    }
                }
            }
        },
        onWidgetAttach: function (column, widget, record) {
            if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 1) {
                widget.setDisabled(false);
            } else {
                widget.setDisabled(true);
            }
        }
    },
    ],
    features: [{
        ftype: 'remotesummary', dock: 'bottom', style: '', renderer: function (value, metaData, record, row, col, store, gridView) {
            metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
            if (value != 0.00) {
                return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
            } else { return ''; }
        }
    }]

});