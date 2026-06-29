Ext.define('App.Controller.Connections.Component.AddEditViewWindow', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'viewport', selector: 'viewport' },
        { ref: 'AddEditViewWindow', selector: 'App-View-Connections-Connection-AddEditView' }
    ],
    init: function init() {
        this.control({
            'App-View-Connections-Component-AddEditViewWindow': {
                beforerender: this.AddEditViewWindowBeforeRender,
                boxready: this.AddEditViewWindowBoxReady
            },
            'App-View-Connections-Component-AddEditViewWindow connectionsComboBox': {
                storeload: { fn: this.AddEditViewWindowConnectionsComboBoxStoreLoad, delay: 25 }
                //storebindupdate: { fn: this.AddEditViewWindowConnectionsComboBoxStoreBindUpdate, delay: 25 }
            },
            'App-View-Connections-Component-AddEditViewWindow connectionsAddEditButtonContainer button#Cancel': {
                click: this.AddEditViewWindowCancelButtonClick
            },


            //when these windows are closed, see if there is an ID
            'App-View-Connections-Server-AddEditView': {
                close: this.FieldWindowCloseServer
            },
            'App-View-Connections-Database-AddEditView': {
                close: this.FieldWindowCloseDatabase
            },
            'App-View-Connections-ConnectionUser-AddEditView': {
                close: this.FieldWindowCloseConnectionUser
            }
        });
    },
    AddEditViewWindowBeforeRender: function AddEditViewWindowBeforeRender(me) {

        var fieldContainers = me.query('App-View-Connections-Component-FieldContainer');
        var buttonContainer = me.down('connectionsAddEditButtonContainer');

        switch (me.purpose) {
            case 'View':
                if (buttonContainer) buttonContainer.hide();
                for (var i = 0; i < fieldContainers.length; i++) fieldContainers[i].setEditable(false);
                break;
            default:
                if (buttonContainer) buttonContainer.show();
                for (var i = 0; i < fieldContainers.length; i++) fieldContainers[i].setEditable(true);
                break;
        }
    },
    AddEditViewWindowBoxReady: function AddEditViewWindowBoxReady(me) {
        if (me.purpose != 'Add') {
            var comboBoxes = me.query('connectionsComboBox'), loaded = true;
            for (var i = 0; i < comboBoxes.length; i++) if (!comboBoxes[i].store.isLoaded()) { loaded = false; break; }

            if (loaded === false) me.mask('Loading');
        }
    },
    AddEditViewWindowConnectionsComboBoxStoreLoad: function AddEditViewWindowConnectionsComboBoxStoreLoad(me) {
        var addEditViewWindow = me.up('App-View-Connections-Component-AddEditViewWindow');
        if (addEditViewWindow) {
            var comboBoxes = addEditViewWindow.query('connectionsComboBox'), loaded = true;
            for (var i = 0; i < comboBoxes.length; i++) if (!comboBoxes[i].store.isLoaded()) { loaded = false; break; }

            if (loaded === true && addEditViewWindow.isMasked()) addEditViewWindow.unmask();
        }
    },
    AddEditViewWindowCancelButtonClick: function AddEditViewWindowCancelButtonClick(me) {
        var win = me.up('App-View-Connections-Component-AddEditViewWindow');
        if (win) win.close();
    },

    //listen to see if we created server
    FieldWindowCloseServer: function FieldWindowCloseServer(me) {
        AddEditViewWindow = this.getAddEditViewWindow();
        if (AddEditViewWindow) {
            AddEditViewWindow.down('App-View-Connections-Connection-Component-ServerSelect').down('combobox').setStoreValue(me['ServerId'], me['ServerName']);
        }
    },

    //listen to see if we created database
    FieldWindowCloseDatabase: function FieldWindowCloseDatabase(me) {
        AddEditViewWindow = this.getAddEditViewWindow();
        if (AddEditViewWindow) {
            AddEditViewWindow.down('App-View-Connections-Connection-Component-DatabaseSelect').down('combobox').setStoreValue(me['DatabaseId'], me['DatabaseName']);
        }
    },

    //listen to see if we created username
    FieldWindowCloseConnectionUser: function FieldWindowCloseConnectionUser(me) {
        AddEditViewWindow = this.getAddEditViewWindow();
        if (AddEditViewWindow) {
            AddEditViewWindow.down('App-View-Connections-Connection-Component-LoginSelect').down('combobox').setStoreValue(me['Username'], me['Username']);
        }
    }
});