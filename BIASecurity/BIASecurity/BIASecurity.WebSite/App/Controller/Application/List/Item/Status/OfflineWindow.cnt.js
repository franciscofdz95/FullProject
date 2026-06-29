Ext.define('App.Controller.Application.List.Item.Status.OfflineWindow', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        var me = this;

        me.control({
            'App-View-Application-List-Item-Status-OfflineWindow': {
                beforerender: this.BeforeRender
            },
            'App-View-Application-List-Item-Status-OfflineWindow #saveButton': {
                click: this.SaveClick
            },
            'App-View-Application-List-Item-Status-OfflineWindow #cancelButton': {
                click: this.CancelClick
            }
        });
        me.listen({});
    },
    BeforeRender: function BeforeRender(me) {
        if (me.itemRec)
            me.down('#activeMsg').setValue(me.itemRec['Active_Msg']);
    },
    SaveClick: function SaveClick(me) {
        var win = me.up('window'),
            activeMsg = win.down('#activeMsg');

        if (activeMsg.isValid) {
            win.saveFn(win.itemIcon, win.itemRec, 'Active', 0, activeMsg.getValue());
            win.close();
        }
    },
    CancelClick: function CancelClick(me) {
        me.up('window').close();
    }
});