Ext.define('App.Controller.EA.EARevRec', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EARevRecPanel', selector: 'App-View-EA-EARevRec' }
    ],
    init: function init() {
        this.control({
            'App-View-EA-EARevRec': {
                show: this.LoadEARevRecData
            },
            'App-View-EA-EARevRec #btnEASave': {
                click: this.EASaveClick
            }
        })
    },

    LoadEARevRecData: function LoadEARevRecData(me, eOpts) {

        let loginId = me.up('window').access.LoginId;
        let tmpStore = me.config.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'RevRec', 'BIA_ID': loginId });
        me.getViewModel().getData()['BIA_ID'] = loginId;
        if (tmpStore.success) {
            if (tmpStore.data.length > 0) {
                me.getViewModel().setData(tmpStore.data[0]);
            }
            else {
                me.getViewModel().getData()['BIA_ID'] = loginId;
            }
        }

    },
    
    EASaveClick: function SaveClick(me) {
        
        if (!me.up('form').isValid()) {
            Ext.MessageBox.alert('Error', 'Please enter valid characters.');
            return false;
        }


        let loginId = me.up('window').access.LoginId;
        let pnl = this.getActiveEARevRecPanel();
        let req = {
            BIA_ID: loginId,
            Admin: pnl.down('#RevRecIsAdminId').getValue(),
            RR: pnl.down('#RevRecRegionId').getValue(),
            DD: pnl.down('#RevRecDistrictId').getValue()
            
        };
        let resp = pnl.config.CommonAjaxCall('api/BIASecurity/SaveRevRec', req);
        if (resp) {
            if (resp.success === true) {
                me.up('window').close();
                Ext.MessageBox.alert('Success', 'Extended attributes updated successfully');
            } else {
                Ext.MessageBox.alert('Error', 'Extended attributes not updated.');
            }
        }
    }
});