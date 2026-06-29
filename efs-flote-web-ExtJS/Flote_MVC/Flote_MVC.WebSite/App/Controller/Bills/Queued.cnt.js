/* ====================================================================================================
NAME:			[Bills Queued Controller]
BEHAVIOR:		Bills Queued Events & Actions.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Bills.Queued', {
    extend: 'Ext.app.Controller',
    init: function () {
        var me = this;
        this.control({

            'App-View-Bills-Queued-Report': {
            },
            '[xtype="button"]': {
                btnRemoveFromQueue: me.checkInvoiceInTDOC,
                btnSendSelectedBills: me.createBatch
            }
        });
    },
    checkInvoiceInTDOC: function (rec, status) {
        var locCode = rec.get('Location_Code');

        var params = {
            InvoiceId: rec.get('invoice_id'),
            InvoiceRefNo: rec.get('InvRefNo'),
            InvoiceStatus: rec.get('invoice_status'),
            InvoiceStatusTo: status,
            LocCode: locCode,
            UserId: PgAtt.getUserId()
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/CheckInvoiceInTDOC',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            success: function (data) {
                var result = Ext.decode(data.responseText);
                if (result != "") {
                    alert(result);
                }
            }
        });
    },
    createBatch: function (selInvoices) {
        BIA.Ajax.request({
            url: 'api/WebAPIReport/CreateBatch',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                LocCode: PgAtt.getLocation_code(),
                CompanyCode: PgAtt.getCompany_code(),
                GeoCode: PgAtt.getGeoCode(),
                GeoId: PgAtt.getGeoId(),
                UserId: PgAtt.getUserId(),
                SelectedInvoices: selInvoices,
                ScanDest: PgAtt.getScanDest()
            },
            success: function (data) {
                var result = Ext.decode(data.responseText);
                if (result.success) {
                    Ext.Msg.show({
                        title: 'APUT File Confirmation',
                        msg: result.message,
                        width: 500,
                        closable: true,
                        multiline: false,
                        icon: 'images/accept-16x16.gif'
                    });
                } else {
                    Ext.Msg.show({
                        title: 'APUT File Error Notification',
                        msg: result.message,
                        width: 500,
                        closable: true,
                        multiline: false,
                        icon: 'images/warning.png'
                    });

                }
            }
        });
    }
});