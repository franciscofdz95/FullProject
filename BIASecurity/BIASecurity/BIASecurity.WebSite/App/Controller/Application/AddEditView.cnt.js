Ext.define('App.Controller.Application.AddEditView', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'ApplicationAddEditView', selector: 'App-View-Application-AddEditView' }
    ],
    init: function init() {
        this.control({
            'App-View-Application-AddEditView [store][getAppOnStoreLoad=true]': {
                storebeforeload: this.AddEditViewGetAppOnStoreLoad
            },
            'App-View-Application-AddEditView button#Save': {
                click: this.ApplicationSaveClick
            },
            'App-View-Application-AddEditView button#Cancel': {
                click: this.ApplicationCancelClick
            },
            'App-View-Access-List-View': {
                storebeforeLoad: this.AccessListStoreBeforeLoad
            },
            'App-View-Application-AddEditView': {
                afterrender: this.ApplicationAfterRender
            },
            'App-View-Application-AddEditView #appAddViewEditTabPanel': {
                tabchange: this.ApplicationTabChange
            }
        });
    },
    ApplicationTabChange: function ApplicationTabChange(me, newCard, oldCard, eOpts) {
        var container = me.up('App-View-Application-AddEditView');
        var buttons = container.down('App-View-Component-ButtonContainer');
        var saveButton = buttons.down('#Save');
        if (newCard.title == 'Access') saveButton.hide();
        else {
            if (container.formType == 'View') saveButton.hide()
            else saveButton.show();
        }
        //saveButton.hide();
    },
    AccessListStoreBeforeLoad: function AccessListStoreBeforeLoad(me) {
        //alert('Testing!');
        var appCnt = me.up('[appCode]');
        //        if (appCnt && !Ext.isEmpty(appCnt.appCode) && !Ext.isEmpty(appCnt.formType) && me.childDisplay) {
        //me.store.getProxy().extraParams = { appCode: appCnt.appCode, formType: appCnt.formType };
        //       }
    },
    ApplicationAfterRender: function ApplicationAfterRender(me) {
        var RequiredAccess = Ext.ComponentQuery.query('[requiredAccess]');
        var buttonContainer = me.down('componentAddEditButtonContainer');
        if (me.formType == 'Edit') {
            buttonContainer.down('#Save').show();
        }
        else {
            buttonContainer.down('#Save').hide();
        }
        Ext.each(RequiredAccess, function (item, idx, e) {
            if (this.requiredAccess == 'SA' && !BIACore.Security.User.isSA() && item.tab) item.tab.hide();
        });
    },
    AddEditViewGetAppOnStoreLoad: function AddEditViewGetAppOnStoreLoad(me) {
        var appCnt = me.up('[appCode]');
        if (appCnt && !Ext.isEmpty(appCnt.appCode) && !Ext.isEmpty(appCnt.formType)) {
            me.store.getProxy().extraParams = { appCode: appCnt.appCode, formType: appCnt.formType };
        }
    },
    ApplicationCancelClick: function ApplicationCancelClick(me) {
        Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', { xtype: 'App-View-Application-List', flex: 1 });
    },
    ApplicationSaveClick: function ApplicationSaveClick(me) {
        if (BIACore.Security.User.isSA()) {
            var applicationAddEditView = this.getApplicationAddEditView();
            if (applicationAddEditView) {
                var tabPanel = applicationAddEditView.down('#appAddViewEditTabPanel'),
                    activeTab = tabPanel.getActiveTab(),
                    serverRecord = {},
                    fields = activeTab.query('field[hidden=false],hiddenfield'),
                    appCodeField = applicationAddEditView.down('#App_AppCode');
                for (var i = 0; i < fields.length; i++) serverRecord[fields[i].itemId] = Ext.isNumeric(fields[i].getValue()) ? fields[i].getValue() * 1 : fields[i].getValue();

                //This is for the checkboxgroup
                var fields2 = activeTab.query('checkboxgroup'), temp;
                for (var i = 0; i < fields2.length; i++) {
                    temp = fields2[i].getValue();
                    Ext.Object.each(temp, function (key, value, myself) {
                        serverRecord[fields2[i].itemId] = value;
                    });
                }

                serverRecord.App_AppCode = appCodeField.getValue();

                applicationAddEditView.mask('Saving Application');

                BIA.Ajax.request({
                    url: 'api/BIASecurity/AddEditApplication',
                    method: 'POST',
                    jsonData: serverRecord,
                    callback: function AddEditApplicationCallback(request, success, response) {
                        var applicationAddEditView = this.getApplicationAddEditView();
                        if (success) {
                            Ext.MessageBox.alert('Application Save Success', 'The server was saved successfully.', function () {
                                //if (this.applicationAddEditView()) {
                                //    var records = response.data;
                                //    if (records.length > 0) {
                                //        this.getApplicationAddEditView()['ApplicationId'] = records[0]['ApplicationId'];
                                //        this.getApplicationAddEditView()['ApplicationName'] = records[0]['ApplicationName'];
                                //    }
                                //    this.getApplicationAddEditView().close();
                                //}
                            }, this);
                        }
                        else {
                            Ext.MessageBox.alert('Application Save Unsuccess', 'The application was not saved, please try again later.');
                        }
                        if (applicationAddEditView && applicationAddEditView.isMasked()) applicationAddEditView.unmask();
                    },
                    scope: this
                });
            }
        }
    }
});