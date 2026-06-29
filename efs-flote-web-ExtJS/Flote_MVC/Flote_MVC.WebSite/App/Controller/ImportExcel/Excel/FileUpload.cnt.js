/* ====================================================================================================
NAME:			[FileUpload Controller]
BEHAVIOR:		Actions and Event related to Import Excel File Upload Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/14/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ImportExcel.Excel.FileUpload', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-ImportExcel-Report' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' },
        { ref: 'LogVendorBill', selector: 'App-View-LogVendor-LogVendorBill' },
        { ref: 'BillsTabPanel', selector: 'App-View-Bills-TabPanel' }

    ],
    init: function () {

        this.control({
            '[xtype="App-View-ImportExcel-Excel-FileUpload"] #fileFieldId': {
                validitychange: this.FileFieldValidation
            },
            '[xtype="App-View-ImportExcel-Excel-FileUpload"] #btnUpload': {
                click: this.FileUpload
            },
            '[xtype="App-View-ImportExcel-Excel-FileUpload"] #btnCancelFileUpload': {
                click: this.CancelFileUpload
            },
            'App-View-ImportExcel-Report': {
                close: this.OnFileUploadClose
            }

        });
    },
    FileFieldValidation: function FileFieldValidation(me) {
        var indexofPeriod = me.getValue().lastIndexOf("."),
            uploadedExtension = me.getValue().substr(indexofPeriod + 1, me.getValue().length - indexofPeriod);
        if (!Ext.Array.contains(me.accept, uploadedExtension) && uploadedExtension !== "") {
            me.setActiveError('Please upload files with an extension of :  ' + me.accept.join() + ' only!');
            // Let the user know why the field is red and blank!
            Ext.MessageBox.show({
                title: 'File Type Error',
                msg: 'Please upload files with an extension of :  ' + me.accept.join() + ' only!',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
            // Set the raw value to null so that the extjs form submit            
            me.setRawValue(null);
        }
    },
    FileUpload: function FileUpload(me) {
        var form;
        form = me.up('form').getForm();
        if (form.isValid()) {
            form.submit({
                url: 'Upload.aspx',
                waitMsg: 'Uploading your file...',
                success: function (fp, o) {
                    var winSheetSelect;
                    if (o.result != null && o.result.message == '') {
                        ImportExcelSCls.setFileName(o.result.filename)
                        ImportExcelSCls.setTargetPath(o.result.loadname);
                        winSheetSelect = Ext.widget('App-View-ImportExcel-Excel-SheetSelect');
                        winSheetSelect.show();
                        me.up('window').close();
                    }
                    else {
                        Ext.Msg.alert('Invalid File Format, Failed to upload the file!');
                    }

                },
                failure: function (fp, o) {
                    Ext.Msg.alert(o.result.message + ': Failed to upload the file!');
                }
            });
        } else {
            alert('Please select the appropriate file to upload.');
        }
    },
    CancelFileUpload: function CancelFileUpload(me) {
        me.up('window').close();
    },
    OnFileUploadClose: function OnFileUploadClose(me) {
        var tabPanel = this.getBillsTabPanel(),
            logVenderWin = this.getLogVendorBill();
        ImportExcelSCls.setInvoiceId('');
        if (logVenderWin && !PgAtt.getProcessBtn()) {
            PgAtt.setProcessBtn(false);
            logVenderWin.close();
            tabPanel.setActiveTab(0);
        }
    }

});

