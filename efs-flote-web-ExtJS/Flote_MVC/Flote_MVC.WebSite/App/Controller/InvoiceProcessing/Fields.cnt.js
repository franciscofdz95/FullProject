/* ====================================================================================================
NAME:			[Invoice Processing Fields Controller ]
BEHAVIOR:		Performs Action and  data for Invoice Processing Fields action event.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/01/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/


Ext.define('App.Controller.IvvoiceProcessing.Fields', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }

    ],
    init: function () {
        var me = this;

        me.control({
            '[xtype="App-View-InvoiceProcessing-Fields"] #btnVerifyButtonLV': {
                click: me.VerifyInvoice
            },
            '[xtype="App-View-InvoiceProcessing-Fields"] #btnCloseButtonLV': {
                click: me.CloseWindow
            }

        });

    },
    // Get Bills Details Reports cell click event.


    VerifyInvoice: function VerifyInvoice(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var tabPanel = me.up('#tabPanelId');
        var data = IProcessingSCls.getInvoiceChargesDetails(IProcessingSCls.getInvoice_id());
        var canApprove = BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete;
        var e2kUserId = BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_E2K_UserID;
        var result = '';
        if (data.Total_Variance == 0 && data.Charges_Variance == 0 && data.VAT_Variance == 0 && data.TWH_Variance == 0) {
            var count = IProcessingSCls.getInvoiceChargeCountByVatId();
            var e2kCarrierCode = tabPanel.down('#e2kCarCodeIdBP').getValue();
            if (count.TotVatCount == 0) {
                var scacCodes = IProcessingSCls.getSCACCode();
                var scacCodeVals = '';
                for (var i = 0; i < scacCodes.length; i++) {
                    scacCodeVals = scacCodeVals + scacCodes[i]['vendor_code'];
                }
                if (scacCodes.length != 0) {
                    if (scacCodes.length == 1 && e2kCarrierCode == scacCodes[0]['vendor_code']) {
                        result = IProcessingSCls.verifyInvoice('Verified', canApprove, e2kUserId);
                        if (result) {
                            IProcessingSCls.resetFilterPopFilter(filter);
                            tabPanel.down('#InvoiceProcessingId').setDisabled(true);
                            if (IProcessingSCls.getPageType() == 'Bills' || IProcessingSCls.getPageType() == 'LVB') {
                                tabPanel.setActiveTab(3);
                            } else {
                                tabPanel.down('#appCbolSumId').setDisabled(false);
                                tabPanel.setActiveTab(8);
                            }
                            filter.fireEvent('btnApply');
                        }
                    } else {
                        if (e2kCarrierCode != '' && e2kCarrierCode != undefined) {
                            var msgField = Ext.Msg.show({
                                title: 'SCAC Code Warning Message',
                                msg: '<div><h4>E2k carrier code (<span class="titleBrown">' + e2kCarrierCode + ' </span>) of the Invoice Vendor does not match the selected MBLD Carrier code  (<span class="titleBrown">' + scacCodeVals + '</span>) <br/>'
                                    + ' Please provide explanation below or change invoice vendor before moving forward.<br/></h4></div>',
                                width: 400,
                                buttons: Ext.Msg.YESCANCEL,
                                buttonText:
                                {
                                    yes: 'Save',
                                    cancel: 'Cancel'
                                },
                                multiline: true,
                                fn: function (buttonValue, inputText, showConfig) {
                                    if (buttonValue == 'yes') {
                                        if (inputText == '') {
                                            Ext.Msg.alert('Please enter the valid comment to process further.');
                                        } else {
                                            IProcessingSCls.updateInvoiceComment(inputText);
                                            result = IProcessingSCls.verifyInvoice('Verified', canApprove, e2kUserId);
                                            if (result) {
                                                IProcessingSCls.resetFilterPopFilter(filter);
                                                tabPanel.down('#InvoiceProcessingId').setDisabled(true);
                                                if (IProcessingSCls.getPageType() == 'Bills' || IProcessingSCls.getPageType() == 'LVB') {
                                                    tabPanel.setActiveTab(3);
                                                } else {
                                                    tabPanel.down('#appCbolSumId').setDisabled(false);
                                                    tabPanel.setActiveTab(8);
                                                }
                                                filter.fireEvent('btnApply');
                                            }
                                        }
                                    }
                                },
                                icon: Ext.Msg.QUESTION
                            });
                            msgField.textArea.setFieldStyle({ border: '1px solid' });
                        }
                        else {
                            Ext.Msg.show({
                                title: 'SCAC Code Warning Message',
                                msg: '<div><h4>You have selected a vendor that does not have a SCAC code. Please select correct agent site code for (<span class="titleBrown">' + scacCodeVals + ' </span>) for this invoice.</h4></div>',
                                width: 400,
                                buttons: Ext.Msg.OK,
                                buttonText:
                                {
                                    ok: 'Ok'
                                },
                                multiline: false,
                                fn: function (buttonValue, inputText, showConfig) {
                                    BIACore.Exception(conn.responseText);
                                    BIACore.Message(response);
                                },
                                icon: Ext.Msg.QUESTION
                            });

                        }

                    }
                }
                else {
                    result = IProcessingSCls.verifyInvoice('Verified', canApprove, e2kUserId);
                    if (result) {
                        IProcessingSCls.resetFilterPopFilter(filter);
                        tabPanel.down('#InvoiceProcessingId').setDisabled(true);
                        if (IProcessingSCls.getPageType() == 'Bills' || IProcessingSCls.getPageType() == 'LVB') {
                            tabPanel.setActiveTab(3);
                        } else {
                            tabPanel.down('#appCbolSumId').setDisabled(false);
                            tabPanel.setActiveTab(8);
                        }
                        filter.fireEvent('btnApply');
                    }
                }
            }
            else {
                alert("Please select vat code for selected records.")
            }

        }
        else { me.hide(); }
    },
    CloseWindow: function CloseWindow(me) {
        var tabPanel = me.up('#tabPanelId');
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        IProcessingSCls.resetFilterPopFilter(filter);
        tabPanel.down('#InvoiceProcessingId').setDisabled(true);
        if (IProcessingSCls.getPageType() == 'Bills' || IProcessingSCls.getPageType() == 'LVB') {
            tabPanel.setActiveTab(3);
        } else {
            tabPanel.down('#appCbolSumId').setDisabled(false);
            tabPanel.setActiveTab(8);
        }
        filter.fireEvent('btnApply');
    }

});

