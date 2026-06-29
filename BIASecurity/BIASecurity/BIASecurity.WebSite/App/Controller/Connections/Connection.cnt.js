Ext.define('App.Controller.Connections.Connection', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'ConnectionUserAddEditView', selector: 'App-View-Connections-ConnectionUser-AddEditView' },
        { ref: 'ConnectionList', selector: 'App-View-Connections-Connection-List' },
        { ref: 'ConnectionAddEditView', selector: 'App-View-Connections-Connection-AddEditView' },
        { ref: 'ConnectionUserList', selector: 'App-View-ConnectionUser-List' },
        { ref: 'DatabaseList', selector: 'App-View-Database-List' },
        { ref: 'ServerList', selector: 'App-View-Server-List' },
        { ref: 'ServerSelect', selector: 'App-View-Connections-Connection-Component-ServerSelect #ServerId' },
        { ref: 'EnvironmentMismatchErrorText', selector: 'App-View-Connections-Connection-Component-EnvironmentMismatchErrorText' }
    ],
    init: function init() {
        this.control({
            'App-View-Connections-Connection-AddEditView': {
                beforerender: this.ConnectionAddEditViewBeforeRender
            },
            'App-View-Connections-Connection-View': {
                beforerender: this.ConnectionViewBeforeRender
            },
            'App-View-Connections-Connection-Component-ConnectionIdDisplay': {
                beforerender: this.ConnectionIdDisplayBeforeRender
            },
            'App-View-Connections-Connection-AddEditView field': {
                keyup: this.ConnectionFieldKeyUp
            },
            'App-View-Connections-Connection-AddEditView button#Save': {
                click: this.ConnectionSaveClick
            },
            'App-View-Connections-Connection-AddEditView button#Delete': {
                click: this.ConnectionDeleteClick
            },
            'App-View-Connections-Connection-Component-ShowInactiveToggle': {
                change: this.ConnectionFilterCmpChange
            },
            'App-View-Connections-Connection-Component-ShowEnvironmentMismatch': {
                change: this.ConnectionFilterCmpChange
            },
            'App-View-Connections-Connection-Component-EnvironmentFilter': {
                change: this.ConnectionFilterCmpChange
            },
            'App-View-Connections-Connection-AddEditView App-View-Connections-Connection-Component-LoginSelect #UserId': {
                select: this.ConnectionLoginUserIdSelect,
                change: this.DisplayEnvironmentMismatchError
            },
            'App-View-Connections-Connection-AddEditView App-View-Connections-Component-EnvironmentSelect #EnvironmentId': {
                change: this.DisplayEnvironmentMismatchError
            }
        });
    },
    ConnectionAddEditViewBeforeRender: function ConnectionAddEditViewBeforeRender(me) {
        if (!Ext.isEmpty(me.ConnectionId)) {
            me.store.getProxy().extraParams = { ConnectionId: me.ConnectionId };
            me.store.load();
        }
    },
    ConnectionViewBeforeRender: function ConnectionViewBeforeRender(me) {
        var fieldContainers = me.query('App-View-Connections-Component-FieldContainer');
        for (var i = 0; i < fieldContainers.length; i++) fieldContainers[i].setEditable(false);

        var buttonContainer = me.down('connectionsAddEditButtonContainer');
        if (buttonContainer) buttonContainer.hide();
    },
    ConnectionIdDisplayBeforeRender: function ConnectionIdDisplayBeforeRender(me) {
        var connectionAddEditView = this.getConnectionAddEditView();
        if (App.Utility.ConnectionSecurity.isConnectionAdmin() && connectionAddEditView && !Ext.isEmpty(connectionAddEditView.ConnectionId)) {
            me.down('field').setValue(connectionAddEditView.ConnectionId);
            me.show();
        }
        else me.hide();
    },
    ConnectionFieldKeyUp: function ConnectionFieldKeyUp(me, event, eOpts) {
        connectionAddEditView = this.getConnectionAddEditView();
        if (event.shiftKey && event.keyCode == event.ENTER && connectionAddEditView) this.ConnectionSaveClick(me);
    },
    ConnectionSaveClick: function ConnectionSaveClick(me) {
        if (App.Utility.ConnectionSecurity.isBIADeveloper()) {
            var connectionAddEditView = this.getConnectionAddEditView();
            if (connectionAddEditView) {
                var connectionRecord = {},
                    fields = connectionAddEditView.query('field[hidden=false],hiddenfield');
                for (var i = 0; i < fields.length; i++) connectionRecord[fields[i].itemId] = Ext.isNumeric(fields[i].getValue()) ? fields[i].getValue() * 1 : fields[i].getValue();

                //determine if the environments do not match
                if (fields[2].getDisplayValue().toLowerCase() != fields[5].getDisplayValue().substring(fields[5].getDisplayValue().lastIndexOf("_") + 1).toLowerCase()) {


                    Ext.MessageBox.show({
                        title: 'Environment Mismatch',
                        message: 'Are you sure you want to proceed? The environment does not match the login.',
                        fn: function ConnectionEnvMismatchConfirm(buttonId, text, eOpts) {
                            if (buttonId === 'ok' || buttonId === 'yes') {
                                this.UpdateConnectionDetail(connectionAddEditView, connectionRecord);
                            }
                        },

                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.WARNING,

                        scope: this
                    });

                    //Ext.MessageBox.confirm('Environment Mismatch', 'Are you sure you want to proceed? The environment does not match the login.', function (msgBoxText) {
                    //    if (msgBoxText == 'no') { return false; }
                    //    else {
                    //        this.UpdateConnectionDetail(connectionAddEditView, connectionRecord);
                    //    }
                    //}, this);
                }
                else {
                    this.UpdateConnectionDetail(connectionAddEditView, connectionRecord);
                }
                
            }
        }
    },

    ConnectionDeleteClick: function ConnectionDeleteClick(me, event, eOpts) {
        if (App.Utility.ConnectionSecurity.isBIADeveloper()) {
            var connectionAddEditView = this.getConnectionAddEditView();
            if (connectionAddEditView) {
                var connectionRecord = {},
                    fields = connectionAddEditView.query('field[hidden=false],hiddenfield');
                for (var i = 0; i < fields.length; i++) connectionRecord[fields[i].itemId] = Ext.isNumeric(fields[i].getValue()) ? fields[i].getValue() * 1 : fields[i].getValue();

                Ext.MessageBox.show({
                    title: 'Delete Connection?',
                    message: 'This will permanently delete the connection with no way to restore. Are you sure you want to proceed?',
                    fn: function ConnectionEnvMismatchConfirm(buttonId, text, eOpts) {
                        if (buttonId === 'ok' || buttonId === 'yes') {
                            this.DeleteConnectionDetail(connectionAddEditView, connectionRecord);
                        }
                    },

                    buttons: Ext.Msg.YESNO,
                    icon: Ext.Msg.WARNING,

                    scope: this
                });
            }
        }
    },

    UpdateConnectionDetail: function UpdateConnectionDetail(me, connectionRecord) {

        var connectionAddEditView = me; 
        if (!connectionAddEditView.isXType('App-View-Connections-Connection-AddEditView')) {
            connectionAddEditView = this.getConnectionAddEditView();
        }
           
        connectionAddEditView.mask('Saving Connection');

        BIA.Ajax.request({
            url: 'api/BIASecurity/AddEditConnection',
            method: 'POST',
            jsonData: connectionRecord,
            callback: function AddEditConnectionCallback(request, success, response) {
                var connectionsAddEditView = this.getConnectionAddEditView();
                if (success) {
                        Ext.MessageBox.alert('Connection Save Success', 'The connection was saved successfully.', function () {
                            if (this.getConnectionAddEditView()) this.getConnectionAddEditView().close();
                        }, this);
                }
                else {
                        Ext.MessageBox.alert('Connection Save UnSuccess', 'The connection was not saved, please try again later.');
                }
                if (connectionsAddEditView && connectionsAddEditView.isMasked()) connectionsAddEditView.unmask();
                },
                scope: this
            });
        
    },

    DeleteConnectionDetail: function DeleteConnectionDetail(me, connectionRecord) {

        var connectionAddEditView = me;
        if (!connectionAddEditView.isXType('App-View-Connections-Connection-AddEditView')) {
            connectionAddEditView = this.getConnectionAddEditView();
        }

        connectionAddEditView.mask('Deleting Connection');

        BIA.Ajax.request({
            url: 'api/BIASecurity/DeleteConnection',
            method: 'POST',
            jsonData: connectionRecord,
            callback: function DeleteConnectionCallback(request, success, response) {
                var connectionsAddEditView = this.getConnectionAddEditView();
                if (success) {
                    Ext.MessageBox.alert('Delete Connection Success', 'The connection was successfully deleted.', function () {
                        if (this.getConnectionAddEditView()) this.getConnectionAddEditView().close();
                    }, this);
                }
                else {
                    Ext.MessageBox.alert('Delete Connection Failure', 'The connection was not successfully deleted, please try again later.');
                }
                if (connectionsAddEditView && connectionsAddEditView.isMasked()) connectionsAddEditView.unmask();
            },
            scope: this
        });

    },
    
    ConnectionFilterCmpChange: function ConnectionFilterCmpChange(me) {
        var connectionList = this.getConnectionList();
        if (connectionList) connectionList.store.load();
    },
    ConnectionLoginUserIdSelect: function ConnectionLoginUserIdSelect(me, record, eOpts) {
        var serverSelect = this.getServerSelect();
        if (serverSelect) {
            var server = serverSelect.getSelectedRecord(), connectionWindow = this.getConnectionAddEditView(), mismatchErrorText = this.getEnvironmentMismatchErrorText();
            if (!Ext.isEmpty(server) &&
                connectionWindow && connectionWindow.environmentMismatchTest && !Ext.isEmpty(connectionWindow.environmentMismatchTest[server.get('Environment')]) &&
                mismatchErrorText
            ) {
                var mismatchTest = connectionWindow.environmentMismatchTest[server.get('Environment')],
                    testPassed = true;
                for (var i = 0; i < mismatchTest.tests.length; i++) {
                    if ((Ext.String.endsWith(server.Environment, mismatchTest.tests[i], true) && mismatchTest.match === true) ||
                        (!Ext.String.endsWith(server.Environment, mismatchTest.tests[i], true) && mismatchTest.match === false)) {
                        testPassed = false;
                        break;
                    }
                }
                mismatchErrorText.setVisible(!testPassed);
            }
        }
    },

    DisplayEnvironmentMismatchError: function DisplayEnvironmentMismatchError(me) {
        var connectionWindow = this.getConnectionAddEditView(), mismatchErrorText = this.getEnvironmentMismatchErrorText();
        var loginValue = connectionWindow.down('App-View-Connections-Connection-Component-LoginSelect').down('#UserId').getDisplayValue(),
            environmentValue = connectionWindow.down('App-View-Connections-Component-EnvironmentSelect').down('#EnvironmentId').getDisplayValue(),
            mismatchErrorText = this.getEnvironmentMismatchErrorText(),
            testPassed = true;

        var mismatchTest = connectionWindow.environmentMismatchTest[environmentValue];

        if (typeof mismatchTest !== 'undefined') {
            for (var i = 0; i < mismatchTest.tests.length; i++) {
                if ((Ext.String.endsWith(loginValue, mismatchTest.tests[i], true) && mismatchTest.match === true) ||
                    (!Ext.String.endsWith(loginValue, mismatchTest.tests[i], true) && mismatchTest.match === false)) {
                    testPassed = false;
                    break;
                }
            }
        }
        mismatchErrorText.setVisible(!testPassed);
    }
});