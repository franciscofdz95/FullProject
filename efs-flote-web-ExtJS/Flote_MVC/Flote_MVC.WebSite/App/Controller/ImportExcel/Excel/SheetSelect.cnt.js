/* ====================================================================================================
NAME:			[Sheet Controller]
BEHAVIOR:		Actions and Event related to Import Excel Sheet Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/14/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ImportExcel.Excel.SheetSelect', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-ImportExcel-Report' }
    ],
    init: function () {

        this.control({
            'App-View-ImportExcel-Excel-SheetSelect': {
                afterrender: this.SheetSelectAfterRender
            },
            '[xtype="App-View-ImportExcel-Excel-SheetSelect"] #btnOkSS': {
                click: this.SheetSelectOkButton
            },
            '[xtype="App-View-ImportExcel-Excel-SheetSelect"] #btnCancelSS': {
                click: this.SheetSelectClose
            },
            '[xtype="App-View-ImportExcel-Excel-SheetSelect"] #cbxTabList': {
                render: this.TabBeforeLoad
            }

        });
    },
    SheetSelectAfterRender: function SheetSelectAfterRender(me) {
        me.down('#lblSheetFileName').setText(ImportExcelSCls.getFileName());
    },
    SheetSelectOkButton: function SheetSelectOkButton(me) {
        var winMain = this.getActiveCurrent();
        var winCurr = me.up('window');
        var pnlExcel, tabList, form;
        form = me.up('form').getForm();
        if (form.isValid()) {
            tabList = winCurr.down("#cbxTabList");
            ImportExcelSCls.setTabName(tabList.getValue());
            pnlExcel = winMain.down("#pnlExcel");
            pnlExcel.fireEvent('beforeshow', pnlExcel);
            me.up().up().close();
        } else {
            alert('Please select the appropriate sheet name.')
        }
    },
    SheetSelectClose: function SheetSelectClose(me) {
        me.up('window').close();
    },
    TabBeforeLoad: function TabBeforeLoad(store, operation, eOpts) {
        store.getProxy().extraParams = {
            Filename: ImportExcelSCls.getTargetPath()
        };
    }
});

