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
Ext.define('App.Controller.Bills.ScannedImage.Search', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        var me = this;
        me.control({
            'App-View-Bills-PopUps-ScannedImage-SearchW': {
                beforerender: me.ReportTabBeforeRender
            },
            '[xtype="App-View-Bills-PopUps-ScannedImage-SearchGrid"]': {
                cellclick: me.SearchGridCellClick
            },
            '[xtype="App-View-Bills-PopUps-ScannedImage-SearchW"] #btnScanSearch': {
                click: me.SearchScanDocs
            },
            '[xtype="App-View-Bills-PopUps-BatchDetails-ReportW"] #btnCancelBatchId': {
                click: me.CancelBatch
            }

        });
    },
    ReportTabBeforeRender: function ReportTabBeforeRender(me) {
        var rec = me.rowDetScan;
        me.down('#invIdScanDocId').setValue(rec.get('invoice_id'))
        me.title = '<div style="font-weight: bold">Scanned Invoice Search - ' + rec.get('InvRefNo') + ' </div>';
        me.down('#venInvoiceNoSS').setValue(rec.get('InvRefNo'));
        this.GetSearchScanData(me);
    },
    SearchGridCellClick: function SearchGridCellClick(me, td, cellIndex, record, tr, rowIndex) {
        if (cellIndex > 0) {
            var colName = me.grid.columns[cellIndex].itemId;
            if (colName == 'colImageNumber') {
                var recImg = grid.getStore().getAt(rowIndex);
                var rec = me.up('window').rowDetScan;
                var win = Ext.widget('App-View-Bills-PopUps-ScannedImage-DocViewer');
                win.rec = rec;
                win.recImg = recImg;
                win.type = 'attach';
                win.show();
                me.up('window').close();
            }
        }
    },
    SearchScanDocs: function SearchScanDocs(me) {
        var win = me.up('window');
        if (win.down('#venInvoiceNoSS').getValue().trim() != '') {
            this.GetSearchScanData(win);
        }
        else {
            alert("Three (3) character minumum to search.")
        }
    },
    GetSearchScanData: function (me) {
        var invRefNo = me.down('#venInvoiceNoSS').getValue().trim();
        var recDet = me.rowDetScan;
        var params = '';
        if (invRefNo == '') {
            invRefNo = recDet.get('InvRefNo');
        }
        if (recDet != "") {
            params = {
                InvoiceId: recDet.get('invoice_id'),
                InvoiceRefNo: invRefNo,
                LocCode: recDet.get('Location_Code')
            };
        }
        else {
            params = {
                InvoiceId: me.down('#invIdScanDocId').getValue(),
                InvoiceRefNo: invRefNo,
                LocCode: PgAtt.getLocation_code()

            };
        }
        me.title = '<div style="font-weight: bold">Scanned Invoice Search - ' + invRefNo + ' </div>';
        var grid = me.down('grid');
        var store = me.down('grid').getStore();
        var pager = grid.down('[xtype="pagingtoolbar"]');
        store.getProxy().extraParams = params;
        // load new data
        grid.getView().emptyText = '<div class="x-grid-empty"> No results were found for this Bill Reference Number or the image is not yet available. </div>';
        if (pager) pager.moveFirst(); else store.load();
    }
});