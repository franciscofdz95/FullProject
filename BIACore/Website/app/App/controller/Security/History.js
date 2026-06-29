Ext.define('App.controller.Security.History', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Desktop', selector: '[xtype="App-Desktop"]' }
    ],
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-Security-History"]': {
                //afterrender: me.TransactionId,
                celldblclick: me.Detail
            }
        });
    },
    TransactionId: function (grid) {
        if (grid.TransactionId) {
            grid.getStore().getProxy().setExtraParam('TransactionId', grid.TransactionId);
            grid.Reload();
        }
    },
    Detail: function (table, td, cellIndex, record) {
        this.getDesktop().createWindow({ xtype: 'App-module-SecurityDetail', data: record });
    }
});