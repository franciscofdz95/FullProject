Ext.define('App.controller.Browser.Tab', {
    extend: 'Ext.app.Controller',
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-module-Browser"] tabpanel grid,graph': {
                activate: me.Activate
            }
        });
    },
    Activate: function (item) {
        if (arguments.length > 1 && item.Reload) {
            item.Reload();
        }
    }
});