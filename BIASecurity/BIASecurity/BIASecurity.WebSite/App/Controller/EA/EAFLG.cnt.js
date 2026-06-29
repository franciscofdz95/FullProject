Ext.define('App.Controller.EA.EAFLG', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EAFLGPanel', selector: 'App-View-EA-EAFLG' }
    ],
    CtpInfoData: {},
    init: function init() {
        this.control({
            'App-View-EA-EAFLG': {
                show: this.LoadEAFLGData
            },
            'App-View-EA-EAFLG #btnEASave': {
                click: this.EASaveClick
            }
        })
    },

    LoadEAFLGData: function LoadEAFLGData(me, eOpts) {
        var access = me.up("[access]").access;
        var flgInfo = me.config.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'FLG', BIA_ID: me.up('window').access.LoginId });
        if (flgInfo) {
            if (flgInfo.data) {
                if (flgInfo.data.length > 0) {
                    let fmtData = flgInfo.data[0];
                    this.FlgInfoData = fmtData;
                    me.getViewModel().setData(fmtData);
                } else {
                    //Data will be inserted as new entry
                    me.getViewModel().getData()['BIA_ID'] = access.LoginId;
                }
            }
        }
    },

    EASaveClick: function SaveClick(me) {
        let currPanel = this.getActiveEAFLGPanel();
        let tData = currPanel.getViewModel().getData();
        tData.AccessAdmin = tData.AccessAdmin == 'Yes' || tData.AccessAdmin == 'Y' ? 'Y' : 'N';
        tData['BIA_ID'] = currPanel.up('window').access.LoginId;
        let resp = currPanel.config.CommonAjaxCall('api/BIASecurity/SaveFLG', tData);
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