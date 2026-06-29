/* ====================================================================================================
NAME:			[Excel Controller]
BEHAVIOR:		Actions and Event related to Import Excel Validate Page.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/17/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ImportExcel.Validate', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-ImportExcel-Report' }
    ],
    init: function () {
        this.control({
            '[xtype="App-View-ImportExcel-Validate-Grid"]': {
                render: this.ValidateGridRender,
                edit: this.EditValidateGrid,
                canceledit: this.CancelEditValidateGrid

            },
            '[xtype="actioncolumn"] ': {
                actionColDeleteRow: this.DeleteRowRecord
            }

        });

    },
    ValidateGridRender: function ValidateGridRender(me) {
        if (me) {
            me.store.addListener({
                load: {
                    fn: this.ShowValidateGrid,
                    scope: this,
                    args: [me]
                }
            })
        }
    },
    ShowValidateGrid: function ShowValidateGrid(me) {
        var win = me.up('window');
        var store = me.getStore();
        if (store != null && store != undefined) {
            var rec = store.data.items[0];
            if (rec != undefined && rec != null) {
                if (rec.get('ErrorCount') === 0 && rec.get('WarningCount') === 0 && rec.get('ActionCount') === 0 && rec.get('TotalCount') > 0) {
                    win.down('#btnProcessToFlote').setVisible(true);
                    win.down("#lblErrorMsg").setVisible(true);
                    win.down("#lblName").setVisible(true);
                    win.down("#lblErrorMsg").setText("Total " + rec.get('TotalCount') + " Records have been validated successfully.");
                }
                me.setTitle('<span style="font-weight:bold;color: #FFFFFF;">Vendor Statement Review: ' + 'Invoice ID ' + rec.get('INVOICE_ID') + ' - Validation -  Total Count: ' + rec.get('TotalCount') + ' | Warning Count: ' + rec.get('WarningCount') + ' | Duplicate Records: ' + rec.get('ActionCount') + ' | Error Count: ' + rec.get('ErrorCount') + '</span>');
            } else {
                me.setTitle('<span style="font-weight:bold;color: #FFFFFF;">Vendor Statement Review : </span>');
                win.down('#btnProcessToFlote').setVisible(false);
                win.down("#lblErrorMsg").setVisible(false);
                win.down("#lblName").setVisible(false);
                win.down("#lblErrorMsg").setText("");
            }
        }
        win.getLayout().setActiveItem('cardValidate');

    },
    EditValidateGrid: function EditValidateGrid(editor, context, eOpts) {
        if (context.record != null && context.record != undefined) {
            context.store.sync({
                success: function (rec, operation) {
                    context.record.dirty = false;
                    editor.view.refresh();
                },
                failure: function (rec, operation) {
                    BIACore.Exception(context.record);
                    BIACore.Message(context.record)
                    context.store.rejectChanges();

                }
            });

        }
    },
    CancelEditValidateGrid: function CancelEditValidateGrid(editor, context, eOpts) {
        context.store.rejectChanges();
    },
    DeleteRowRecord: function DeleteRowRecord(me, rec) {
        if (rec.get("ROW_ID") != "") {
            var win = this.getActiveCurrent(), msg = '';
            if (rec.get('CARRIER_BOL') != '') {
                var shptNo = this.IsChargesDeleted(rec);
                msg = 'Remove the charge related to Carrier Bol (' + rec.get('CARRIER_BOL') + ') , Charge Code (' + rec.get('CHARGE_CODE') + ') & Invoice Id (' + rec.get('INVOICE_ID') + '), Are you sure?';
                if (shptNo != undefined && shptNo != null) {
                    var shipLen = shptNo.split(',').length;
                    if (shipLen > 1) {
                        if (shipLen > 8) {
                            var shipSplit = shptNo.split(',');
                            shptNo = '';
                            for (var i = 0; i < shipLen; i++) {
                                shptNo = shptNo + ',' + shipSplit[i];
                                if (i % 7 == 0 && i != 0) {
                                    shptNo = shptNo + '</BR>'
                                }
                            }
                        }
                        msg = 'Remove these (' + shipLen + ') shipments charges (' + shptNo + ') related to Carrier Bol (' + rec.get('CARRIER_BOL') + ') , Charge Code (' + rec.get('CHARGE_CODE') + ') & Invoice Id (' + rec.get('INVOICE_ID') + '), Are you sure?';
                    }
                    else {
                        msg = 'Remove this shipment charge (' + shptNo + ') related to Carrier Bol (' + rec.get('CARRIER_BOL') + ') , Charge Code (' + rec.get('CHARGE_CODE') + ') & Invoice Id (' + rec.get('INVOICE_ID') + '), Are you sure?';
                    }
                }
            }
            else {
                msg = 'Remove the charge related to Hbl (' + rec.get('HBL') + ') , Charge Code (' + rec.get('CHARGE_CODE') + ') & Invoice Id (' + rec.get('INVOICE_ID') + '), Are you sure?';
            }

            Ext.Msg.confirm('Remove selected charges', msg, function (button) {
                if (button === 'yes') {
                    var params = {
                        InvoiceId: rec.get('INVOICE_ID'),
                        RowId: rec.get('ROW_ID'),
                        ChargeCode: rec.get('CHARGE_CODE'),
                        CarrierCBOL: rec.get('CARRIER_BOL'),
                        UserId: PgAtt.getUserId(),
                        hbl: rec.get('HBL')
                    };
                    var grdValidate = me.up('#cardValidate');
                    grdValidate.body.mask("Deleting selected record and loading data ....")
                    BIA.Ajax.request({
                        url: 'api/WebAPIReport/DeleteDataFromImport',
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
                            var showErrors = false;
                            if (Ext.isDefined(win.down('#btnShowErrors'))) {
                                showErrors = win.down('#btnShowErrors').pressed;
                            }
                            win.fireEvent('SetShowErrors', showErrors, '');
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
    IsChargesDeleted: function IsChargesDeleted(rec) {
        var params = {
            InvoiceId: rec.get('INVOICE_ID'),
            ChargeCode: rec.get('CHARGE_CODE'),
            CarrierCBOL: rec.get('CARRIER_BOL'),
            UserId: PgAtt.getUserId()
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/IsChargesDeleted',
            jsonData: params,
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            useDefaultXhrHeader: true,
            failure: function (response, options) {
                BIA.consoleLog('Delete operation has been Failed');
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            }
        });

        if (result != '' && result != null) {
            if (result != null && result.length > 0) { return result[0].shipmentList }
        }
        else {
            return '';
        }

    }
});

