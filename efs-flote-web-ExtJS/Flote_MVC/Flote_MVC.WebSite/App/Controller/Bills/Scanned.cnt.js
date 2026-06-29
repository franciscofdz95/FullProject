/* ====================================================================================================
NAME:			[Bills Scanned Controller]
BEHAVIOR:		Bills Scanned Events & Actions.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Bills.Scanned', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            //'App-View-Bills-Scanned-Report': {

            //},
            '[xtype="button"]': {
                btnAddToQueue: this.checkInvoiceInTDOC
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
            DocumentId: rec.get("ImageNumber"),
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
    }
});