/* ====================================================================================================
NAME:			[Bills Sent Controller]
BEHAVIOR:		Bills Sent Events & Actions.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Bills.Sent', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Bills-Sent-Report': {
                activate: this.SentTabActivate
            },
            '[xtype="button"]': {
                btnSaveRejection: this.moveInvoiceToApproveOrScanned
            }
        });
    },
    SentTabActivate: function SentTabActivate(tab) {
        var grid = tab.down('App-View-Bills-Grid');
        if (grid) {
            var colBatchId = Ext.Array.findBy(grid.getColumns(), function (c) { return c.itemId == 'colBatchId'; });
            if (colBatchId) colBatchId.setVisible(true);
        }
    },
    moveInvoiceToApproveOrScanned: function (rec, msg, status) {
        var params = {
            InvoiceId: rec.get('invoice_id'),
            BatchId: 0,
            Comments: msg,
            UserId: BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId,
            RejectedStatus: 'Rejected',
            InvoiceStatusTo: status
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/MoveInvoiceToApproveOrScanned',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params
        });
    }
});