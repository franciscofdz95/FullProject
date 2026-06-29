Ext.define('App.controller.UserAccessDefinition', {
    extend: 'Ext.app.Controller',
    refs: [
        {
            ref: 'UserAccess',
            selector: 'App.View.Component.UserAccess.UserAccessDefinition'
        }
    ],
    init: function () {
        this.control({
            'App-View-Component-UserAccess-UserAccessDefinition #userAccessDefSubmit': {
                click: this.saveUserAccessConfiguration
            },
            'App-View-Component-UserAccess-UserAccessDefinition #usrSelection': {
                change: this.usrSelectionChange
            },
            'App-View-Component-UserAccess-UserAccessDefinition #userAccessDefClose': {
                click: this.closeWindow
            },
            'App-View-Component-UserAccess-UserAccessDefinition': {
                show: this.windowShow              
            }
        });
    },
    saveUserAccessConfiguration: function (btn) {
        var win = btn.up('window'), frm = win.down('form');
        if (!frm.isValid()) {
            return true;
        }
        var frmValues = frm.getValues();
        var param = {
            User: frmValues.User,
            EA_ProfileId: frm.down('#UsrProfileID').value,
            EA_E2K_UserID: win.down('#e2kuserid').value
        }
        Ext.Ajax.request({
            scope: this,
            url: 'api/BIASecurityFlote/SaveUserAccess',
            method: 'POST',
            params: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            },
            callback: function (options, success, resp) {
                if (!resp || !resp.responseText)
                    return;
                var response = JSON.parse(resp.responseText);
                if (success) {
                    Ext.MessageBox.alert('Extended Attributes Permissions', 'Extended Attributes for Flote sucessfully updated for user ' + frm.down('#usrSelection').getDisplayValue() + ' [' + frmValues.User + ']');
                } else {
                    Ext.MessageBox.alert(response.Message, response.ExceptionMessage);
                }
            }


        });
    },
    usrSelectionChange: function (combo, newVal, oldVal) {
        if (Ext.isEmpty(newVal)) {
            return true;
        }
        if (newVal.length != 7) {
            return true;
        }
        var win = combo.up('window');
        combo.suspendEvents();
        win.down('form').getForm().reset();
        combo.setValue(newVal);
        combo.resumeEvents();
        win.setTitle('Modify Extended Attributes for ' + combo.getDisplayValue() + ' [' + newVal + '].');
        var jsonData = {
            User: newVal
        };
        var myComboBox = Ext.ComponentQuery.query('#UsrProfileID')[0],
            e2kUserId = win.down('#e2kuserid');
        myComboBox.setValue(1);

        Ext.Ajax.request({
            scope: this,
            url: 'api/BIASecurityFlote/ReadProfile',
            method: 'POST',
            params: JSON.stringify(jsonData),
            headers: {
                "Content-Type": "application/json"
            },
            callback: function (options, success, resp) {
                if (success) {

                    if (JSON.parse(resp.responseText).data.length > 0) {
                        var eaprofiletableread = JSON.parse(resp.responseText).data[0];                         
                        myComboBox.setValue(eaprofiletableread.EA_ProfileId);
                        e2kUserId.setValue(eaprofiletableread.EA_E2K_UserID);
                    }
                } else {
                    BIACore.Exception(resp.responseText);
                    BIACore.Message(resp);
                }
            }
        });
        
    },    
    closeWindow: function (btn) {
        btn.up('window').close();
    },
    windowShow: function (window) {        
       
        if (window.eaId !== undefined && window.eaId !== null) {
            var jsonData = {
                query: window.eaId
            };
            window.down('#usrSelection').forceSelection = false;
            Ext.Ajax.request({
                scope: this,
                url: 'api/BIASecurityFlote/GetUserList',
                method: 'POST',
                params: JSON.stringify(jsonData),
                headers: {
                    "Content-Type": "application/json"
                },
                callback: function (options, success, resp) {
                    if (success) {
                        window.down('#usrSelection').setStore(Ext.create('Ext.data.Store', {
                            fields: ['ADID', 'FirstName', 'LastName'],
                            data: JSON.parse(resp.responseText).data[0]
                        }));
                        window.down('#usrSelection').setValue(JSON.parse(resp.responseText).data[0])
                    } else {
                        BIACore.Exception(resp.responseText);
                        BIACore.Message(resp);
                    }
                    window.down('#usrSelection').forceSelection = true;
                }
            });
        }
    }
});