Ext.define('App.Controller.EA.EAMyReports', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EAMyReportsPanel', selector: 'App-View-EA-EAMyReports' }
    ],
    init: function init() {
        this.control({
            'App-View-EA-EAMyReports': {
                show: this.LoadEAMyReportsData
            },
            'App-View-EA-EAMyReports #btnEASave': {
                click: this.EASaveClick
            }
        })
    },

    LoadEAMyReportsData: function LoadEAMyReportsData(me, eOpts) {
        let access = me.up("[access]").access;
        var resp = me.config.CommonAjaxCall('api/BIASecurity/EAGetMyReportsInfo', { BIA_ID: access.LoginId });
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
        let currPanel = this.getActiveEAMyReportsPanel();
        let tData = currPanel.getViewModel().getData();
        tData.AccessAdmin = tData.AccessAdmin == 'Yes' || tData.AccessAdmin == 'Y' ? 'Y' : 'N';
        tData['BIA_ID'] = currPanel.up('window').access.LoginId;
        let resp = currPanel.config.CommonAjaxCall('api/BIASecurity/SaveMyReports', tData);
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