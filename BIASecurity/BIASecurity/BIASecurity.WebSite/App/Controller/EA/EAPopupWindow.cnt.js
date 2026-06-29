Ext.define('App.Controller.EA.EAPopupWindow.cnt', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EAPopUpPanel', selector: 'App-View-EA-EAPopupWindow' }
    ],
    defaultValues: {
        ACIP: { tTitle: 'ACIP', tPanel: 'EAACIP' },
        BRIEF: { tTitle: 'BRIEF', tPanel: 'ea_Brief' },
        CVBAT: { tTitle: 'CVBAT', tPanel: 'EACVBAT' },
        Regulated_Goods: { tTitle:'Regulated Goods', tPanel:'EARegulatedGoods'},
        WVAR: { tTitle: 'Weekly Volume and Revenue', tPanel: 'EAWVAR' },
        Svc_Mapping: { tTitle: 'Service Mapping', tPanel: 'EASvcMapping' },
        OCM: { tTitle: 'OCM', tPanel: 'EAOCM' },
        MyReports: { tTitle: 'My Reports', tPanel: 'EAMyReports' },
        CTP: { tTitle: 'CTP', tPanel: 'EACTP' },
        //RevRec: { tTitle: 'RevRec', tPanel: 'EARevRec' },
        //DASAdvb: { tTitle: 'RevRec', tPanel: 'EARevRec' },
        FLG: { tTitle: 'Flight Gaurdian', tPanel: 'EAFLG' },
        FDB: { tTitle: 'FDB - Daily Profit Forecast (DPF)', tPanel: 'EAFDB' },
    },
    init: function init() {
        var me = this;
        me.control({
            'App-View-EA-EAPopupWindow': {
                afterrender: this.AfterRenderEAPopup
            }
        });
        me.listen({});
    },

    AfterRenderEAPopup: function AfterRenderEAPopup(me) {
        var comp = me.up("[access]");        
        if (me.access.LoginId) {
            let appDetails = this.defaultValues[me.access.AppCode];
            let pnl = me.down('App-View-EA-' + appDetails.tPanel);
                 me.setTitle(appDetails.tTitle + ' Extended Attributes for ' + me.access.LoginId);
                pnl.config.FormatGetComboData = this.FormatGetComboData;
                pnl.config.FormatSetComboData = this.FormatSetComboData;
                pnl.config.CommonAjaxCall = this.CommonAjaxCall;
                pnl.setHidden(false);
                 if(pnl.down('#btnEACancel'))
                    pnl.down('#btnEACancel').setHandler(this.EACancelClick, me);
        } else {
            me.close();
            Ext.MessageBox.alert('Error', 'The user\'s sysm was not provided.Please contact an administrator');
            return false;
        }
    },

    EACancelClick: function CancelClick(me) {
        me.up('window').close();
    },

    FormatGetComboData: function FormatGetComboData(inp) {
        let dta = Object.keys(inp);
        let fd = {};
        dta.forEach(function (ky) {
            if (inp[ky] == 'Yes' || inp[ky] == 'Y') {
                fd[ky] = '1';
            } else if (inp[ky] == 'No' || inp[ky] == 'N') {
                fd[ky] = '0';
            } else {
                fd[ky] = inp[ky];
            }
        });
        return fd;
    },

    FormatSetComboData: function FormatSetComboData(inp) {
        let dta = Object.keys(inp);
        let fd = {};
        dta.forEach(function (ky) {
            if (inp[ky] == 'Y') {
                fd[ky] = 'Yes';
            } else if (inp[ky] == 'N' || inp[ky] == null) {
                fd[ky] = 'No';
            } else if (inp[ky] === 0 || inp[ky] == '0') {
                fd[ky] = 'No';
            } else if (inp[ky] === 1 || inp[ky] == '1') {
                fd[ky] = 'Yes';
            } else {
                fd[ky] = inp[ky];
            }
        });
        return fd;
    },

    CommonAjaxCall: function CommonAjaxCall(url, storeParams, calledBy) {
        return BIA.Ajax.request({
            url: url,
            dataType: 'json',
            timeout: 80000,
            async: false,
            headers: { 'Content-Type': 'application/json' },
            jsonData: storeParams,
            method: 'POST'
            , success: function (res) {
                var txt = res.responseText;
            }
            , failure: function (res, opts) {
                Ext.Msg.alert('Error', 'Error : [' + calledBy + '] failed');
                var txt = res.responseText;
            }
        });
    }
})