Ext.define('App.desktop.Module', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-Desktop-Window',

    title: '',
    iconCls: '',
    hideFromStart: false,

    width: 800,
    height: 400,
    minimizable: true,
    maximizable: true,
    constrain: true,
    border: true,
    ghost: false,
    defaults: { border: false },
    layout: 'fit',

    items: [],

    init: function () { },

    getUrl: function () {
        var me = this,
            params = me.getParams() || {},
            url = me.xtype.replace('App-module-', '') + '!';

        for (var p in params) {
            if (params.hasOwnProperty(p)) {
                url += '/' + p + '=' + params[p];
            }
        }

        return url;
    },

    getParams: function () {
        return {};
    },


    listeners: {
        activate: function (win) {
            win.focused = true;
            win.btn.toggle(true);
        },
        close: function (win) {
            var btn = win.btn;
            delete win.btn;
            btn.ownerCt.remove(btn);
        },
        minimize: function (win) {
            win.focused = false;
            win.minimized = true;
            win.hide();
        },
        deactivate: function (win) {
            win.focused = false;
        }
    }
});