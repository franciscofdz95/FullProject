Ext.define('App.Controller.Connections.Server', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'ServerAddEditView', selector: 'App-View-Connections-Server-AddEditView' }//,
        //{ ref: 'ConnectionList', selector: 'App-View-Connection-List' },
        //{ ref: 'ConnectionUserList', selector: 'App-View-ConnectionUser-List' },
        //{ ref: 'DatabaseList', selector: 'App-View-Database-List' },
        //{ ref: 'ServerList', selector: 'App-View-Server-List' },
    ],

    init: function init() {
        this.control({
            'App-View-Connections-Server-AddEditView': {
                beforerender: this.ServerAddEditViewBeforeRender
            },
            'App-View-Connections-Server-AddEditView button#Save': {
                click: this.ServerSaveClick
            }
        });
    },
    ServerAddEditViewBeforeRender: function ServerAddEditViewBeforeRender(me) {
        if (!Ext.isEmpty(me.ServerId)) {
            me.store.getProxy().extraParams = { ServerId: me.ServerId };
            me.store.load();
        }
    },
    ServerSaveClick: function ServerSaveClick(me) {
        if (App.Utility.ConnectionSecurity.isConnectionAdmin()) {
            var serverAddEditView = this.getServerAddEditView();
            if (serverAddEditView) {
                var serverRecord = {},
                    fields = serverAddEditView.query('field[hidden=false],hiddenfield');
                for (var i = 0; i < fields.length; i++) serverRecord[fields[i].itemId] = Ext.isNumeric(fields[i].getValue()) ? fields[i].getValue() * 1 : fields[i].getValue();

                serverAddEditView.mask('Saving Server');

                BIA.Ajax.request({
                    url: 'api/BIASecurity/AddEditServer',
                    method: 'POST',
                    jsonData: serverRecord,
                    callback: function AddEditServerCallback(request, success, response) {
                        var serversAddEditView = this.getServerAddEditView();
                        if (success) {
                            Ext.MessageBox.alert('Server Save Success', 'The server was saved successfully.', function () {
                                if (this.getServerAddEditView()) {
                                    var records = response.data;
                                    if (records.length > 0) {
                                        this.getServerAddEditView()['ServerId'] = records[0]['ServerId'];
                                        this.getServerAddEditView()['ServerName'] = records[0]['ServerName'];
                                    }
                                    this.getServerAddEditView().close();
                                }
                            }, this);
                        }
                        else {
                            Ext.MessageBox.alert('Server Save UnSuccess', 'The server was not saved, please try again later.');
                        }
                        if (serversAddEditView && serversAddEditView.isMasked()) serversAddEditView.unmask();
                    },
                    scope: this
                });
            }
        }
    }
});