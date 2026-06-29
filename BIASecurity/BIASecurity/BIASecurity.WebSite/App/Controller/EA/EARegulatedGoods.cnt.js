Ext.define('App.Controller.EA.EARegulatedGoods', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EARegulatedGoodsPanel', selector: 'App-View-EA-EARegulatedGoods' }
    ],
    init: function init() {
        this.control({
            'App-View-EA-EARegulatedGoods': {
                show: this.LoadEARegulatedGoodsData
            },
            'App-View-EA-EARegulatedGoods #btnEASave': {
                click: this.EASaveClick
            }
        })
    },

    LoadEARegulatedGoodsData: function LoadEARegulatedGoodsData(me, eOpts) {
        let access = me.up("[access]").access;
        var resp = me.config.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'RegulatedGoods', BIA_ID: access.LoginId });
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
        let currPanel = this.getActiveEARegulatedGoodsPanel();
        let tData = this.FormatGetComboData(currPanel.getViewModel().getData());
        let resp = currPanel.config.CommonAjaxCall('api/BIASecurity/SaveRegGoods', tData);
        if (resp) {
            if (resp.success === true) {
                me.up('window').close();
                Ext.MessageBox.alert('Success', 'Extended attributes updated successfully');
            } else {
                Ext.MessageBox.alert('Error', 'Extended attributes not updated.');
            }
        }
    },

    FormatGetComboData: function FormatGetComboData(inp) {
        let dta = Object.keys(inp);
        let fd = {};
        dta.forEach(function (ky) {
            if (inp[ky] == 'Yes' || inp[ky] == 'Y') {
                fd[ky] = 'Y';
            } else if (inp[ky] == 'No' || inp[ky] == 'N') {
                fd[ky] = 'N';
            } else {
                fd[ky] = inp[ky];
            }
        });
        return fd;
    },
});