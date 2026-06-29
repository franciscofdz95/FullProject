Ext.define('App.Controller.EA.EAOCM', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EAOCMPanel', selector: 'App-View-EA-EAOCM' }
    ],
    init: function init() {
        this.control({
            'App-View-EA-EAOCM': {
              show: this.LoadEAOCMData
            },
            'App-View-EA-EAOCM #btnEASave': {
                click: this.EASaveClick
            }
        })
    },
    
    LoadEAOCMData: function LoadEAOCMData(me, eOpts) {
        let access = me.up("[access]").access;
        var resp = me.config.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'OCM', BIA_ID: access.LoginId });
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
        let currPanel = this.getActiveEAOCMPanel();
        let tData = currPanel.config.FormatGetComboData(currPanel.getViewModel().getData());
        tData['BIA_ID'] = currPanel.up('window').access.LoginId;
        let resp = currPanel.config.CommonAjaxCall('api/BIASecurity/SaveOCM', tData);
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