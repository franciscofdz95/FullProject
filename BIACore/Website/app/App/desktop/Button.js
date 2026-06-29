Ext.define('App.desktop.Button', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Button' : 'Ext.button.Button',
    alias: 'widget.App-Desktop-Button',

    enableToggle: true,
    toggleGroup: 'all',
    textAlign: 'left',
    width: 140,

    listeners: {
        beforedestroy: function (btn) {
            delete btn.win;
        },
        click: function (btn) {
            var win = btn.win;
            if (win.minimized) {
                win.minimized = false;
                win.show();
            } else if (win.focused) {
                win.minimized = true;
                win.hide();
            } else {
                win.show();
            }
        }
    }
});