Ext.define('App.Controller.EA.EACTP', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EACTPPanel', selector: 'App-View-EA-EACTP' }
    ],
    CtpInfoData: {},
    init: function init() {
        this.control({
            'App-View-EA-EACTP': {
              show: this.LoadEACTPData
            },
            'App-View-EA-EACTP #CTPAccessGroupID': {
                storeload: this.AccessGroupStoreLoad
            },
            'App-View-EA-EACTP #btnEASave': {
                click: this.EASaveClick
            }
        })
    },

    LoadEACTPData: function LoadEACTPData(me, eOpts) {
        let access = me.up("[access]").access;
        var ctpInfo = me.config.CommonAjaxCall('api/BIASecurity/EAGetCTPInfo', { sysm: access.LoginId });
        if (ctpInfo) {
            if (ctpInfo.data) {
                if (ctpInfo.data.length > 0) {
                    let fmtData = ctpInfo.data[0];
                    this.CtpInfoData = fmtData;
                    me.getViewModel().setData(fmtData);
                } else {
                    //Data will be inserted as new entry
                    me.getViewModel().getData()['BIA_ID'] = access.LoginId;
                }               
            }
        }
        let editorInfo = me.config.CommonAjaxCall('api/BIASecurity/GetCTPInfoEditor', { sysm: access.LoginId });
        if (editorInfo) {
            if (editorInfo.data) {
                if (editorInfo.data.length > 0) {
                    let securityInfo = me.config.CommonAjaxCall('api/CTP/GetCTPSecurityTier', { GROUP_ID: editorInfo.data[0].AccessGroupID });//getCTPInfoEditor.AccessGroupID
                    if (securityInfo) {
                        if (securityInfo.data) {
                            if (securityInfo.data.length > 0) {
                                let qryAllAppGroupStore = me.down('#CTPAccessGroupID').getStore();
                                qryAllAppGroupStore.getProxy().extraParams = { app_user_tier: securityInfo.data[0].SecurityTier };
                                qryAllAppGroupStore.load();
                            }
                        }
                    }
                }
            }
        }
       

    },

    AccessGroupStoreLoad: function AccessGroupStoreLoad(me, store, records, success) {
        if (me.getStore().findRecord('ID', this.CtpInfoData.AccessGroupID))
            me.setSelection(me.getStore().findRecord('ID', this.CtpInfoData.AccessGroupID));
    },

    EASaveClick: function SaveClick(me) {
        let currPanel = this.getActiveEACTPPanel();
        let tData = currPanel.getViewModel().getData();
        tData.AccessAdmin = tData.AccessAdmin == 'Yes' || tData.AccessAdmin == 'Y' ? 'Y' : 'N';
        tData['BIA_ID'] = currPanel.up('window').access.LoginId;
        let resp = currPanel.config.CommonAjaxCall('api/BIASecurity/SaveCTP', tData);
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