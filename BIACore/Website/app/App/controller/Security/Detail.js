Ext.define('App.controller.Security.Detail', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Desktop', selector: '[xtype="App-Desktop"]' }
    ],
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-Security-Detail"] clickDisplayField': {
                //click: me.History
            }
        });
    },
    History: function (field) {
        this.getDesktop().createWindow({
            xtype: 'App-module-SecurityHistory',
            data: field.up('[xtype="App-Security-Detail"]').record
        });
    }
});