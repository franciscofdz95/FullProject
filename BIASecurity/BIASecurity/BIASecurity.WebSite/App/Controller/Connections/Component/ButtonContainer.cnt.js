Ext.define('App.Controller.Connections.Component.ButtonContainer', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'connectionsAddEditButtonContainer #Cancel': {
                click: this.ConnectionCancelClick
            },
            'connectionsAddEditButtonContainer': {
                beforerender: this.DeleteBeforeRender
            }
        });
    },
    ConnectionCancelClick: function ConnectionCancelClick(me) {
        var addEditView = me.up('App-View-Connections-Component-AddEditViewWindow');
        if (addEditView) addEditView.close();
    },

    //show/hide delete button based on the purpose of the window and if the window wants to show the delete option at all
    DeleteBeforeRender: function DeleteBeforeRender(me) {
        var window = me.up('window');
        var deleteButton = me.down('#Delete');

        if (window && deleteButton && window['purpose'] && me['show_delete']) {
            switch (window['purpose']) {
                case 'Edit':
                    deleteButton.setHidden(false);
                    break;
                default:
                    deleteButton.setHidden(true);
                    break;
            }
        }
        else if (deleteButton) {
            deleteButton.setHidden(true);
        }
    }
});