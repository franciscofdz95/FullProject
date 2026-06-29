/* ====================================================================================================
NAME:			[Configure Controller]
BEHAVIOR:		Actions and Event related to Import Excel configuration Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/09/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ImportExcel.Excel.Configure', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-ImportExcel-Report' }

    ],
    init: function () {

        this.control({
            'App-View-ImportExcel-Excel-Configure': {
                afterrender: this.ConfigureAfterRender
            },
            '[xtype="App-View-ImportExcel-Excel-Configure"] #btnImportTemplate': {
                click: this.ImportTemplate
            },
            '[xtype="App-View-ImportExcel-Excel-Configure"] #btnCommitExcelImport': {
                click: this.CommitFile
            },
            '[xtype="App-View-ImportExcel-Excel-Configure"] #btnCancelExcelImport': {
                click: this.JumpToHome
            },
            '[xtype="App-View-ImportExcel-Excel-Configure"] #edtHeaderRow': {
                change: this.HeaderRowChanged
            },
            '[xtype="App-View-ImportExcel-Excel-Configure"] #edtDataRowStart': {
                change: this.DataRowChanged
            },
            '[xtype="App-View-ImportExcel-Excel-Configure"] #edtIdentifier': {
                change: this.InvoiceChanged
            },
            '[xtype="App-View-ImportExcel-Excel-Configure"] #btnDeleteAll': {
                click: this.DeleteAll
            }

        });
    },
    ConfigureAfterRender: function ConfigureAfterRender(me) {
        var win = me.up('window');
        var invId = ImportExcelSCls.getInvoiceId();
        if (invId != '' && invId != null) {
            me.down("#edtIdentifier").setValue(invId);
            var invoiceId = invId;
            if (invoiceId != '') {
                var params = {
                    Invoice_Id: invoiceId
                };
                Ext.Ajax.defaultHeaders = { "Content-Type": "application/json; charset=utf-8" };
                BIA.Ajax.request({
                    url: 'api/WebAPIReport/WorkbookByInvoiceId',
                    method: "POST",
                    async: false,
                    cache: false,
                    dataType: "html",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    jsonData: params,
                    useDefaultXhrHeader: true,
                    success: function (conn, response, options, eOpts) {
                        var edtPQRWarning, data, btnDeleteAll;

                        data = Ext.decode(conn.responseText);
                        edtPQRWarning = me.down('#edtPQRWarning');
                        btnDeleteAll = me.down('#btnDeleteAll');
                        if (data.INVOICE_ID !== -1) {
                            this.invoiceExists = true;
                            this.invoiceExistsUser = data.userId;
                            edtPQRWarning.setVisible(true);
                            btnDeleteAll.setVisible(true);
                            win.fireEvent('SetShowErrors', true, '');

                        } else {
                            this.invoiceExists = false;
                            this.invoiceExistsUser = '';
                            edtPQRWarning.setVisible(false);
                            btnDeleteAll.setVisible(false);
                        }
                    },
                    scope: this
                });
            }
        }

    },
    HeaderRowChanged: function HeaderRowChanged(t, n) {
        var edtDataRowStart, g;
        var win = t.up('window');
        //Dynamically hide/show the rows
        if (n !== null) {
            //finding the elements which were hide earlier using the className 
            //and making them visible 
            $(".ExcelRow_Hidden").show();
            $(".ExcelHeader").removeClass('ExcelHeader');
            for (g = 1; g < n; g++) {
                $('#trExcelRow_' + g).hide().addClass('ExcelRow_Hidden');
            }
            $('#trExcelRow_' + n).addClass('ExcelHeader');
        }
        edtDataRowStart = win.down('#edtDataRowStart');
        if (edtDataRowStart.getValue() <= n) {
            edtDataRowStart.setValue(n + 1);
            this.DataRowChanged(null, n + 1);
        }
    },
    DataRowChanged: function DataRowChanged(t, n) {
        $(".ExcelDataStartRow").removeClass('ExcelDataStartRow');
        if (n !== null) {
            $('#trExcelRow_' + n).addClass('ExcelDataStartRow');
        }
    },
    JumpToHome: function JumpToHome(me) {
        me.up('window').close();
    },
    ImportTemplate: function ImportTemplate() {
        var win = Ext.widget('App-View-ImportExcel-Excel-FileUpload');
        win.show();
    },
    invoiceExists: false,
    invoiceExistsUser: '',
    InvoiceChanged: function InvoiceChanged(t) {
        var win = this.getActiveCurrent();
        var Invoice_Id = t.getValue();
        if (Invoice_Id != '') {
            var params = {
                Invoice_Id: Invoice_Id
            };
            Ext.Ajax.defaultHeaders = { "Content-Type": "application/json; charset=utf-8" };
            BIA.Ajax.request({
                url: 'api/WebAPIReport/WorkbookByInvoiceId',
                method: "POST",
                async: false,
                cache: false,
                dataType: "html",
                headers: {
                    "Content-Type": "application/json"
                },
                jsonData: params,
                useDefaultXhrHeader: true,
                success: function (response, options, eOpts) {
                    var edtPQRWarning, data, btnDeleteAll;
                    data = Ext.decode(response.responseText);
                    edtPQRWarning = win.down('#edtPQRWarning');
                    btnDeleteAll = win.down('#btnDeleteAll');
                    if (data.INVOICE_ID !== -1) {
                        this.invoiceExists = true;
                        this.invoiceExistsUser = data.userId;
                        ImportExcelSCls.setInvoiceId(Invoice_Id);
                        edtPQRWarning.setVisible(true);
                        btnDeleteAll.setVisible(true);
                    } else {
                        this.invoiceExists = false;
                        this.invoiceExistsUser = '';
                        edtPQRWarning.setVisible(false);
                        btnDeleteAll.setVisible(false);
                    }
                },
                scope: this
            });
        }

    },
    CommitFile: function CommitFile(button) {
        var win = this.getActiveCurrent();
        var i, map, pnlExcel, columnMap, data;// edtHeaderRow, edtDataRowStart, edtDataRowEnd;
        pnlExcel = win.down('#pnlExcel');

        columnMap = [];
        for (i = 1; i <= pnlExcel.columnCount; i++) {
            if (Ext.ComponentQuery.query('#cbx' + i)[0].getValue() !== undefined && Ext.ComponentQuery.query('#cbx' + i)[0].getValue() !== null) {
                map = { ColumnNumber: i, ColumnName: Ext.ComponentQuery.query('#cbx' + i)[0].getValue() };
                columnMap.push(map);
            }
        }
        if (win.down('#edtHeaderRow').getValue() >= win.down('#edtDataRowStart').getValue()) {
            Ext.MessageBox.alert('', 'Cannot have the "Data Row Start" less than the "Header Row"');
            return;
        }

        var CarrierBolExists = 'Carrier Bol';
        var ChargeDescExists = 'Charge Description';
        var ContainerTypeExists = 'Container Type';
        var VerifiedAmtExists = 'Verified Amount';

        for (var p = 0; p < columnMap.length; p++) {
            if (columnMap[p].ColumnName === 'CARRIER_BOL') {
                CarrierBolExists = '';
            }
            if (columnMap[p].ColumnName === 'CHARGE_DESCRIPTION') {
                ChargeDescExists = '';
            }

            if (columnMap[p].ColumnName === 'CONTAINER_TYPE') {
                ContainerTypeExists = '';
            }
            if (columnMap[p].ColumnName === 'VERIFIED_AMOUNT') {
                VerifiedAmtExists = '';
            }
        }
        if (CarrierBolExists !== '' || ChargeDescExists !== '' || ContainerTypeExists !== '' || VerifiedAmtExists !== '') {
            var strCol = '';
            if (CarrierBolExists !== '') { strCol = strCol + CarrierBolExists; }
            if (ChargeDescExists !== '' && strCol !== '') { strCol = strCol + ',' + ChargeDescExists; }
            else { if (ChargeDescExists !== '') { strCol = strCol + ChargeDescExists; } }
            if (ContainerTypeExists !== '' && strCol !== '') { strCol = strCol + ',' + ContainerTypeExists; }
            else { if (ContainerTypeExists !== '') { strCol = strCol + ContainerTypeExists; } }
            if (VerifiedAmtExists !== '' && strCol !== '') { strCol = strCol + ',' + VerifiedAmtExists; }
            else { if (VerifiedAmtExists !== '') { strCol = strCol + VerifiedAmtExists; } }
            strCol = strCol + '  columns are required to commit the file.';
            Ext.MessageBox.alert('', strCol);
            return;
        }

        var me = button.up('form').getForm();
        if (me.isValid()) {
            win.body.mask('Loading and Validating Data.....');
            ImportExcelSCls.setInvoiceId(win.down('#edtIdentifier').getValue());
            var params = {
                FileName: ImportExcelSCls.getTargetPath(),
                TabName: ImportExcelSCls.getTabName(),
                HeaderRow: win.down("#edtHeaderRow").getValue(),
                DataRowStart: win.down("#edtDataRowStart").getValue(),
                DataRowEnd: win.down("#edtDataRowEnd").getValue(),
                ColumnMap: columnMap,
                Invoice_Id: ImportExcelSCls.getInvoiceId(),
                UserId: PgAtt.getUserId()
            };
            BIA.Ajax.request({
                url: 'api/WebAPIReport/ExcelCommit',
                method: "POST",
                async: false,
                cache: false,
                dataType: "html",
                headers: {
                    "Content-Type": "application/json"
                },
                jsonData: params,
                useDefaultXhrHeader: true,
                success: function (conn, response, options, eOpts) {
                    data = Ext.decode(conn.responseText);
                    var sheet = win.down('App-View-ImportExcel-Excel-Sheet');
                    sheet.fireEvent('DeleteComboBoxes', sheet);
                    win.down('#btnCommitExcelImport').disable();
                    if (!data.success) {
                        Ext.MessageBox.show({
                            title: 'Error:',
                            msg: data.message,
                            buttons: Ext.MessageBox.OK
                        });
                    }
                    else {
                        win.fireEvent('SetShowErrors', true, '');
                    }
                    win.body.unmask();
                },
                failure: function (response) {
                    data = Ext.decode(response.responseText);
                    win.down('#btnCommitExcelImport').disable();
                    win.body.unmask();
                    if (!data.success) {
                        Ext.MessageBox.show({
                            title: 'Error:',
                            msg: data.message,
                            buttons: Ext.MessageBox.OK
                        });
                    }
                },
                scope: this
            });
        }
    },
    DeleteAll: function DeleteAll() {
        var win = this.getActiveCurrent();
        var Invoice_Id = ImportExcelSCls.getInvoiceId();
        if (Invoice_Id != "") {
            Ext.Msg.confirm('Remove record', 'Are you sure?', function (button) {
                if (button === 'yes') {
                    var params = { Invoice_Id: Invoice_Id };
                    this.ajaxThread = BIA.Ajax.request({
                        url: 'api/Validate/DeleteAllByInvoiceID',
                        jsonData: params,
                        method: 'POST',
                        scope: this,
                        headers: { 'Content-Type': 'application/json;charset=utf-8' },
                        success: function (response, options) {
                            var edtPQRWarning, btnDeleteAll;
                            edtPQRWarning = win.down('#edtPQRWarning');
                            btnDeleteAll = win.down('#btnDeleteAll');
                            edtPQRWarning.setVisible(false);
                            btnDeleteAll.setVisible(false);
                            Ext.Msg.alert('Record has been deleted for Invoice Id (' + Invoice_Id + ')');
                        },
                        failure: function (response, options) {
                            BIA.consoleLog('Delete operation has been Failed');
                        }
                    });

                }
            }, this);

        }
    }

});

