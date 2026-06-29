Ext.define('App.Controller.EA.EAGCPR', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EAGCPRPanel', selector: 'App-View-EA-EAGCPR' }
    ],
    init: function init() {
        this.control({
            'App-View-EA-EAGCPR': {
                show: this.LoadEAGCPTData
            },
            'App-View-EA-EAGCPR #btnEASave': {
                click: this.EASaveClick
            }
        })
    },

    LoadEAGCPRData: function LoadEAGCPRData(me, eOpts) {
        let access = me.up("[access]").access;
        var resp = me.config.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'GCPR_Mart', BIA_ID: access.LoginId });
        if (resp) {
            if (resp.data) {
                if (resp.data.length > 0) {
                    let fmtData = me.config.FormatSetComboData(resp.data[0]);
                    me.getViewModel().setData(fmtData);
                } else {
                    //Data will be inserted as new entry
                    me.getViewModel().getData()['BIA_ID'] = access.LoginId;
                }
            }
        }
    },

    EASaveClick: function SaveClick(me) {
        let currPanel = this.getActiveEAGCPRPanel();
        let tData = currPanel.config.FormatGetComboData(currPanel.getViewModel().getData());
        tData['BIA_ID'] = currPanel.up('window').access.LoginId;
        let resp = currPanel.config.CommonAjaxCall('api/BIASecurity/SaveGCPR', tData);
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