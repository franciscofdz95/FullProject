Ext.define('App.Controller.Access.Request.UserGeo', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Access-Request-UserGeo': {
                beforerender: this.BeforeRender,
                storeload: this.StoreLoad
            },
            'App-View-Access-Request-Window #userField': {
                select: this.UserChange
            }
        });
    },
    BeforeRender: function BeforeRender(me) {
        var win = me.up('window');

        me.store.getProxy().extraParams = { userId: win.userId ? win.userId : App.Utility.UserMapping.getCurrentUserId() };
        me.store.load();
    },
    UserChange: function UserChange(me, rec) {
        var win = me.up('window'),
            container = win.down('App-View-Access-Request-UserGeo');

        container.store.getProxy().extraParams = { userId: me.getValue() };
        container.store.load();
    },
    StoreLoad: function StoreLoad(me, store, records, success) {
        var fields = me.query('label[dataField]');

        Ext.each(fields, function (a) {
            if (records.length > 0 && !Ext.isEmpty(records[0].get(a.dataField)))
                a.setText(a.preText + ' ' + records[0].get(a.dataField));
            else
                a.setText(a.preText);
        }, this);
    }
});