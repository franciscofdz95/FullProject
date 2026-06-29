/* ====================================================================================================
NAME:			[Bills TBAR Controller ]
BEHAVIOR:		Performs Action and  data for Bills TBar action event.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/28/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/


Ext.define('App.Controller.Bills.BillsTBar', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }

    ],
    init: function () {
        var me = this;

        me.control({
            '[xtype="App-View-Bills-TBar"] ': {
                afterrender: me.BillTBarAfterRender
            },
            '[xtype="App-View-Bills-TBar"] #btnRejectBills': {
                click: me.RejectBills
            },
            '[xtype="App-View-Bills-TBar"] #btnResendBills': {
                click: me.ResendBills
            },
            '[xtype="App-View-Bills-TBar"] #btnAddToQueue': {
                click: me.AddToQueue
            },
            '[xtype="App-View-Bills-TBar"] #btnSendQueuedBills': {
                click: me.SendQueuedBills
            },
            '[xtype="App-View-Bills-TBar"] #btnSendSelectedBills': {
                click: me.SendToAPUT
            },
            '[xtype="App-View-Bills-TBar"] #btnRemoveFromQueue': {
                click: me.RemoveFromQueue
            },
            '[xtype="App-View-Bills-TBar"] #btnLogVendorBill': {
                click: me.LogVendorBill
            },
            '[xtype="App-View-Bills-TBar"] #incompleteApproveInvoicesId': {                
                render: me.IncompleteRender
            }
        });

    },
    // Get Bills Details Reports cell click event.

    BillTBarAfterRender: function BillTBarAfterRender(me) {
        var baseRegex = '/';
        baseRegex = baseRegex + '|btnLogVendorBill|btnExcelExportBillsId|incompleteApproveInvoicesId|lblTitle|tbSep35|tbSep30|tbSep2';
        var count = me.up('grid').store.getCount()
        // Below profile code is added for the TFS: 912725 
        var profileArray = [1, 5, 7];
        var profileId = BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId;
        if (!Ext.isEmpty(profileId)) {
            profileId = parseInt(profileId);
            if (profileArray.indexOf(profileId) === -1) {
                baseRegex = baseRegex + '|btnLogVendorBill';
            }
        }
        if (BillsSingCls.getOnAputFlag() == 'Y') {
            if (PgAtt.getInvoice_status() == 'Queued') {
                if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1) {
                    if (count > 0) baseRegex = baseRegex + '|btnSendQueuedBills';
                }
                if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1) {
                    baseRegex = baseRegex + '|btnRemoveFromQueue';
                }
            }

            if (PgAtt.getInvoice_status() == 'Sent') {
                if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1) {
                    baseRegex = baseRegex + '|btnResendBills';
                }
                if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1) {
                    baseRegex = baseRegex + '|btnRejectBills';
                }
            }
            if (PgAtt.getInvoice_status() == 'Scanned' && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1) {
                baseRegex = baseRegex + '|btnAddToQueue';
            }

        }
        var regex = new RegExp(baseRegex + '|/', 'i');

        for (var i = 0; i < me.items.length; i++) {
            if (regex.test(me.items.items[i].itemId)) {
                me.items.items[i].setVisible(true);
            }
            else { me.items.items[i].setVisible(false); }
        }
    },
    RejectBills: function RejectBills(me) {
        me.disable();
        var grid = me.up('grid')
        if (grid.getSelectionModel().selected.items.length > 0) {
            var win = Ext.widget('App-View-Bills-RejectW')
            win.grid = grid;
            win.show();
        } else {
            alert("Please select the row to reject.")
        }
        me.enable();
    },
    ResendBills: function ResendBills(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        me.disable();
        var grid = me.up('grid')

        if (grid.getSelectionModel().selected.items.length > 0) {
            Ext.Msg.confirm('Resend Invoices', 'Resend Invoices To Queued Status', function (button) {
                if (button === 'yes') {
                    grid.mask('Resending Selected Bills...');
                    Ext.defer(function () {
                        Ext.each(grid.getSelectionModel().selected.items, function (item) {
                            var invId = item.get('invoice_id');
                            var DocumentId = item.get('ImageNumber');
                            var cmt = 'Resent the invoice from sent to queue status';
                            me.fireEvent('btnResendBills', invId, 'Queued', BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, cmt, DocumentId);
                        });
                        PgAtt.setFilterGoFlag(true);
                        filter.fireEvent('btnApply');
                    }, 10, this, [grid]);
                    setTimeout(function () { grid.unmask(); }, 100);
                }
                else {
                    grid.getSelectionModel().deselectAll();
                }
            }, this);
        }
        else {
            alert("Please select the row to resend.")
        }
        me.enable();
    },
    SendQueuedBills: function SendQueuedBills(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        if (PgAtt.getLocation_code() == '' && PgAtt.getCompany_code() == '') {
            Ext.Msg.alert('Send Queued Bills', 'The \'Send Queued Bills\' button can only be used when a location and/or company code filter has been applied.\nPlease enter a location code into the \'Filters\' panel on the top right side of this page, then try this button again\.');
            return false;
        }
        else {
            var grid = me.up('grid'),
                store = grid.getStore(),
                records = store.getRange();
            grid.mask('Sending and creating invoices to APUT batch...');
            if (records.length > 0) {
                Ext.defer(function () {
                    if (store.getTotalCount() > 500) {
                        Ext.Msg.alert('Send Queued Bills', 'Sending only 500 queued bills per request.');
                    }
                    var params = Ext.Object.merge(filter.GetParameters(), { start: 0, limit: 500, sort: [{ root: "data", property: "invoice_id", direction: "DESC" }, { root: "data", property: "InvRefNo", direction: "DESC" }] });
                    BIA.Ajax.request({
                        url: 'api/WebAPIReport/BillsReport',
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
                            grid.unmask();
                            var data = Ext.decode(conn.responseText);
                            var array = '';
                            var count = 0;
                            Ext.each(data.data, function (item) {
                                count = count + 1;
                                array = array + item.invoice_id;
                                if (data.data.length > 1 && count != data.data.length) {
                                    array = array + ',';
                                }
                            });
                            me.fireEvent('btnSendSelectedBills', array.toString());
                            store.load({
                                callback: function (recs) {
                                    var btn = grid.down('#btnSendQueuedBills');
                                    if (recs.length > 0) {
                                        btn.show();
                                        btn.setText('<div style = "font-weight: bold; color:white;" > Send Queued Bills (' + store.getTotalCount() + ')</div >');
                                    } else {
                                        btn.hide();
                                    }
                                }
                            });
                            filter.fireEvent('btnApply');
                            grid.unmask();
                        },
                        failure: function (conn, response, options, eOpts) {
                            grid.unmask();
                            BIACore.Exception(conn.responseText);
                            BIACore.Message(response);
                        }
                    });

                }, 10, this, [grid]);
            } else {
                Ext.Msg.alert('Send Queued Bills', 'There are no record(s) in grid to be process');
            }

        }
    },
    AddToQueue: function AddToQueue(me) {
        var grid = me.up('grid')
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        me.disable();
        grid.mask('Adding it to Queue...');
        if (grid.getSelectionModel().selected.items.length > 0) {
            Ext.defer(function () {
                Ext.each(grid.getSelectionModel().selected.items, function (item) {
                    me.hide();
                    me.fireEvent('btnAddToQueue', item, 'Queued');
                });
                grid.getStore().load();
                filter.fireEvent('btnApply');
            }, 10, this, [grid]);
        }
        else {
            alert("Please select the row to add it to Queue.")
        }
        setTimeout(function () { grid.unmask() }, 100);
        me.enable();
    },
    SendToAPUT: function SendToAPUT(me) {
        var grid = me.up('grid')
        grid.mask('Sending to APUT...');
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        me.disable();

        if (grid.getSelectionModel().selected.items.length > 0) {
            Ext.defer(function () {
                var array = '';
                var count = 0;

                Ext.each(grid.getSelectionModel().selected.items, function (item) {
                    count = count + 1;
                    array = array + item.get('invoice_id');
                    if (grid.getSelectionModel().selected.items.length > 1 && count != grid.getSelectionModel().selected.items.length) {
                        array = array + ',';
                    }
                });
                me.fireEvent('btnSendSelectedBills', array.toString());
                grid.getStore().load();
                filter.fireEvent('btnApply');
            }, 10, this, [grid]);


        }
        else {
            alert("Please select the row/rows to send to APUT.")
        }
        setTimeout(function () { grid.unmask(); }, 100);
        me.enable();
    },
    RemoveFromQueue: function RemoveFromQueue(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        me.disable();
        var grid = me.up('grid')
        if (grid.getSelectionModel().selected.items.length > 0) {
            grid.mask('Removing from queue...');
            Ext.defer(function () {
                Ext.each(grid.getSelectionModel().selected.items, function (item) {
                    me.fireEvent('btnRemoveFromQueue', item, 'Scanned');
                });
                PgAtt.setFilterGoFlag(true);
                filter.fireEvent('btnApply');
            }, 10, this, [grid]);

        }
        else {
            alert("Please select the row to remove from Queue.")
        }
        setTimeout(function () { grid.unmask() }, 100);
        me.enable();
    },
    LogVendorBill: function LogVendorBill(me) {
        LogVendorSCls.setSelectedRecord('');
        LogVendorSCls.setInvoiceId(0);
        var locCode = PgAtt.getLocation_code();
        LogVendorSCls.GetTWHCodesByLoc(locCode);
        Ext.widget('App-View-LogVendor-LogVendorBill').show();
    },
    IncompleteRender: function IncompleteRender(me) {
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        me.getEl().on('click', function () {
            var billTabPanel = tabPanel.down('#AppBillTabPanelId');
            var date = new Date();
            var year = date.getFullYear();
            if (year == PgAtt.getYear() || PgAtt.getYear() > 2015) {
                alert("Some of the Incomplete invoices might be from previous year. Please select the appropiate filter criteria to see those records");
            }
            var approCount = billTabPanel.down('#billApproved').tab.getText();

            if (approCount.indexOf("(0)") == -1) {
                billTabPanel.setActiveTab(3);
            } else {
                billTabPanel.setActiveTab(4);
            }

        }, me);
    }
});

