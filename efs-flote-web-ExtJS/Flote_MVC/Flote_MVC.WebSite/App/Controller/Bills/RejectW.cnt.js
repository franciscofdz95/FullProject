/* ====================================================================================================
NAME:			[Bills Rejection Window Controller ]
BEHAVIOR:		Performs Action and  data for Bills Rejection Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/28/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/


Ext.define('App.Controller.Bills.RejectW', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }

    ],
    init: function () {
        var me = this;

        me.control({
            '[xtype="App-View-Bills-RejectW"] #btnSaveRejection': {
                click: me.SaveRejection
            },
            '[xtype="App-View-Bills-RejectW"] #btnBillRejectCancel': {
                click: me.CancelReject
            }

        });

    },
    SaveRejection: function RejectBills(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        if (me != null && me != undefined) {
            var win = me.up('window');
            var cmt = win.down('#cmtBillRejection').getValue();
            var grid = win.grid;
            if (grid.getSelectionModel().selected.items.length > 0) {
                if (cmt != '') {
                    Ext.each(grid.getSelectionModel().selected.items, function (item) {                        
                        cmt = 'Resent the invoice from sent to queue status';
                        me.fireEvent('btnSaveRejection', item, cmt, 'Approved');
                    });
                    filter.fireEvent('btnApply');
                    grid.getStore().load();
                    win.close();
                }
                else {
                    win.down('#cmtBillRejection').addCls('red-btn');
                }
            }
            else {
                alert("Please select the row to resend.")
            }
        }
    },
    CancelReject: function CancelReject(me) {
        if (me != null && me != undefined) {
            var win = me.up('window');
            var grid = win.grid;
            grid.getSelectionModel().deselectAll();
            win.close();
        }
    }
});

