/* ====================================================================================================
NAME:			[Excel Controller]
BEHAVIOR:		Actions and Event related to Import Excel Validate Page.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/03/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ImportExcel.Validate.TBar', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Main', selector: 'App-View-Main-TabPanel' },
        { ref: 'Current', selector: 'App-View-ImportExcel-Report' }
    ],
    init: function () {
        this.control({
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnreImportValidate': {
                click: this.JumpToImportFromExcel
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnExcelExport': {
                click: this.JumpExcelExport
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnShowErrors': {
                click: this.ShowErrors
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnProcessToFlote': {
                click: this.ProcessToFlote
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnDeleteAllGrid': {
                click: this.DeleteAllGrid
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnUpdateCBOL': {
                click: this.UpdateCBOL
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnShowCBOLN': {
                click: this.ShowCBOLN
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnShowCBOLR': {
                click: this.ShowCBOLR
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnShowCHGCD': {
                click: this.ShowCHGCD
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnShowDUPS': {
                click: this.ShowDUPS
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnShowHBLN': {
                click: this.ShowHBLN
            },
            '[xtype="App-View-ImportExcel-Validate-TBar"] #btnShowHBLR': {
                click: this.ShowHBLR
            }
        });

    },

    JumpToImportFromExcel: function JumpToImportFromExcel() {
        var win = this.getActiveCurrent();
        win.down('#edtHeaderRow').setValue(1);
        win.down('#edtDataRowStart').setValue(2);
        win.getLayout().setActiveItem('cardExcelImport');
    },
    JumpToHome: function JumpToHome() {
        var win = this.getActiveCurrent();
        window.localStorage.clear();
        win.getLayout().setActiveItem('cardLanding');
    },
    JumpExcelExport: function JumpExcelExport() {

        var win = this.getActiveCurrent();
        var invoiceId = ImportExcelSCls.getInvoiceId();
        var grid = win.down('App-View-ImportExcel-Validate-Grid');
        var sorters = [];
        Ext.each(grid.store.sorters.items, function (item) { sorters.push(item.getState()) });
        var sort = ''
        if (sorters != null) {
            for (var i = 0; i < sorters.length; i++) {
                sort += sorters[i].property + '  ' + sorters[i].direction;
                if (sorters.length > 1 && sorters.length - 1 != i) {
                    sort = sort + ',';
                }
            }
        }


        var params = {
            InvoiceId: invoiceId,
            ExportType: 'ImportExcel',
            ShowError: true,
            ErrorType: '',
            UserId: PgAtt.getUserId(),
            PageName: 'LVBImport',
            SortParam: sort
        };


        var form = Ext.create('Ext.form.Panel', {
            standardSubmit: true,
            url: 'api/WebAPIReport/ValidateDataExcelExport',
            method: 'POST'
        });

        form.submit({
            target: '_blank',
            params: params
        });
    },
    ShowErrors: function ShowErrors(t) {
        var win = this.getActiveCurrent();
        win.fireEvent('SetShowErrors', t.pressed, '');
    },
    ShowCBOLN: function ShowCBOLN(t) {
        var win = this.getActiveCurrent();
        win.fireEvent('SetShowErrors', true, 'CBOLN');
    },
    ShowCBOLR: function ShowCBOLR(t) {
        var win = this.getActiveCurrent();
        win.fireEvent('SetShowErrors', true, 'CBOLR');
    },
    ShowCHGCD: function ShowCHGCD(t) {
        var win = this.getActiveCurrent();
        win.fireEvent('SetShowErrors', true, 'CHGCD');
    },
    ShowDUPS: function ShowDUPS(t) {
        var win = this.getActiveCurrent();
        win.fireEvent('SetShowErrors', true, 'DUPS');
    },
    ShowHBLR: function ShowHBL(t) {
        var win = this.getActiveCurrent();
        win.fireEvent('SetShowErrors', true, 'HBLR');
    },
    ShowHBLN: function ShowHBL(t) {
        var win = this.getActiveCurrent();
        win.fireEvent('SetShowErrors', true, 'HBLN');
    },
    ProcessToFlote: function ProcessToFlote(me) {
        var win = me.up('window');
        var tabPanel = this.getActiveMain()
        win.down('#cardValidate');
        PgAtt.setInvoice_id(ImportExcelSCls.getInvoiceId());
        PgAtt.setProcessBtn(true);
        win.close();
        Ext.ComponentQuery.query('#LogVendorBill')[0].close();
        tabPanel.down('#appCbolSumId').setDisabled(false);
        tabPanel.setActiveTab(8);
    },
    DeleteAllGrid: function DeleteAllGrid() {
        var win = this.getActiveCurrent();
        var Invoice_Id = ImportExcelSCls.getInvoiceId();
        var userId = PgAtt.getUserId();
        if (Invoice_Id != "") {
            Ext.Msg.confirm('Remove record', 'Are you sure?', function (button) {
                if (button === 'yes') {
                    var params = { Invoice_Id: Invoice_Id, User_Id: userId };
                    var grdValidate = win.down('#cardValidate');
                    grdValidate.body.mask("Deleting and loading data ....");
                    this.ajaxThread = BIA.Ajax.request({
                        url: 'api/WebAPIReport/DeleteAllByInvoiceID',
                        jsonData: params,
                        method: "POST",
                        async: false,
                        cache: false,
                        dataType: "html",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        useDefaultXhrHeader: true,
                        success: function (conn, response, options, eOpts) {
                            win.getLayout().setActiveItem('cardExcelImport');
                            grdValidate.body.unmask();
                        },
                        failure: function (response, options) {
                            grdValidate.unmask();
                            BIA.consoleLog('Delete operation has been Failed');
                        }
                    });

                }
            }, this);
        }
    },
    UpdateCBOL: function UpdateCBOL() {
        var win = this.getActiveCurrent();
        var Invoice_Id = ImportExcelSCls.getInvoiceId();
        if (Invoice_Id != "") {

            var grdValidate = win.down('#cardValidate');
            grdValidate.body.mask("Updating CBOL for match records....");
            this.ajaxThread = BIA.Ajax.request({
                url: 'api/WebAPIReport/UpdateCBOL',
                jsonData: { Invoice_Id: Invoice_Id },
                method: "POST",
                async: false,
                cache: false,
                dataType: "html",
                headers: {
                    "Content-Type": "application/json"
                },
                useDefaultXhrHeader: true,
                success: function (conn, response, options, eOpts) {
                    win.fireEvent('SetShowErrors', true, '');
                    grdValidate.body.unmask();
                },
                failure: function (response, options) {
                    grdValidate.unmask();
                    BIA.consoleLog('Update carrier BOL has been Failed');
                }
            });

        }
    }
});

