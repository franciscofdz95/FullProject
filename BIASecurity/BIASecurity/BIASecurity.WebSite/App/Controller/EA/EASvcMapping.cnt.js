Ext.define('App.Controller.EA.EASvcMapping', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EASvcMappingPanel', selector: 'App-View-EA-EASvcMapping' }
    ],
    init: function init() {
        this.control({
            'App-View-EA-EASvcMapping': {
              show: this.LoadEASVCMappingData
            },
            'App-View-EA-EASvcMapping #btnEASave': {
                click: this.EASaveClick
            }
        })
    },

    LoadEASVCMappingData: function LoadEASVCMappingData(me, eOpts) {
        let access = me.up("[access]").access;
        var resp = me.config.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'Svc_Mapping', BIA_ID: access.LoginId });
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
        let currPanel = this.getActiveEASvcMappingPanel();
        let tData = currPanel.config.FormatGetComboData(currPanel.getViewModel().getData());
        tData['BIA_ID'] = currPanel.up('window').access.LoginId;
        let resp = currPanel.config.CommonAjaxCall('api/BIASecurity/SaveSvcMapping', tData);
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