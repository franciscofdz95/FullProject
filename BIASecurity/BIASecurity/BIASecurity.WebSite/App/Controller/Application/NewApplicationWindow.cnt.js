Ext.define('App.Controller.Application.NewApplicationWindow', {
    extend: 'Ext.app.Controller',

    init: function init() {

        var me = this;

        me.control({
            'App-View-Application-NewApplicationWindow #cancelButton': {
                click: this.CancelClick
            },
            'App-View-Application-NewApplicationWindow #addButton': {
                click: this.AddClick
            }
        });
    },
    
    AddClick: function AddClick(me) {
        var win = me.up('window'),
            appCodeField = win.down('#appCode'),
            appNameField = win.down('#appName');

        win.setLoading(true);

        BIA.Ajax.request({
            url: 'api/BIASecurity/AddApplication',
            jsonData: {
                App_AppCode: appCodeField.getValue(),
                App_Name: appNameField.getValue()
            },
            callback: function callback(request, success, response) {
                if (!success) {
                    Ext.Msg.alert('Failed', 'Save failed/Duplicate AppCode');
                } else {
                    Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', {
                        xtype: 'App-View-Application-AddEditView',
                        appCode: appCodeField.getValue(),
                        formType: 'View'
                    });
                }

                win.close();
            }
        });
    },
    CancelClick: function CancelClick(me) {
        me.up('window').close();
    }
});