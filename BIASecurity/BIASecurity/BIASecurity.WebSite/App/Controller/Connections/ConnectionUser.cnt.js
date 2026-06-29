Ext.define('App.Controller.Connections.ConnectionUser', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'ConnectionUserAddEditView', selector: 'App-View-Connections-ConnectionUser-AddEditView' },
        { ref: 'ConnectionList', selector: 'App-View-Connection-List' },
        { ref: 'ConnectionUserList', selector: 'App-View-ConnectionUser-List' },
        { ref: 'DatabaseList', selector: 'App-View-Database-List' },
        { ref: 'ServerList', selector: 'App-View-Server-List' },
    ],

    init: function init() {
        this.control({
            'App-View-Connections-ConnectionUser-AddEditView': {
                beforerender: this.ConnectionUserAddEditViewBeforeRender
            },
            'App-View-Connections-ConnectionUser-Component-UsernameSelect': {
                beforerender: this.ConnectionUserUsernameSelectBeforeRender,
                storebeforeload: this.ConnectionUserUsernameSelectStoreBeforeLoad
            },
            'App-View-Connections-ConnectionUser-AddEditView button#Save': {
                beforerender: this.ConnectionUserButtonContainerSaveBeforeRender,
                click: this.ConnectionUserButtonContainerSaveClick
            }
        });
    },
    ConnectionUserAddEditViewBeforeRender: function ConnectionUserAddEditViewBeforeRender(me) {
        me.add(me.purposeItemConfig[me.purpose]);
        if (!Ext.isEmpty(me.UserId)) {
            me.store.getProxy().extraParams = { userId: me.UserId };
            me.store.load();
        }
    },
    ConnectionUserUsernameSelectBeforeRender: function ConnectionUserUsernameSelectBeforeRender(me) {
        var win = me.up('window[UserId]');
        if (win) {
            me.addListener({
                storeload: {
                    fn: function ConnectionUserUsernameSelectStoreLoad(win, me, store, records, success) {
                        if (success) me.select(win.UserId);
                    },
                    single: true,
                    args: [win]
                }
            });
        }
        me.store.load();
    },
    ConnectionUserUsernameSelectStoreBeforeLoad: function ConnectionUserUsernameSelectStoreBeforeLoad(me, store) {
        var win = me.up('window[UserId]');
        if (win) {
            store.getProxy().extraParams = { UserId: win.UserId };
        }
    },
    ConnectionUserButtonContainerSaveBeforeRender: function ConnectionUserButtonContainerSaveBeforeRender(me) {
        var addEditView = this.getConnectionUserAddEditView();
        if (addEditView) {
            var fields = addEditView.query('field');
            for (var i = 0; i < fields.length; i++) fields[i].addListener({ fn: this.ConnectionUserButtonContainerSaveActiveStateUpdate, args: [me], scope: this, buffer: 300 });
        }
    },
    ConnectionUserButtonContainerSaveActiveStateUpdate: function ConnectionUserButtonContainerSaveActiveStateUpdate(me) {
        var addEditView = this.getConnectionUserAddEditView();
        if (addEditView) {
            var fields = addEditView.query('field');
            if (fields.every(function (f) { return Ext.isEmpty(f.getValue()); }) && fields.length > 0) me.setDisabled(false);
            else me.setDisabled(true);
        }
    },
    ConnectionUserButtonContainerSaveClick: function ConnectionUserButtonContainerSaveClick(me) {

        var controller = this;
        Ext.MessageBox.show({
            title: 'Update Login Confirmation',
            message: 'Are you sure you want to update this Login? This will change all connections using this login.',
            fn: function ConnectionUserButtonContainerSaveConfirm(buttonId, text, eOpts) {
                if (buttonId === 'ok' || buttonId === 'yes') {
                    var win = me.up('App-View-Connections-ConnectionUser-AddEditView');
                    if (win) controller.ConnectionUserAddEditViewSave(win);
                }
            },

            buttons: Ext.Msg.OKCANCEL,
            icon:Ext.Msg.WARNING
        });
        //Ext.MessageBox.confirm('Update Login Confirm',
        //    'Are you sure you want to update this Login? This will change any connection using this login.',
        //    function ConnectionUserButtonContainerSaveConfirm(buttonId, text, eOpts) {
        //        if (buttonId === 'ok' || buttonId === 'yes') {
        //            var win = me.up('App-View-Connections-ConnectionUser-AddEditView');
        //            if (win) this.ConnectionUserAddEditViewSave(win);
        //        }
        //    }, this);
    },
    ConnectionUserAddEditViewSave: function ConnectionUserAddEditViewSave(me) {
        if (!me.isXType('App-View-Connections-ConnectionUser-AddEditView')) {
            if (me.up('App-View-Connections-ConnectionUser-AddEditView')) me = me.up('App-View-Connections-ConnectionUser-AddEditView');
            else if (me.down('App-View-Connections-ConnectionUser-AddEditView')) me = me.down('App-View-Connections-ConnectionUser-AddEditView');
            else return;
        }

        me.mask('Updating');

        var usernameSelect = me.down('App-View-Connections-ConnectionUser-Component-UsernameSelect'),
            usernameEntry = me.down('App-View-Connections-ConnectionUser-Component-UsernameEntry'),
            passwordEntry = me.down('App-View-Connections-ConnectionUser-Component-AuthStringEntry'),
            activeEntry = me.down('App-View-Connections-ConnectionUser-Component-ActiveFlag #Active'),
            jsonData = {
                username: '',
                authString: '',
                active: 1
            };

        if (usernameSelect) jsonData.username = usernameSelect.getSelectedRecord().get('Display');
        else if (usernameEntry) jsonData.username = usernameEntry.getValue();
        if (passwordEntry) jsonData.authString = passwordEntry.getValue();
        if (activeEntry) jsonData.active = activeEntry.getValue() ? 1 : 0;

        BIA.Ajax.request({
            url: 'api/BIASecurity/AddEditConnectionUser',
            method: 'POST',
            async: true,
            jsonData: jsonData,
            callback: function AddEditConnectionUserCallback(request, success, response) {
                if (!success) {
                    Ext.MessageBox.alert('Update Login Fail', 'Login update failed, please try again later', function () { me.close(); }, this);
                }
                else {
                    Ext.MessageBox.alert('Update Login Success', 'Login update completed successfully.', function () {
                        var records = response.data;
                        if (records.length > 0) {
                            me['Username'] = records[0]['Username'];
                        }
                        me.close();
                    }, this);
                }
            },
            scope: this
        });
    }
});