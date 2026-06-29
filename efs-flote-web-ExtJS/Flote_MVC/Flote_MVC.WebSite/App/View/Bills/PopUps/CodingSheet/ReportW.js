/* ====================================================================================================
NAME:			[Coding Sheet Window]
BEHAVIOR:		Shows Coding Sheet.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/20/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Reports.Bills.PopUps.CodingSheet.ReportW', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Bills-PopUps-CodingSheet-ReportW',
    itemId: 'codingSheetId',
    title: '<div style="font-weight: bold;color:white;">Coding Sheet Export</div>',
    width: '35%',
    rec: '',
    grid: '',
    RejectFlag: 'Y',
    modal: true,
    cls: 'UPS_Brown_4',
    defaults: {
        anchor: '100%',
        labelWidth: 100
    },
    loadValues: function (jsonObject) {
        this.getForm().setValues(jsonObject);
    },
    items: [
        {
            xtype: 'container', baseCls: 'UPS_Brown_4',
            items: [
                { xtype: 'App-View-Bills-PopUps-CodingSheet-ScanFolderDD', itemId: 'ScanFolderDD', margin: '10 5 5 10', width: '420px' },
                { xtype: 'App-View-Bills-PopUps-CodingSheet-CodingSheetDD', itemId: 'CodingSheetDD', margin: '5 5 5 10', width: '420px' },
                { xtype: 'label', itemId: 'rejectCommentPC', margin: '5 5 5 10', baseCls: 'UPS_Brown_4', hidden: true, style: 'color:red;font-weight:bold;align-left:10px; font-size:11px;' },
                {
                    xtype: 'checkbox', itemId: 'chkRejectPC', margin: '5 5 5 10', boxLabel: 'Remove invoice from rejected list', baseCls: 'UPS_Brown_4', hidden: true, listeners: {
                        change: function (checkbox, newVal, oldVal) {
                            var win = this.up('window');
                            var rec = win.rec;                            

                            var rejectedFlag = win.RejectFlag;
                            if (rejectedFlag == 'Y') {
                                var rejFlag = this.getValue() ? "Y" : "N";
                                this.fireEvent('chkRejectPC', rejFlag, rec.get('invoice_id'));
                                rec.set('RejectedRecall', rejFlag);
                            }
                            this.up('window').RejectFlag = "Y";
                        }
                    }
                },
                {
                    xtype: 'textareafield', itemId: 'cmtRejectScanPC', bodyPadding: 10, inputWidth: 300, width: 450, fieldLabel: 'Please enter comments for rejecting:',
                    style: 'margin-left:10px; margin-right:10px;',
                    labelStyle: 'font-weight:bold; font-size:12px;',
                    fieldStyle: 'text-align: left;',
                    allowBlank: false,
                    hidden: true
                },
                { xtype: 'displayfield', itemId: "AP_Vendor_id", fieldLabel: 'Supplier Number:', labelStyle: 'color:black;font-weight:bold; font-size:11px; ', margin: '5 5 5 10' },
                { xtype: 'displayfield', itemId: "ap_remit_id", fieldLabel: 'Supplier SiteCode:', labelStyle: 'color:black;font-weight:bold; font-size:11px;', margin: '5 5 5 10' },
                { xtype: 'displayfield', itemId: "vendor_code", fieldLabel: 'Flote VendorCode:', labelStyle: 'color:black;font-weight:bold; font-size:11px;', margin: '5 5 5 10' },
                { xtype: 'displayfield', itemId: "pay_group_popup", fieldLabel: 'Pay Group:', labelStyle: 'color:black;font-weight:bold; font-size:11px;', margin: '5 5 5 10' },

            ]
        }, {
            xtype: 'container', baseCls: ' UPS_Brown_4', layout: 'hbox',            
            defaults: { margins: '5 5 5 5', region: 'center' },
            items: [
                { xtype: 'tbfill' },
                {
                    xtype: 'button',
                    itemId: 'btnExportToPdf',
                    text: '<div style="font-weight: bold;color:white;">Export To PDF</div>',
                    style: 'margin-left:5px; margin-top:5px; margin-bottom:10px;',
                    cls: 'btn fa-lg'
                },
                {
                    xtype: 'button',
                    itemId: 'btnCodingSheetExport',
                    text: '<div style="font-weight: bold;color:white;">Export To Excel</div>',
                    style: 'margin-left:5px; margin-top:5px; margin-bottom:10px;',
                    cls: 'btn fa-lg'
                },
                {
                    xtype: 'button',
                    itemId: 'btnRejectScanPC',
                    text: '<div style="font-weight: bold;color:white;">Reject Scan</div>',
                    style: 'margin-left:5px; margin-top:5px; margin-bottom:10px;',
                    cls: 'btn fa-lg',
                    hidden: true,
                    listeners: {
                        click: function () {
                            var me = this;
                            me.fireEvent('btnRejectScanPC', this);
                        }
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'btnCancel',
                    text: '<div style="font-weight: bold;color:white;">Cancel</div>',
                    style: 'margin-left:5px; margin-top:5px; margin-bottom:10px;',
                    cls: 'btn fa-lg'

                },
                { xtype: 'tbfill' }
            ]
        }, {
            xtype: 'container',
            itemId: 'SiteCodeWarningContCS',
            layout: 'hbox',
            border: 0,
            defaults: { margins: '5 5 5 5', region: 'center' },
            baseCls: 'UPS_Brown_4',
            items:
                [
                    { xtype: 'tbfill' },
                    {
                        xtype: 'displayfield', fieldLabel: '', centered: true, itemId: 'siteCodeWarning', value: '<BR>&nbsp;  STOP – Is Correct Scan Folder Selected? &nbsp; <BR> &nbsp;  Is Correct Coding Sheet Export Selected? &nbsp; <BR> &nbsp;  Otherwise Payment will be Held or Delayed  &nbsp; <BR> &nbsp;',
                        border: 4, bodyAlign: 'center', margin: '10 10 10 10', style: 'background-color:yellow;borderColor: black; borderStyle: solid; text-align: center; ', fieldStyle: 'text-align: center;color:black;font-weight:bold; font-size:14px; padding:5 5 5 5;'
                    }, { xtype: 'tbfill' }]
        }

    ]


});
