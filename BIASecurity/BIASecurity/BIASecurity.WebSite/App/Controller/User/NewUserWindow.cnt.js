Ext.define('App.Controller.User.NewUserWindow', {
    extend: 'Ext.app.Controller',
    init: function init() {
        var me = this;

        me.control({
            'App-View-User-NewUserWindow #searchButton': {
                click: this.SearchClick
            },
            'App-View-User-NewUserWindow #cancelButton': {
                click: this.CancelClick
            },
            'App-View-User-NewUserWindow #addButton': {
                click: this.AddClick
            }
        });
    },
    SearchClick: function SearchClick(me) {
        var win = me.up('window'),
            searchField = win.down('#searchField'),
            errorMessage = win.down('#errorMessage');

        if (searchField.isValid()) {
            win.setLoading(true);
            errorMessage.setHidden(true);

            BIA.Ajax.request({
                url: 'api/BIASecurity/NewUserSearch',
                jsonData: {
                    query: searchField.getValue()
                },
                callback: function callback(request, success, response) {
                    if (!success) {
                        errorMessage.setText('Search failed please try again.');
                        errorMessage.setHidden(false);
                        win.setLoading(false);
                    } else {
                        var status = response.responseJSON.status;

                        if (status == 'Existing') {
                            var userId = response.responseJSON.userId;
                            var adId = response.responseJSON.adId;

                            Ext.Msg.confirm('Existing User', 'This user already exists. Would you like to view their profile?', function (buttonId) {
                                if (buttonId == 'yes') {
                                    Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', {
                                        xtype: 'App-View-User-AddEditView',
                                        userId: userId,
                                        ADID: adId,
                                        formType: 'View'
                                    });
                                }
                            });

                            win.close();
                        } else if (status == 'NotFound') {
                            errorMessage.setText('ADID not found please try again.');
                            errorMessage.setHidden(false);
                            win.setLoading(false);
                        } else if (status == 'Found') {
                            var searchContainer = win.down('#searchContainer'),
                                userContainer = win.down('#userContainer'),
                                fields = userContainer.query('field[dataField]'),
                                searchButton = win.down('#searchButton'),
                                addButton = win.down('#addButton');

                            Ext.each(fields, function (a) {
                                if (!Ext.isEmpty(response.responseJSON.user[a.dataField]))
                                    a.setValue(response.responseJSON.user[a.dataField]);
                            }, this);

                            searchContainer.setHidden(true);
                            userContainer.setHidden(false);
                            searchButton.setHidden(true);
                            addButton.setHidden(false);
                            win.setLoading(false);
                        }
                    }
                }
            });
        }
    },
    AddClick: function AddClick(me) {
        var win = me.up('window'),
            searchField = win.down('#searchField');

        win.setLoading(true);

        BIA.Ajax.request({
            url: 'api/BIASecurity/AddUser',
            jsonData: {
                query: searchField.getValue()
            },
            callback: function callback(request, success, response) {
                if (!success) {
                    Ext.Msg.alert('Failed', 'Save failed');
                } else {
                    Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', {
                        xtype: 'App-View-User-AddEditView',
                        userId: response.responseJSON.data[0].UserId,
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