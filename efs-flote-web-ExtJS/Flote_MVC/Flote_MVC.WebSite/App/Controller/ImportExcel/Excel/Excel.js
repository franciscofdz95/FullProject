/* ====================================================================================================
NAME:			[Excel Controller]
BEHAVIOR:		Actions and Event related to Import Excel Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/03/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ImportExcel.Excel', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-ImportExcel-Report' }

    ],
    headerRowChanged: function (t, n) {
        var edtDataRowStart, g;
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
        edtDataRowStart = Ext.ComponentQuery.query('#edtDataRowStart')[0];
        if (edtDataRowStart.getValue() <= n) {
            edtDataRowStart.setValue(n + 1);
            this.dataRowChanged(null, n + 1);
        }

    },
    dataRowChanged: function (t, n) {
        $(".ExcelDataStartRow").removeClass('ExcelDataStartRow');
        if (n !== null) {
            $('#trExcelRow_' + n).addClass('ExcelDataStartRow');
        }
    },
    jumpToHome: function (me) {
        var win = me.up('window');
        win.close();
    },
    uploadFile: function () {
        var win = Ext.create('ImportExcel.view.module.FileUpload');
        win.show();
    },
    invoiceExists: false,
    invoiceExistsUser: '',
    invoiceChanged: function (t) {
        var me = t.up('window');
        var invoiceId = t.getValue();
        if (invoiceId != '') {
            Ext.Ajax.defaultHeaders = { "Content-Type": "application/json; charset=utf-8" };
            Ext.Ajax.request({
                url: 'api/WebAPIReport/WorkbookByInvoiceId',
                method: "POST",
                async: false,
                cache: false,
                dataType: "html",
                headers: {
                    "Content-Type": "application/json"
                },
                params: Ext.encode({
                    Invoice_Id: invoiceId
                }),
                useDefaultXhrHeader: true,
                success: function (conn, response, options, eOpts) {
                    var edtPQRWarning, data, btnDeleteAll;
                    data = Ext.decode(conn.responseText);
                    edtPQRWarning = me.down('#edtPQRWarning');
                    btnDeleteAll = me.down('#btnDeleteAll');
                    if (data.INVOICE_ID !== -1) {
                        t.invoiceExists = true;
                        t.invoiceExistsUser = data.userId;
                        edtPQRWarning.setVisible(true);
                        btnDeleteAll.setVisible(true);
                        edtPQRWarning.setText('Invoice Id already exists');
                    } else {
                        t.invoiceExists = false;
                        t.invoiceExistsUser = '';
                        edtPQRWarning.setVisible(false);
                        btnDeleteAll.setVisible(false);
                        edtPQRWarning.setText('Invoice Id already exists');
                    }
                },
                failure: function (conn, response, options, eOpts) {
                    BIACore.Exception(conn.responseText);
                    BIACore.Message(response);
                },
                scope: t
            });
        }

    },
    commitFile: function commitFile(button) {
        var i, map, pnlExcel, columnMap, data;
        pnlExcel = Ext.ComponentQuery.query('#pnlExcel')[0];

        columnMap = [];
        for (i = 1; i <= pnlExcel.columnCount; i++) {
            if (Ext.ComponentQuery.query('#cbx' + i)[0].getValue() !== undefined && Ext.ComponentQuery.query('#cbx' + i)[0].getValue() !== null) {
                map = { ColumnNumber: i, ColumnName: Ext.ComponentQuery.query('#cbx' + i)[0].getValue() };
                columnMap.push(map);
            }
        }
        if (Ext.ComponentQuery.query('#edtHeaderRow')[0].getValue() >= Ext.ComponentQuery.query('#edtDataRowStart')[0].getValue()) {
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
            ImportExcelSCls.setInvoiceId(Ext.ComponentQuery.query('#edtIdentifier')[0].getValue());
            Ext.Ajax.request({
                url: 'api/WebAPIReport/ExcelCommit',
                method: "POST",
                async: false,
                cache: false,
                dataType: "html",
                headers: {
                    "Content-Type": "application/json"
                },
                params: Ext.encode({
                    FileName: ImportExcelSCls.getTargetPath(),
                    TabName: ImportExcelSCls.getTabName(),
                    HeaderRow: Ext.ComponentQuery.query("#edtHeaderRow")[0].getValue(),
                    DataRowStart: Ext.ComponentQuery.query("#edtDataRowStart")[0].getValue(),
                    DataRowEnd: Ext.ComponentQuery.query("#edtDataRowEnd")[0].getValue(),
                    ColumnMap: columnMap,
                    Invoice_Id: ImportExcelSCls.getInvoiceId(),
                    UserId: PgAtt.getUserId()
                }),
                useDefaultXhrHeader: true,
                success: function (conn, response, options, eOpts) {
                    data = Ext.decode(conn.responseText);
                    Ext.ComponentQuery.query('#btnCommitExcelImport')[0].disable();
                    if (!data.success) {
                        Ext.MessageBox.show({
                            title: 'Error:',
                            msg: data.message,
                            buttons: Ext.MessageBox.OK
                        });
                    }
                    else {
                        Ext.getStore('stoValidate').loadWithParameters(ViewParameters.Invoice_Id, true, "", ViewParameters.UserId);
                        Ext.getStore('stoValidate').on('load', function () {

                            if (this.getCount() > 0) {
                                var rec = this.getAt(0);
                                if (rec.get('ErrorCount') === 0 && rec.get('WarningCount') === 0 && rec.get('ActionCount') === 0 && rec.get('TotalCount') > 0) {
                                    Ext.ComponentQuery.query('#cardValidate')[0].setTitle('Vendor Statement Review: ' + 'Invoice ID ' + rec.get('INVOICE_ID') + ' - Validation -  Total Count: ' + rec.get('TotalCount') + ' | Warning Count: ' + rec.get('WarningCount') + ' | Duplicate Records: ' + rec.get('ActionCount') + ' | Error Count: ' + rec.get('ErrorCount'));
                                    Ext.ComponentQuery.query('#pnlMainDeck')[0].getLayout().setActiveItem('#cardValidate');
                                    Ext.ComponentQuery.query('#btnProcessToFlote')[0].setVisible(true);
                                }
                                else {
                                    Ext.ComponentQuery.query('#cardValidate')[0].setTitle('Vendor Statement Review: ' + 'Invoice ID ' + rec.get('INVOICE_ID') + ' - Validation -  Total Count: ' + rec.get('TotalCount') + ' | Warning Count: ' + rec.get('WarningCount') + ' | Duplicate Records: ' + rec.get('ActionCount') + ' | Error Count: ' + rec.get('ErrorCount'));
                                    Ext.ComponentQuery.query('#pnlMainDeck')[0].getLayout().setActiveItem('cardValidate');
                                    Ext.ComponentQuery.query('#btnProcessToFlote')[0].setVisible(false);
                                    Ext.ComponentQuery.query('#lblName')[0].setVisible(false);

                                }
                                pnlExcel.updateTemplate('<div style="margin:15px;font-size:2em;">Please press Import Vendor Template button and upload an .xls file</div>');
                            }
                            else {
                                pnlExcel.updateTemplate('<div style="margin:15px;font-size:2em;">Please press Import Vendor Template button and upload an .xls file</div>');
                            }

                        });

                    }
                },
                failure: function (response) {
                    data = Ext.decode(response.responseText);
                    Ext.ComponentQuery.query('#btnCommitExcelImport')[0].disable();
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
    deleteAll: function () {
        var Invoice_Id = ImportExcelSCls.getInvoiceId();
        if (Invoice_Id != "") {
            Ext.Msg.confirm('Remove record', 'Are you sure?', function (button) {
                if (button === 'yes') {
                    this.ajaxThread = Ext.Ajax.request({
                        url: 'api/WebAPIReport/DeleteAllByInvoiceID',
                        params: Ext.encode({ Invoice_Id: Invoice_Id }),
                        method: 'POST',
                        scope: this,
                        headers: { 'Content-Type': 'application/json;charset=utf-8' },
                        success: function (response, options) {
                            var edtPQRWarning, btnDeleteAll;
                            edtPQRWarning = Ext.ComponentQuery.query('#edtPQRWarning')[0];
                            btnDeleteAll = Ext.ComponentQuery.query('#btnDeleteAll')[0];
                            edtPQRWarning.setVisible(false);
                            btnDeleteAll.setVisible(false);
                            Ext.Msg.alert('Record has been deleted for Invoice Id (' + Invoice_Id + ')');
                        },
                        failure: function (response, options) {
                            grdValidate.unmask();
                            BIA.consoleLog('Delete operation has been Failed');
                        }
                    });

                }
            }, this);

        }
    }

});

