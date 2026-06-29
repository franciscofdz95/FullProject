Ext.define('App.Controller.EA.EAACIP', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'ACIPPanel', selector: 'App-View-EA-EAACIP' }
    ],
    ACIPStores: {
        ACIPData: {},
        CSC_Type_Country_Code:'US'
    },
    CountryChangeOnLoad:true,
    FormData: {
        CSC_Type_Country_Code: 'US',
        Change_ActiveFlag: 0,
        EA_ACIP_Online_Research_Agent: 0,
        EA_ACIP_Online_Research_Agent_Reports:0
    },
    init: function init() {
        var me = this;

        me.control({
            'App-View-EA-EAACIP': {
                show: me.LoadEAACIPData,
            },
            'App-View-EA-EAACIP #acipCountryId': {
                change: me.OnCountryChange,
                storeload: this.CountryStoreLoad
            },
            'App-View-EA-EAACIP #acipCSCTypeCountryCodeId': {
                storeload: this.CSCTypeCountryCodeLoad
            },
            'App-View-EA-EAACIP #acipCSCAccessId': {
                storeload: this.CSCAccessLoad
            },
            'App-View-EA-EAACIP #acipRegionCoordinatorId': {
                change: me.SelectAddAddress
            },
            'App-View-EA-EAACIP #acipDistrictCoordinatorId': {
                change: me.SelectUnclassified,
            },
            'App-View-EA-EAACIP #btnEASave': {
                click: this.EASaveClick
            }

        });
        me.listen({});
    },

    CountryStoreLoad: function CountryStoreLoad(me, store, records, success) {
        this.ACIPStores['ACIPCountryStoreData'] = records;
        if (me.getStore().findRecord('CSC_Type_Country_Code', this.ACIPStores['CSC_Type_Country_Code']))
            me.setSelection(me.getStore().findRecord('CSC_Type_Country_Code', this.ACIPStores['CSC_Type_Country_Code']));
    },

    CSCTypeCountryCodeLoad: function CSCTypeCountryCodeLoad(me, store, records, success) {
        if (records.length > 0 && !(this.FormData['CSC_Type_Country_Code'])) {
            this.ACIPStores['CSC_Type_Country_Code'] = records[0].getData().CSC_Type_Country_Code;
        } else if (this.FormData['CSC_Type_Country_Code']) {
            this.ACIPStores['CSC_Type_Country_Code'] = this.FormData['CSC_Type_Country_Code'];
        }
        
        let tstore2 = me.up().down('#acipCSCAccessId').getStore();
        if (tstore2) {
            tstore2.getProxy().extraParams = { CSC_Type_Country_Code: this.ACIPStores['CSC_Type_Country_Code'] };
            tstore2.load();
        }
    },

    CSCAccessLoad: function CSCAccessLoad(me, store, records, success) {
        this.ACIPStores['ACIPCSCAccess'] = records;
        let tAccess = this.ACIPStores['ACIPData'].CSC_Access;        
        tAccess = tAccess != '' ? tAccess : 0;
        if (me.getStore().findRecord('CSC_Type', tAccess))
            me.setSelection(me.getStore().findRecord('CSC_Type', tAccess));        
        // else 'No' will be selected
    },

    LoadEAACIPData: function LoadEAACIPData(me, eOpts) {
        var resp = this.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'ACIP', BIA_ID: me.up('window').access.LoginId });
        if (resp) {
            if (resp.data.length > 0) {
                let fmtData = this.FormatSetComboData(resp.data[0]);
                this.ACIPStores['ACIPData'] = fmtData;
                me.getViewModel().setData(fmtData);
            }
            
            if (this.ACIPStores['ACIPData'].CSC_Access) {
                let tstore1 = me.up().down('#acipCSCTypeCountryCodeId').getStore();
                if (tstore1) {
                    let tmpCSCType = this.ACIPStores['ACIPData'].CSC_Access != '' ? this.ACIPStores['ACIPData'].CSC_Access : '';
                    tstore1.getProxy().extraParams = { CSC_Type: tmpCSCType };
                    tstore1.load();
                }
            }           
                
        }
    },
    OnCountryChange: function (combo, newVal, oldVal) {
        //// onchange="javascript:this.form.action='#CGI.PATH_INFO#?#CGI.QUERY_STRING#';this.form.submit();"
        if (!this.CountryChangeOnLoad === true)
            this.EASaveClick(combo.up());
        //let resp = this.CommonAjaxCall('api/BIASecurity/SaveACIP', tData);
        //if (resp) {
        //    if (resp.success === true) {
        //        Ext.toast('Country saved successfully');
        //    } else {
        //        Ext.MessageBox.alert('Error', 'Country not updated.');
        //    }
        //}
    },

    SelectAddAddress: function (combo, newVal, oldVal) {
        let frmMain = this.ACIPStores.ACIPData;
        if ((frmMain.Region_Coordinator == 'Yes') || (frmMain.District_Coordinator == 'Yes')) {
            combo.up().down('#acipAddAddressId').setValue('Yes');
        } else {
            combo.up().down('#acipAddAddressId').setValue('No');
        }
        if (combo.itemId == 'acipRegionCoordinatorId') {
            this.SelectUnclassified(combo, newVal, oldVal);
        }
    },

    SelectUnclassified: function (combo, newVal, oldVal) {
        let frmMain = this.ACIPStores.ACIPData;
        if ((frmMain.Region_Coordinator == 'Yes') && (frmMain.District_Coordinator == 'No')) {
            combo.up().down('#acipUnclassifiedDesId').setValue('1');
        } else {            
            combo.up().down('#acipUnclassifiedDesId').setValue('0');
        }
    },

    EASaveClick: function EASaveClick(me) {
        var tData = {},
            currPanel = this.getActiveACIPPanel(),
            frm = currPanel.down('form');

            currPanel.getViewModel().getData()['BIA_ID'] = currPanel.up('window').access.LoginId;
            tData = this.FormatGetComboData(currPanel.getViewModel().getData());           
        if (tData) {
            if (this.ValidateFormData(tData) === true) {
                let resp = this.CommonAjaxCall('api/BIASecurity/SaveACIP', tData);
                if (resp) {
                    if (resp.success === true) {
                        me.up('window').close();
                        Ext.MessageBox.alert('Success', 'Extended attributes updated successfully');
                    } else {
                        Ext.MessageBox.alert('Error', 'Extended attributes not updated.');
                    }
                }
            }
        }     
       

    },

    EACancelClick: function CancelClick(me) {
        me.up('window').close();
    },

    ValidateFormData: function ValidateFormData(frmMain) {
        let isDataValid = true;
        var strMsg = 'The following errors occured: <br>';
        var intError = 0;

        if (frmMain.CSC_Access != 0 && frmMain.Add_Address == 'Yes') {
            intError++;
            strMsg += intError + '. CSC users cannot have Update Address Rights.<br>';
        }
       
        if (frmMain.Add_Address == 'Yes' && (frmMain.Region_Coordinator == 'No' && frmMain.District_Coordinator == 'No')) {
            intError++;
            strMsg += intError + '. Only Region or District Coordinators can have Update Address Rights.<br>';
        }
        if (frmMain.Unclassified_Des == 1 && frmMain.Region_Coordinator == 'No') {
            intError++;
            strMsg += intError + '. Only Region Coordinators can have Unclassified Designation Rights.<br>';
        }
        if (frmMain.CSC_Access != 0 && (frmMain.Region_Coordinator == 'Yes' || frmMain.District_Coordinator == 'Yes')) {
            intError++;
            strMsg += intError + '. CSC users cannot be Region or District Coordinators.<br>';
        }
        if (frmMain.CSC_Supervisor_Access == 1 && frmMain.CSC_Access == 0) {
            intError++;
            strMsg += intError + '. Only CSC users can be CSC Supervisors.<br>';
        }
        if (frmMain.CSC_Access != 0 && frmMain.Edit_Reasons == 1) {
            intError++;
            strMsg += intError + '. CSC users cannot Edit Designation Reasons.<br>';
        }
        if (frmMain.CSC_Access != 0 && frmMain.View_Repeater_Rpt == 1) {
            intError++;
            strMsg += intError + '. CSC users cannot View the Repeater Report.<br>';
        }
        if (frmMain.Region_Coordinator == 'Yes' && frmMain.District_Coordinator == 'Yes') {
            intError++;
            strMsg += intError + '. Users cannot be Region and District Coordinators at the same time.<br>';
        }
        if (frmMain.CSC_Access != 0 && frmMain.Escalation_Export == 1) {
            intError++;
            strMsg += intError + '. CSC users cannot view the Escalation Report.<br>';
        }
        if (frmMain.CSC_Access != 0 && frmMain.EA_UseMultiTrackingNumLookup == 1) {
            intError++;
            strMsg += intError + '. CSC users cannot use the Multi Tracking Num Lookup functionality.<br>';
        }
        if (intError > 0) {
            Ext.Msg.alert('Error', strMsg + '<br>Please review and change your selections.<br>');
            isDataValid = false;
            return false;
        }

        return isDataValid;
    },

    FormatGetComboData: function FormatGetComboData(inp) {
        let dta = Object.keys(inp);
        let fd = {};
        let f2i = ['Add_Address', 'Region_Coordinator','District_Coordinator']; //fields to ignore
        dta.forEach(function (ky) {
            if (f2i.indexOf(ky) < 0 && (inp[ky] == 'Yes' || inp[ky] == 'Y' || inp[ky] === 1|| inp[ky] ==='1')) {
                fd[ky] = 1;
            } else if (f2i.indexOf(ky) < 0 && (inp[ky] == 'No' || inp[ky] == 'N' || inp[ky] === 0 || inp[ky] === '0')) {
                fd[ky] = 0;
            } else {
                fd[ky] = inp[ky];
            }
        });
        return fd;
    },

    FormatSetComboData: function FormatSetComboData(inp) {
        let dta = Object.keys(inp);
        let fd = {};
        let f2i = ['Add_Address', 'Region_Coordinator', 'District_Coordinator']; //fields to ignore
        dta.forEach(function (ky) {
            if (f2i.indexOf(ky) < 0 &&(inp[ky] == 'Y')) {
                fd[ky] = 'Yes';
            } else if (f2i.indexOf(ky) < 0 && (inp[ky] == 'N')) {
                fd[ky] = 'No';
            } else if (f2i.indexOf(ky) < 0 && (inp[ky] === 0 || inp[ky] == '0')) {
                fd[ky] = 'No';
            } else if (f2i.indexOf(ky) < 0 && (inp[ky] === 1 || inp[ky] == '1')) {
                fd[ky] = 'Yes';
            } else {
                fd[ky] = inp[ky];
            }
        });
        return fd;
    },

    CommonAjaxCall: function CommonAjaxCall(tUrl, tData) {
        return BIA.Ajax.request({
            url: tUrl,
            jsonData: tData,
            async: false,
            success: function (res) {
                var txt = res.responseText;
            },
            failure: function (request, success, response) {
                Ext.Msg.alert('Failed', 'CommonAjaxCall failed');

            }
        });
    }
    
})