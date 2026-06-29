/* ====================================================================================================
NAME:			[Shipment Notes Controller]
BEHAVIOR:		Shows Shipment Notes Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/16/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ShipmentSummary.Notes', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-ShipmentSummary-Report' }
    ],
    init: function () {
        this.control({
            'App-View-ShipmentSummary-Note-Shipment #btnShipNoteClose': {
                click: this.CloseShipmentNote
            },
            'App-View-ShipmentSummary-Note-Shipment #btnShipNoteAdd': {
                click: this.AddShipmentNote
            },
            'App-View-ShipmentSummary-Note-DisplayGrid #btnRemoveNoteByNoteId': {
                click: this.DeleteShipmentNoteByNoteId
            }

        });
    },


    CloseShipmentNote: function CloseShipmentNote(me) {
        var win = me.up('window');
        win.close();
    },
    AddShipmentNote: function AddShipmentNote(me) {
        var win = me.up('window');
        var rec = win.rec;
        var notes = win.down('#cmtShipmentNoteTxt').value;
        BIA.Ajax.request({
            url: 'api/WebAPIReport/AddShipmentNote',
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                ShipmentNumber: rec.data.shpmnt_nbr,
                Notes: notes
            },
            useDefaultXhrHeader: true,
            success: function (response) {
                win.close();
                var mainWin = this.getActiveCurrent();
                if (mainWin == null) {
                    mainWin = this.getAllCurrent();
                }
                var noteGrid = mainWin.down('App-View-ShipmentSummary-Note-DisplayGrid');
                if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete == 1) {
                    noteGrid.columns[0].setVisible(true);
                }
                else {
                    noteGrid.columns[0].setVisible(false);
                }
                var noteStore = noteGrid.getStore();
                noteStore.getProxy().extraParams.ShipmentNumber = rec.data.shpmnt_nbr;
                noteStore.load();
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    },
    DeleteShipmentNoteByNoteId: function DeleteShipmentNoteByNoteId(me) {
        var record = me.getWidgetRecord();
        var win = me.up('window');
        var rec = win.rec
        var noteGrid = win.down('App-View-ShipmentSummary-Note-DisplayGrid');
        if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete == 1) {
            noteGrid.columns[0].setVisible(true);
        }
        else {
            noteGrid.columns[0].setVisible(false);
        }

        BIA.Ajax.request({
            url: 'api/WebAPIReport/DeleteShipmentNoteByNoteId',
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                NoteId: record.data.frn_id
            },
            useDefaultXhrHeader: true,
            success: function (response) {
                var noteStore = noteGrid.getStore();
                noteStore.getProxy().extraParams.ShipmentNumber = rec.data.shpmnt_nbr;
                noteStore.load();
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    }


});