Ext.define('App.Controller.LogVendor.Button.SaveProcess', {
    init: function() {
        this.control({            
            'App-View-LogVendor-LogVendorBill [status3Hide]': {
                beforerender: this.Status3HideButtonsBeforeRender
            }
        });
    },
    Status3HideButtonsBeforeRender: function Status3HideButtonsBeforeRender(me) {
        var logVendorBillWin = me.up('App-View-LogVendor-LogVendorBill');
        if (logVendorBillWin) {
            logVendorBillWin.store.addListener({
                load: {
                    fn: this.Status3HideButtonsShowHide,
                    scope: this,
                    args: [me]
                }
            })
        }
    },
    Status3HideButtonsShowHide: function Status3HideButtonsShowHide(me, store, records, success) {
        if (success && records.length > 0) {
            if (records[0].Status == 3) me.show();
            else me.hide();
        }
        else {
            me.hide();
        }
    }
});