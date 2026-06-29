Ext.define('App.Controller.EA.ea_CVBAT_ctrl', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'CVBATPanel', selector: 'App-View-EA-EACVBAT' }
    ],
    init: function init() {
        this.control({
            'App-View-EA-EACVBAT': {
                afterrender: this.LoadCVBATaccess
            },
            'App-View-EA-EACVBAT #btnEASave': {
                click: this.SaveCVBATInfo
            }
        })
    },
    LoadCVBATaccess: function LoadCVBATaccess(me, eOpts) {
        let loginId = me.up('window').access.LoginId;//Ext.get('hdnLoginId-inputEl').dom.value;
        let tmpStore = this.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'CVBAT', 'BIA_ID': loginId });
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

    SaveCVBATInfo: function SaveCVBATInfo(me) {

        let loginId = me.up('window').access.LoginId;
        let pnl = this.getActiveCVBATPanel();
        let req = {
            BIA_ID: loginId,
            AccessAdmin: pnl.down('#cvbatAccessAdminId').getValue(),
            Debug: pnl.down('#cvbatDebugId').getValue(),
            EditOverride: pnl.down('#cvbatEditOverrideId').getValue(),
            MyReportsHistory: pnl.down('#cvbatMyReportsHistoryId').getValue(),
            NBS: pnl.down('#cvbatNBSId').getValue(),
            NewsEditor: pnl.down('#cvbatNewsEditorId').getValue(),
            ExportCSV: pnl.down('#cvbatExportCSVId').getValue(),
            Attributes: pnl.down('#cvbatAttributesId').getValue(),
            FlagSitesFlagEdit: pnl.down('#cvbatFlagSitesFlagEditId').getValue(),
            ParentException: pnl.down('#cvbatParentExceptionId').getValue()
        };
        
        let response = this.CommonAjaxCall('api/BIASecurity/PostCVBATByUserId', req);
        if (response.status === 200) {
            Ext.MessageBox.alert('CVBAT Extended attributes Save Success', 'Extended attributes updated successfully!');
            this.getActiveCVBATPanel().up('window').close();
        }
    },
    hideCVBATPopUp: function hideCVBATPopUp(me) {
        this.getActiveCVBATPanel().up('window').close();
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
});