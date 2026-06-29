Ext.define('App.Controller.EA.EAWVAR', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EAWVARPanel', selector: 'App-View-EA-EAWVAR' }
    ],
    formData: {},
    init: function init() {
        this.control({
            'App-View-EA-EAWVAR': {             
              show: this.LoadEAWVARData
            },
            'App-View-EA-EAWVAR #btnEAWVARSave': {
                click: this.EASaveClick
            }
        })
    },

    LoadEAWVARData: function LoadEAWVARData(me, eOpts) {
        let access = me.up("[access]").access;
        let parentUsers = ['nbd1gxd', 'lk', 'qw', 'ss', 'biaqa1'];
        var userAccessLevel = me.config.CommonAjaxCall('api/BIASecurity/EAWVARUserAccessLevel', { sysm: access.LoginId });
        if (userAccessLevel) {
            if (userAccessLevel.data) {
                userAccessLevel = userAccessLevel.data[0];
                var tRegion = userAccessLevel.RegionType != null || userAccessLevel.RegionType != '' ? userAccessLevel.RegionType.toUpperCase() : '';
                if (['INT', 'BOTH', 'ALL'].indexOf(tRegion) > -1 || userAccessLevel.Access_GeoCode == 'CO') {
                    me.down('#wvarViewFileId').setHidden(false);
                    me.down('#wvarUploadFileId').setHidden(false);
                    me.down('#wvarEditFileId').setHidden(false);
                    me.down('#wvarFileOnlyId').setHidden(false);
                } else {
                    me.down('#hViewFile').setValue('0');
                    me.down('#hUploadFile').setValue('0');
                    me.down('#hEditFile').setValue('0');
                    me.down('#hFileOnly').setValue('0');
                }

                if (userAccessLevel.Access_GeoCode == 'CO')
                    me.down('#wvarStrategicParentId').setHidden(false);
                else
                    me.down('#hStrategicParent').setValue('0');


                if (['DOM', 'BOTH', 'ALL'].indexOf(tRegion) > -1)
                    me.down('#wvarDMReportAccessId').setHidden(false);
                else
                    me.down('#hDMReportAccess').setValue(0);
            }
        }
        if (parentUsers.indexOf(access.LoginId) > -1) {
            let tArr = columnList.filter(function (s) { return s.includes('ea_exclude_parent') });
            let ep = tArr.length > 0 ? tArr[0] : '';
            me.down('#wvarExcludeParent').setHidden(false);
            me.down('#wvarExcludeParent').setFieldLabel('Can See ' + ep.split('_').pop() + 'Parents:');//#ListGetAt(var, 5, '_')#
            me.down('#wvarExcludeParent').setValue(fmtData[ep]);
        }
        var resp = me.config.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'WVAR', BIA_ID: access.LoginId });
        if (resp) {
            if (resp.data) {
                if (resp.data.length > 0) {
                    let fmtData = me.config.FormatSetComboData(resp.data[0]);
                    me.getViewModel().setData(fmtData);
                    let columnList = resp.data.length > 0 ? Object.keys(resp.data[0]) : [];                    
                } else {
                    //Data will be inserted as new entry
                    let fmtData = me.getViewModel().getData();
                    me.getViewModel().getData()['BIA_ID'] = access.LoginId;
                    me.getViewModel().getData()['ea_exclude_parent_1043039000_amazon'] = '0';
                }               
            }
        }
    },
    
    EASaveClick: function SaveClick(me) {
        let currPanel = this.getActiveEAWVARPanel();
        let tData = currPanel.config.FormatGetComboData(currPanel.getViewModel().getData());
        tData['BIA_ID'] = currPanel.up('window').access.LoginId;
        let resp = currPanel.config.CommonAjaxCall('api/BIASecurity/SaveWVAR', tData);
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