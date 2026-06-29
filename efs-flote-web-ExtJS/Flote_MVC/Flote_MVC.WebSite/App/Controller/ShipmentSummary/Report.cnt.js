/* ====================================================================================================
NAME:			[Shipment Summary Controller]
BEHAVIOR:		Shows Shipment Summary Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/16/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
var delivered_dt = '';
Ext.define('App.Controller.ShipmentSummary.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    config: { delivered_dt: null },
    init: function () {
        this.control({
            'App-View-ShipmentSummary-Report': {
                beforerender: this.ReportBeforeRender
            },
            'App-View-ShipmentSummary-Report #btnAddViewShipmentNote': {
                click: this.ShowShipmentNoteW
            }
        });
    },
    ReportBeforeRender: function ReportTabActivate(me) {
        var recDet = me.rec;
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var param = filter.GetParameters();
        me.down('#pnlShipmentDeatilsHeaderId').setCollapsed(true);
        me.down('#pnlShipmentNoteId').setCollapsed(true);
        var grid = me.down('App-View-ShipmentSummary-Grid');

        if (grid) {
            grid.store.addListener({
                load: {
                    fn: this.LoadShipmentDetails,
                    scope: this,
                    args: [me]
                }
            })
        }
        var store = grid.getStore();
        store.getProxy().extraParams.ShipmentNumber = recDet.data.shpmnt_nbr;
        store.getProxy().extraParams.DisplayCurr = param.DisplayCurr;
        store.load();

        this.getShipmentSummary(recDet, me);

        var factGrid = me.down('#factgrid'),
            factStore = factGrid.getStore();
        factStore.getProxy().extraParams.ShipmentNumber = recDet.data.shpmnt_nbr;
        // load new data
        factStore.load();

        var mblGrid = me.down('#mblgrid'),
            mblStore = mblGrid.getStore();
        mblStore.getProxy().extraParams.ShipmentNumber = recDet.data.shpmnt_nbr;
        // load new data
        mblStore.load();

        var noteGrid = me.down('App-View-ShipmentSummary-Note-DisplayGrid');
        if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete == 1) {
            noteGrid.columns[0].setVisible(true);
        }
        else {
            noteGrid.columns[0].setVisible(false);
        }
        var noteStore = noteGrid.getStore();
        noteStore.getProxy().extraParams.ShipmentNumber = recDet.data.shpmnt_nbr;
        noteStore.load();

    },
    getShipmentSummary: function (recDet, me) {

        BIA.Ajax.request({
            url: 'api/WebAPIReport/ShipmentSummary',
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                ShipmentNumber: recDet.data.shpmnt_nbr
            },
            useDefaultXhrHeader: true,
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.status_code == "DLV") { delivered_dt = data.delivered_dt; }
                me.down('form').loadValues(data);
                me.show();
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

    },
    LoadShipmentDetails: function LoadShipmentDetails(me, store, records, success) {
        // Change currency in Grid Header Text by Sriram Sundara
        this.SetCurrencyColumn(me);
        if (success && records.length >= 0) {
            if (records[0].get('TotalRows') > 0) {
                var title = '<span style="padding:0 2px; font-weight:bold;font-size: 12pt;">Ship Nbr: ' + records[0].get('shpmnt_nbr') + '</span>';
                title += '&nbsp;&nbsp;(' + records[0].get('orig_tp') + ' to ' + records[0].get('dest_tp') + ')&nbsp;&nbsp;&nbsp;' + '<span style="font-weight:bold;">Svc</span>:' + records[0].get('service_code') + '&nbsp;&nbsp;<span style="font-weight:bold;">M3</span>:' + Ext.util.Format.number(records[0].get('Cubic_mtrs'), "0,000.00") + '&nbsp;&nbsp;&nbsp;';
                title += '<span style="font-weight:bold;">Rcvd</span>:' + Ext.util.Format.date(records[0].get('rcvd_at_dt'), "Y-m-d") + '&nbsp;&nbsp;&nbsp;';
                if (records[0].get('status_code') == "DLV") {
                    title += '<span style="font-weight:bold;">DLV</span>:' + Ext.util.Format.date(delivered_dt, "Y-m-d");
                }
                else {
                    title += '<span style="font-weight:bold;">DLV</span>: Pending';
                }
                title += '&nbsp;&nbsp;&nbsp;<span style="font-weight:bold;">Status</span>:' + records[0].get('status_code') + '&nbsp;&nbsp;&nbsp;<span style="font-weight:bold;">Shipper PA</span>:' + records[0].get('pa_number') + '&nbsp;&nbsp;&nbsp;<span style="font-weight:bold;">EPA</span>:(' + records[0].get('OrigDEP') + '/' + records[0].get('DestDEP') + ')';
                me.down('#pnlShipmentDeatilsHeaderId').setTitle(title);
            }
        }
        else {
            me.down('#pnlShipmentDeatilsHeaderId').setTitle('Shipment Details : ' + me.rec.data.shpmnt_nbr);
        }
    },

    // Change currency in Grid Header Text by Sriram Sundara

    SetCurrencyColumn: function SetCurrencyColumn(me) {
        var colSellAmt_VS = me.down('#colSellAmt_VS');
        var colBuyAmt_VS = me.down('#colBuyAmt_VS');
        var colMrgAmt_VS = me.down('#colMrgAmt_VS');
        var colMrgPct_VS = me.down('#colMrgPct_VS');

        colSellAmt_VS.setText('<Div style="color:white;">Sell <BR> Amt <BR> (' + PgAtt.getDisplay_currency() + ')</Div>')
        colBuyAmt_VS.setText('<Div style="color:white;">Buy <BR> Amt <BR> (' + PgAtt.getDisplay_currency() + ')</Div>')
        colMrgAmt_VS.setText('<Div style="color:white;">Margin <BR> Amt <BR> (' + PgAtt.getDisplay_currency() + ')</Div>')
        colMrgPct_VS.setText('<Div style="color:white;">Margin <BR> Pct </Div>')
    },

    ShowShipmentNoteW: function ShowShipmentNoteW(me) {
        var win = Ext.widget('App-View-ShipmentSummary-Note-Shipment');
        var mainWin = me.up('window');
        win.rec = mainWin.rec;
        win.show()
    }

});