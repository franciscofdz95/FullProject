Ext.define('App.Controller.Application.AddEditView.AccessGeos.Display', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Application-AddEditView-AccessGeos-Display': {
                beforerender: this.BeforeRender
            },
            'App-View-Application-AddEditView-AccessGeos-Display checkbox': {
                change: this.CheckboxChange
            }
        });
    },
    BeforeRender: function BeforeRender(me) {
        var checkbox = me.down('checkbox');

        if (me.application.Selected) {
            checkbox.suspendEvent('change');
            checkbox.setValue(true);
            checkbox.resumeEvent('change');
        }
    },
    CheckboxChange: function CheckboxChange(me, value) {
        var container = me.up('[application]'),
            appCode = me.up('[appCode]');

        BIA.Ajax.request({
            url: 'api/BIASecurity/DelsertAppGeos',
            method: 'POST',
            jsonData: {
                appCode: appCode.appCode,
                businessUnitId: container.application.businessUnitId,
                geoGroupCode: container.application.geoGroupCode,
                geoCode: container.application.geoCode,
                action: value ? 'Insert' : 'Delete'
            },
            failure: function (response, request) {
                Ext.Msg.alert('Failed', 'Save failed');
            },
            scope: this
        });
    }
});