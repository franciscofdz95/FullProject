Ext.define('App.Controller.Connections.Database', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'DatabaseAddEditView', selector: 'App-View-Connections-Database-AddEditView' },
        { ref: 'ConnectionList', selector: 'App-View-Connection-List' },
        { ref: 'ConnectionUserList', selector: 'App-View-ConnectionUser-List' },
        { ref: 'DatabaseList', selector: 'App-View-Database-List' },
        { ref: 'ServerList', selector: 'App-View-Server-List' },
    ],

    init: function init() {
        this.control({
            'App-View-Connections-Database-AddEditView': {
                beforerender: this.DatabaseAddEditViewBeforeRender
            },
            'App-View-Connections-Database-AddEditView button#Save': {
                click: this.DatabaseSaveClick
            }
        });
    },
    DatabaseAddEditViewBeforeRender: function DatabaseAddEditViewBeforeRender(me) {
        if (!Ext.isEmpty(me.DatabaseId)) {
            me.store.getProxy().extraParams = { DatabaseId: me.DatabaseId };
            me.store.load();
        }
    },
    DatabaseSaveClick: function DatabaseSaveClick(me) {
        if (App.Utility.ConnectionSecurity.isConnectionAdmin()) {
            var databaseAddEditView = this.getDatabaseAddEditView();
            if (databaseAddEditView) {
                var databaseRecord = {},
                    fields = databaseAddEditView.query('field[hidden=false],hiddenfield');
                for (var i = 0; i < fields.length; i++) databaseRecord[fields[i].itemId] = Ext.isNumeric(fields[i].getValue()) ? fields[i].getValue() * 1 : fields[i].getValue();

                databaseAddEditView.mask('Saving Database');

                BIA.Ajax.request({
                    url: 'api/BIASecurity/AddEditDatabase',
                    method: 'POST',
                    jsonData: databaseRecord,
                    callback: function AddEditDatabaseCallback(request, success, response) {
                        var databasesAddEditView = this.getDatabaseAddEditView();
                        if (success) {
                            Ext.MessageBox.alert('Database Save Success', 'The database was saved successfully.', function () {
                                if (this.getDatabaseAddEditView()) {
                                    var records = response.data;
                                    if (records.length > 0) {
                                        this.getDatabaseAddEditView()['DatabaseId'] = records[0]['DatabaseId'];
                                        this.getDatabaseAddEditView()['DatabaseName'] = records[0]['DatabaseName'];
                                    }
                                    this.getDatabaseAddEditView().close();
                                }
                            }, this);
                        }
                        else {
                            Ext.MessageBox.alert('Database Save UnSuccess', 'The database was not saved, please try again later.');
                        }
                        if (databasesAddEditView && databasesAddEditView.isMasked()) databasesAddEditView.unmask();
                    },
                    scope: this
                });
            }
        }
    }
});