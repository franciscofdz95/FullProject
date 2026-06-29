/* ====================================================================================================
NAME:			[File Uploader Configuration]
BEHAVIOR:		Import excel file upload.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/07/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.ImportExcel.Excel.FileUpload', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-ImportExcel-Excel-FileUpload',
    title: '<span style="font-weight:bold; color:white;font-size:12px;">Upload Excel File</span>',
    height: 125,
    bodyPadding: 10,
    autoShow: true,
    Customer: '',
    modal: true,
    bodyStyle: 'background-color:white',
    items: [
            {
                xtype: 'form',
                bodyStyle: {
                    background: 'none',
                    border: '0'
                },
                layout: {
                    type: 'table',
                    columns: 2
                },
                items: [{
                    xtype: 'label',
                    text: 'File:',
                    margin: '4 5 5 5'
                }, {
                    xtype: 'filefield',
                    name: 'file',
                    itemId: 'fileFieldId',
                    width: 400,
                    msgTarget: 'side',
                    allowBlank: false,
                    buttonText: 'Select Excel file',
                    accept: ['xls', 'xlsx']
                   
                }, {
                    xtype: 'button',
                    text: 'Upload',
                    itemId: 'btnUpload',
                    width: 70,
                    margin: '4 5 5 10'
                 
                }, {
                    xtype: 'button',
                    itemId: 'btnCancelFileUpload',
                    name: 'btnCancel',
                    text: 'Cancel',
                    width: 70,
                    margin: '4 5 5 10'
                }]
            }
    ]
});