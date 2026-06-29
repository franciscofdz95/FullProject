/* ====================================================================================================
NAME:			[Import Excel Controller]
BEHAVIOR:		Controller action for Import Execel page.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/13/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ImportExcel.Report', {
    extend: 'Ext.app.Controller',
    refs: [
            { ref: 'Current', selector: 'App-View-ImportExcel-Report' }
    ],
    init: function () {
        var me = this;
        me.control({
            'App-View-ImportExcel-Report': {
                beforerender: me.ReportTabBeforeRender
            },
            '[xtype="App-View-ImportExcel-Report"]': {
                SetShowErrors: this.SetShowErrors
            }

        });
    },
    ReportTabBeforeRender: function ReportTabBeforeRender(me) {
        me.width = Ext.getBody().getViewSize().width + 'px';
        me.height = Ext.getBody().getViewSize().height + 'px';
        ImportExcelSCls.getColumnFieldsList();
    },
    SetShowErrors: function SetShowErrors(bShow, errType) {
        var win = this.getActiveCurrent();        
        var invoiceId = ImportExcelSCls.getInvoiceId();
        var grid = win.down('App-View-ImportExcel-Validate-Grid');
        var store = grid.getStore();
        ImportExcelSCls.setShowErrors(bShow);

        var pager = grid.down('[xtype="pagingtoolbar"]');
        store.getProxy().extraParams.InvoiceId = invoiceId;
        store.getProxy().extraParams.ShowError = bShow;
        store.getProxy().extraParams.ErrorType = errType;
        store.getProxy().extraParams.UserId = PgAtt.getUserId();
        if (pager) pager.moveFirst(); else store.load();
    }

});

