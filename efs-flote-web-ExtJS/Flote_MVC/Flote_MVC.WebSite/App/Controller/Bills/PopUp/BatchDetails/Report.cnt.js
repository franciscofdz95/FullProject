/* ====================================================================================================
NAME:			[Accruals Controller]
BEHAVIOR:		Shows Accruals Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Bills.BatchDetails.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        var me = this;
        me.control({
            'App-View-Bills-PopUps-BatchDetails-ReportW': {
                beforerender: me.ReportTabBeforeRender
            },
            '[xtype="App-View-Bills-PopUps-BatchDetails-ReportW"] #btnRecallBatchId': {
                click: me.RecallBatch
            },
            '[xtype="App-View-Bills-PopUps-BatchDetails-ReportW"] #btnArchivedBatchId': {
                click: me.MoveToArchivedBatch
            },
            '[xtype="App-View-Bills-PopUps-BatchDetails-ReportW"] #btnCancelBatchId': {
                click: me.CancelBatch
            }

        });
    },
    ReportTabBeforeRender: function ReportTabBeforeRender(me) {
        var rec = me.rowDetails;
        var batchId = rec.get("batch_id"), grid = '', store = '', pager = '';

        if (batchId != "") {
            var params = {
                BatchId: batchId
            };
            grid = me.down('grid');
            store = me.down('grid').getStore();
            pager = grid.down('[xtype="pagingtoolbar"]');
            store.getProxy().extraParams = params;
            // load new data
            grid.getView().emptyText = '<div class="x-grid-empty"> No results were found for this Bill Reference Number or the image is not yet available. </div>';
            if (pager) pager.moveFirst(); else store.load();

        }
        else {
            alert("Batch id is missing, Please try it again.");
        }
    },
    RecallBatch: function RecallBatch(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var win = me.up('window');
        var comment = win.down('#cmtRejectBatchesId').getValue();
        if (comment != '') {
            var rec = win.rowDetails;
            var userId = BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId;

            var params = {
                BatchId: rec.get('batch_id'),
                UserId: userId,
                Comments: comment,
                InvoiceStatusTo: 'Approved',
                InvoiceStatus: 'Sent'
            };

            BIA.Ajax.request({
                url: 'api/WebAPIReport/RecallBatch',
                method: "POST",
                async: false,
                cache: false,
                dataType: "html",
                headers: {
                    "Content-Type": "application/json"
                },
                jsonData: params,
                useDefaultXhrHeader: true,                
                failure: function (conn, response, options, eOpts) {
                    BIACore.Exception(conn.responseText);
                    BIACore.Message(response);
                },
                scope: this
            });
            PgAtt.setFilterGoFlag(true);
            filter.fireEvent('btnApply', me);
            win.close();
        } else {
            alert('Please Enter a comment why the invoice is being rejected');
        }
    },
    MoveToArchivedBatch: function MoveToArchivedBatch(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var win = me.up('window');
        var rec = win.rowDetails;
        var userId = BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId;

        var params = {
            BatchId: rec.get('batch_id'),
            UserId: userId
        };

        BIA.Ajax.request({
            url: 'api/WebAPIReport/ArchiveBatch',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,            
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        PgAtt.setFilterGoFlag(true);
        filter.fireEvent('btnApply', me);
        win.close();
    },
    CancelBatch: function CancelBatch(me) {
        me.up('window').close();
    }
});