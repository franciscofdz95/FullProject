Ext.define('App.Controller.EA.ea_Brief_ctrl', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'BriefPanel', selector: 'App-View-EA-ea_Brief' }
    ],
    visExclusionUsers: ['ext2jms', 'nbd1gxd', 'app1jak', 'mmg8jpc', 'dqc0jmp'],
    init: function init() {
        this.control({
            'App-View-EA-ea_Brief': {
                afterrender: this.LoadBriefaccess
            },
            'App-View-EA-ea_Brief #btnEASave': {
                click: this.SaveBriefInfo
            }
        })
    },
    LoadBriefaccess: function LoadBriefaccess(me, eOpts) {
        var loginId;
        loginId = me.up('window').access.LoginId,
            pnl = this.getActiveBriefPanel();
        visExclusions = this.CommonAjaxCall('api/BIASecurity/EAVisExclusions', {});
        if (visExclusions.success) {
            if (visExclusions.data.length > 0) {
                if ((BIACore.Security.Session.userId) && (this.visExclusionUsers.indexOf(BIACore.Security.Session.userId.toLowerCase()) > -1)) {
                    var fPnl = me.down('#EABriefFormPanel');
                    var curr = this;
                    visExclusions.data.forEach(function (k, v) {
                        var tLbl = k.EGN_Name + ' Visibility';
                        var tItemId = 'Allow_Vis_' + k.EGN_Num;

                        var tXtype = {
                            xtype: 'combobox',
                            fieldLabel: tLbl,
                            displayField: 'Name',
                            valueField: 'Code',
                            itemId: tItemId,
                            bind: '{' + tItemId + '}',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['Name', 'Code'],
                                data: [
                                    { "Name": "YES", "Code": "YES" },
                                    { "Name": "NO", "Code": "NO" }
                                ]
                            })
                        };
                        //  pnl.add(tXtype);
                        fPnl.insert(fPnl.items.length, tXtype);
                        fPnl.updateLayout();
                        me.getViewModel().getData()[tItemId] = 'NO';
                        var verifyColumnExists;
                        verifyColumnExists = curr.CommonAjaxCall('api/BIASecurity/EAVerifyColumnExists', { EGN_Num: k.EGN_Num });
                        if (verifyColumnExists.success) {
                            if (verifyColumnExists.data.length > 0) {
                                if (verifyColumnExists.data[0].n == 0) {
                                    setDefault = curr.CommonAjaxCall('api/BIASecurity/EASetDefault', { EGN_Num: k.EGN_Num });
                                }
                            }
                        }

                    });
                }
            }
        }
        var tmpStore;
        tmpStore = this.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'BRIEF', 'BIA_ID': loginId });
        me.updateLayout();
        me.getViewModel().getData()['BIA_ID'] = loginId;

        if (tmpStore.success) {
            if (tmpStore.data.length > 0) {
                me.down('#accessId').setValue(tmpStore.data[0].Limited_AM);
                me.down('#profileId').setValue(tmpStore.data[0].EA_BRIEF_Profiles);
                me.getViewModel().setData(tmpStore.data[0]);
            }
        }
    },

    SaveBriefInfo: function SaveBriefInfo(me) {
        var loginId, pnl, accessId, profileId;
        loginId = me.up('window').access.LoginId;
        pnl = this.getActiveBriefPanel();
        accessId = pnl.down('#accessId').getValue();
        profileId = pnl.down('#profileId').getValue();
        if (accessId == null) {
            Ext.MessageBox.alert('Warning', 'Please select Limitted access User');
            return;
        }
        else if (profileId == null) {
            Ext.MessageBox.alert('Warning', 'Please select profiles');
            return;
        }
        else {
            var response = {};
            if ((BIACore.Security.Session.userId) && (this.visExclusionUsers.indexOf(BIACore.Security.Session.userId.toLowerCase()) > -1)) {
                var inp = {};
                inp['DBParamNames'] = Object.keys(pnl.getViewModel().getData());
                inp['DBParamObj'] = pnl.getViewModel().getData();
                response = this.CommonAjaxCall('api/BIASecurity/PostBriefByUserId1', inp);
            }
            else
                response = this.CommonAjaxCall('api/BIASecurity/PostBriefByUserId', { 'BIA_ID': loginId, LimitedAM: accessId, BriefProfiles: profileId });

            if (response.success) {
                Ext.MessageBox.alert('BRIEF Extended attributes Save Success', 'Extended attributes updated successfully!');
                this.getActiveBriefPanel().up('window').close();
            }
        }
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