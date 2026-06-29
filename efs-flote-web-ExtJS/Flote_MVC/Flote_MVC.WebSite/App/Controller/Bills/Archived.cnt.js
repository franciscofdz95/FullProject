/* ====================================================================================================
NAME:			[Bills Archived Controller]
BEHAVIOR:		Bills Archived Events & Actions.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Bills.Archived', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Bills-Archived-Report': {
                activate: this.ArchivedTabActivate
            },
            '[xtype="actioncolumn"] ': {
                actionColBillsIcons: this.moveInvoiceToApproveOrScanned
            }
        });
    },
    ArchivedTabActivate: function ArchivedTabActivate(tab) {
        var grid = tab.down('App-View-Bills-Grid');
        if (grid) {
            var colBatchId = Ext.Array.findBy(grid.getColumns(), function (c) { return c.itemId == 'colBatchId'; });
            if (colBatchId) colBatchId.setVisible(true);
        }
    },
    moveInvoiceToApproveOrScanned: function (rec, msg, status) {


        var params ={
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
            //success: function (data) { }
        });
    }
});