/* ====================================================================================================
NAME:			[Accrual Month Details Report]
BEHAVIOR:		Shows Accrual Accuracy Month Details Report.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Accrual.Details.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-Accrual-Details-Grid',
    border: true,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/AccrualMonDetailRpt'
        },
        sorters: [
            { property: 'rcvd_at_date', direction: 'ASC' },
            { property: 'depart_date', direction: 'DESC' }
        ]
    },
    columnLines: true,
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    tbar: [
          {
              xtype: 'App-View-Component-Common-TbarPanel', reportType: 'accrualDetail', listeners: {
                  afterrender: function () {
                      this.down('label').setText('Accrual Monthly Details');
                  }
              }
          }
    ],
    columns: {
        defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true },
        cls: 'UBlue',
        items: [
                {
                    text: 'Rcvd At Date</BR>(mm-dd-yyyy)', dataIndex: 'RCVD_AT_DATE'//, renderer: BIA.util.Format.dateRenderer('m-d-Y')

                },
                {
                    text: 'Depart Date</BR>(mm-dd-yyyy)', dataIndex: 'DEPART_DATE', renderer: BIA.util.Format.dateRenderer('m-d-Y')

                },
                {
                    text: 'Year', dataIndex: 'acctg_per_year'

                },
                {
                    text: 'Month', dataIndex: 'acctg_per_month'

                },
                  {
                      text: 'Shipment</BR>Number', dataIndex: 'shipment_nbr'

                  },
                   {
                       text: 'Shipment</BR>Dim FK', dataIndex: 'shipment_dim_fk'

                   },
                {
                    text: 'Orig.</BR>Loc.', dataIndex: 'ORIG_TP'

                },
                {
                    text: 'Orig.</BR>CC', dataIndex: 'ORIG_CC'

                },
                {
                    text: 'Dest.</BR>Loc', dataIndex: 'DEST_TP'

                },
                {
                    text: 'Dest.</BR>CC', dataIndex: 'DEST_CC'

                },
                {
                    text: 'Charge</BR>Code', dataIndex: 'CHARGE_CODE'

                },
                {
                    text: 'Service </BR> Code', dataIndex: 'SERVICE_CODE'

                },
                {
                    text: 'COMP.', dataIndex: 'company_code'

                },
                {
                    text: 'JRNL DATE</BR>(yyyy-mm-dd)', dataIndex: 'jrnl_date'

                },
                {
                    text: 'ACC.', dataIndex: 'account_code'

                },
                {
                    text: 'PROD.', dataIndex: 'product'

                },
                {
                    text: 'CENTER', dataIndex: 'center_code'

                },
                {
                    text: 'OPER.', dataIndex: 'opstypecode'

                },
                {
                    text: 'RRDD', dataIndex: 'rrdd_code'

                },
                {
                    text: 'Captured</BR>Info', dataIndex: 'Captured_Info_DEF'

                },
                {
                    text: 'STAT EXP</BR>AMT', align: 'right', dataIndex: 'STAT_AMOUNT'
                    , renderer: Utility.Formatting.NumFormat_Thousands_2Decimals

                },
                {
                    text: 'DEBIT', align: 'right', dataIndex: 'ORA_LOCAL_AMOUNT_DR'
                    , renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'CREDIT', align: 'right', dataIndex: 'ORA_LOCAL_AMOUNT_CR'
                    , renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'CID', dataIndex: 'ORA_CURRENCY_CODE'

                },
                {
                    text: 'REV</BR>SPLIT', dataIndex: 'REV_SPLIT'

                },
                {
                    text: 'COST</BR>LOC', dataIndex: 'COST_LOC_CODE'

                },
                {
                    text: 'REV</BR>AMT', align: 'right', dataIndex: 'SELL_AMT_LOCAL'
                    , renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
                },
                {
                    text: 'Vendor</BR>Code', dataIndex: 'vendor_code'

                },
                {
                    text: 'Vendor</BR>Name', dataIndex: 'vendor_name'

                },
                {
                    text: 'Carrier</BR>BOL', dataIndex: 'Carrier_Bol'

                },
                {
                    text: 'EPA</BR>LOC', dataIndex: 'EPA_LOC'

                },
                {
                    text: 'EPA</BR>CC', dataIndex: 'EPA_CC'

                },
                {
                    text: 'Notes', dataIndex: 'Notes'

                },
                {
                    text: 'Charge</BR>Description', dataIndex: 'Charge_Description'

                },
                {
                    text: 'Ship</BR>Period', dataIndex: 'Ship_period'

            },
            {
                text: 'Invoice</BR>Status', dataIndex: 'Invoice_Status',               
                renderer: function (value, metadata, record) {
                    if (record.get('Invoice_Status') == null || record.get('Invoice_Status') == "") {
                        return 'NULL';
                    }
                    else {
                        return record.get('Invoice_Status');
                    }

                }

            }

        ]
    }
});