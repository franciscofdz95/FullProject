Ext.define('App.Controller.Access.ActionWindow', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Access-ActionWindow': {
                beforerender: this.BeforeRender
            },
            'App-View-Access-ActionWindow #confirmButton': {
                click: this.ConfirmClick
            },
            'App-View-Access-ActionWindow #cancelButton': {
                click: this.CancelClick
            }
        });
    },
    BeforeRender: function BeforeRender(me) {
        var userContainer = me.down('App-View-Access-ActionWindow-User'),
            fields = me.query('field[dataField]'),
            actionMessage = me.down('#actionMessage'),
            confirmButton = me.down('#confirmButton'),
            reasonField = me.down('#reasonField');

        userContainer.store.getProxy().extraParams = { userId: me.access.SecUserId };
        userContainer.store.load();

        Ext.each(fields, function (a) {
            if (!Ext.isEmpty(me.access[a.dataField]))
                a.setValue(me.access[a.dataField]);
            else if (a.hideOnNull === true)
                a.hide();
        }, this);

        actionMessage.setText('Are you sure you want to ' + me.action.toLowerCase() + ' this access?');
        confirmButton.setText(me.action + ' Access');
        reasonField.setHidden(me.action == 'Approve');

        if (me.action == 'Remove')
            me.setTitle('Remove Access');
        else
            me.setTitle(me.action + ' Access Request');
    },
    ConfirmClick: function ConfirmClick(me) {
        var win = me.up('window'),
            reasonField = win.down('#reasonField');

        if (win.action == 'Approve' || reasonField.isValid()) {
            BIA.Ajax.request({
                url: 'api/BIASecurity/AccessAction',
                jsonData: {
                    action: win.action,
                    accessId: win.access.AccessId,
                    reason: reasonField.getValue()
                },
                callback: function callback(request, success, response) {
                    if (!success)
                        Ext.Msg.alert('Failed', 'Save failed');

                    win.view.store.load();
                    win.close();
                }
            });
        }
    },
    CancelClick: function CancelClick(me) {
        me.up('window').close();
    }
});