Ext.define('App.Controller.Access.Request.Window', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Access-Request-Window': {
                beforerender: this.BeforeRender
            },
            'App-View-Access-Request-Window #applicationField': {
                change: this.ApplicationChange,
                focus: this.ApplicationFocus
            },
            'App-View-Access-Request-Window #confirmButton': {
                click: this.ConfirmClick
            },
            'App-View-Access-Request-Window #cancelButton': {
                click: this.CancelClick
            },
            'App-View-Access-Request-Window #reasonField': {
                focus: this.ReasonFocus
            },
            'App-View-Access-Request-Window #accessLevelField': {
                focus: this.AccessLevelFocus
            }
        });
    },
    BeforeRender: function BeforeRender(me) {
        var userField = me.down('#userField'),
            applicationField = me.down('#applicationField'),
            accessLevelField = me.down('#accessLevelField');

        //if (me.userId) {
        userField.getStore().on({
            load: {
                single: true,
                scope: this,
                fn: function () {
                    userField.setValue(userField.getStore().getAt(0).get('Id'));
                }
            }
        });
        if (me.userId) userField.doQuery(me.loginId);
        else userField.doQuery(BIACore.Security.User.userId);
        //}


        if (me.appCode) {
            applicationField.getStore().on({
                load: {
                    single: true,
                    scope: this,
                    fn: function () {
                        applicationField.setValue(applicationField.getStore().getAt(0).get('Id'));
                    }
                }
            });
            applicationField.doQuery(me.appCode);
        }

        accessLevelField.setValue('User');
        if (!BIACore.Security.User.isSA()) {
            accessLevelField.setDisabled(true);
        }
    },
    ApplicationChange: function ApplicationChange(me, value) {
        var win = me.up('window'),
            geoField = win.down('#geoField');

        if (value != null) {
            geoField.getStore().getProxy().extraParams = Ext.apply(geoField.getStore().getProxy().extraParams, {
                appCode: value
            });
            geoField.getStore().load();
        } else {
            geoField.setValue(null);
        }

        geoField.setDisabled(value == null);
    },
    ConfirmClick: function ConfirmClick(me) {
        var win = me.up('window'),
            userField = win.down('#userField'),
            applicationField = win.down('#applicationField'),
            geoField = win.down('#geoField'),
            accessLevelField = win.down('#accessLevelField'),
            reasonField = win.down('#reasonField'),
            fields = win.query('field'),
            isValid = true;

        Ext.each(fields, function (a) { if (!a.isValid()) isValid = false; });

        if (isValid && geoField.getValue() != null) {
            win.setLoading(true);
            BIA.Ajax.request({
                url: 'api/BIASecurity/NewAccessRequest',
                jsonData: {
                    requestUserId: userField.getSelection().get('ADID'),
                    appCode: applicationField.getValue(),
                    geoListingID: geoField.getValue(),
                    securityLevel: accessLevelField.getValue(),
                    requestReason: reasonField.getValue()
                },
                callback: function callback(request, success, response) {
                    if (!success)
                        Ext.Msg.alert('Failed', 'Save failed');
                    else
                        Ext.Msg.alert('Success', 'Request submitted');

                    if (win.view) {
                        win.view.store.load();
                    } else if (win.content) {
                        var view = win.content.down('pagedlist');
                        if (view)
                            view.store.load();
                    }

                    win.setLoading(false);
                    win.close();
                }
            });
        }
    },
    CancelClick: function CancelClick(me) {
        me.up('window').close();
    },
    ApplicationFocus: function ApplicaionFunction(me) {
        var reqWindow = me.up('App-View-Access-Request-Window'),
            helpField = reqWindow.down('#FieldHelpHint');

        helpField.setHtml("<b>Application Field:</b> Please select the application using either the drop-down or by simply typing the application name or application code.");
    },
    AccessLevelFocus: function AccessLevelFocus(me) {
        var reqWindow = me.up('App-View-Access-Request-Window'),
            helpField = reqWindow.down('#FieldHelpHint');

        helpField.setHtml("<b>Access Level:</b> Access levels are used to determine permissions within an application, the default is User and is appropriate for all end-users. Admin should only be assigned to application administrators and gives them permission to approve and deny access requests. SA level is only appropriate for application development staff.");
    },
    ReasonFocus: function ReasonFocus(me) {
        var reqWindow = me.up('App-View-Access-Request-Window'),
            helpField = reqWindow.down('#FieldHelpHint');

        helpField.setHtml("<b>Reason:</b> The business reason field should be filled in with a valid business justification for your access to the application. One word reasons will be rejected. This is an example of a good reason: <i>Access to {APP} is required as part of my job responsibilities as an Account Executive.</i>");
    }
});