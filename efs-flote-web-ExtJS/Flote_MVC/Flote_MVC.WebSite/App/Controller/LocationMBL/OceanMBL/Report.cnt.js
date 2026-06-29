/* ====================================================================================================
NAME:			[Location MBL Ocean Summary Controller]
BEHAVIOR:		Shows Location MBL Ocean Summary Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
06/25/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.LocationMBL.OceanMBL.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-LocationMBL-OceanMBL-Report': {
                beforerender: this.ReportBeforeRender,
                render: this.OceanMBLGridRender
            },
            'App-View-LocationMBL-OceanMBL-TBar #btnOceanMBLExport': {
                click: this.OceanMBLExcelExport
            }

        });
    },
    OceanMBLGridRender: function OceanMBLGridRender(me) {
        var grid = me.down('grid');
        if (grid) {
            grid.store.addListener({
                load: {
                    fn: this.loadGridColumns,
                    scope: this,
                    args: [me]
                }
            })
        }
    },
    loadGridColumns: function loadGridColumns(me, store, records, success) {
        if (success && records.length >= 0) {
            this.SetCurrencyColumn(me);
            me.down('#lblOceanMBLLoc').setHtml('<div style="font-size:16; font-weight:bold;"> ' + ' (  ' + records[0].get('orig_tp') + ' to ' + records[0].get('dest_tp') + ' )' + '   ' + records[0].get('service_code') + '</div>');
        }

    },
    ReportBeforeRender: function ReportBeforeRender(me) {
        var record = me.record;
        me.currency = PgAtt.getDisplay_currency();
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }

        me.down('#lblTitleOceanMBL').setHtml('<div style="font-size:20; font-weight:bold;"> MBL Number :  ' + record.get('mbl_nbr') + '</div>');
        var grid = me.down('App-View-LocationMBL-OceanMBL-Grid');
        this.SetCurrencyColumn(me);
        var store = grid.getStore();
        store.getProxy().extraParams = filter.GetParameters();
        store.getProxy().extraParams.MBLNumber = record.get('mbl_nbr')
        store.load();

    },
    SetCurrencyColumn: function SetCurrencyColumn(win) {
        var me = win.down('grid');
        var colSellAmt = me.down('#colSellAmt');
        var colBuyAmt = me.down('#colBuyAmt');
        var colMarginPer = me.down('#colMarginPer');
        var colMarginAmt = me.down('#colMarginAmt');

        colSellAmt.setText('<Div style="color:white;">Sell </BR> Amt </BR> (' + win.currency + ')</Div>');
        colBuyAmt.setText('<Div style="color:white;">Buy </BR> Amt </BR> (' + win.currency + ')</Div>');
        colMarginPer.setText('<Div style="color:white;">Margin </BR> Pct </BR> (' + win.currency + ')</Div>');
        colMarginAmt.setText('<Div style="color:white;">Margin </BR> Amt </BR>(' + win.currency + ')</Div>');
    },
    OceanMBLExcelExport: function OceanMBLExcelExport(me) {
        var win = me.up('window');
        var record = win.record;
        var displayCurr = win.down('#oceanMBLDisplayCurr combobox').getValue();
        var grid = me.up('grid')
        var colNames = '';
        var dataIndexVal = 'ROWNUMBER,rank,type,prec,mbl_nbr,';        
        if (grid) {
            for (var i = 0; i < grid.columns.length; i++) {
                if (!grid.columns[i].hidden && grid.columns[i].text !== "" && grid.columns[i].dataIndex !== null) {
                    colNames = colNames + grid.columns[i].text;
                    dataIndexVal = dataIndexVal + grid.columns[i].dataIndex;
                    if (grid.columns.length - 1 > i && grid.columns.length > 1) {
                        colNames = colNames + ",";
                        dataIndexVal = dataIndexVal + ",";
                    }
                }
            }
        }

        var params = {
            MBLNumber: record.get('mbl_nbr'),
            ExportType: 'OceanMBLExport',
            DisplayCurr: displayCurr,
            UserId: PgAtt.getUserId(),
            PageName: 'OceanMBL',
            ColumnNames: colNames,
            DataIndexes: dataIndexVal
        };


        var form = Ext.create('Ext.form.Panel', {
            standardSubmit: true,
            url: 'api/WebAPIReport/OceanMBLExport',
            method: 'POST'
        });

        form.submit({
            target: '_blank',
            params: params
        });
    }

});