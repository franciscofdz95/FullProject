Ext.define('App.Controller.Access.View', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Access-View[store][getAccessOnStoreLoad=true]': {
                storebeforeload: this.SummaryViewGetAccessOnStoreLoad
            }

        });
    },
    SummaryViewGetAccessOnStoreLoad: function SummaryViewGetAccessOnStoreLoad(me) {
        var accessCnt = me.accessId;
        if (accessCnt && !Ext.isEmpty(accessCnt)) {
            me.store.getProxy().extraParams = { accessId: accessCnt };
        }
    }

});