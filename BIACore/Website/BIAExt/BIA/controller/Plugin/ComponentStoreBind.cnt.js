Ext.define('BIA.Controller.Plugin.ComponentStoreBind', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            '[storeBind]': {
                'bindtostore': this.BindToStore
            }
        });
    },
    BindToStore: function BindToStore(me, storeBind) {
        var storeCnt = me.up('[store]');
        if (storeCnt) {
            storeCnt.addListener({
                storeload: function storeload(me, storeBind, storeCnt, store, records, success) {
                    this.BindUpdate(me, storeBind, success && records.length > 0 ? records[0] : new Ext.data.Model());
                },
                scope: this,
                args: [me, storeBind]
            });
        }
    },
    BindUpdate: function BindUpdate(me, storeBind, data) {
        var val = null;
        if (!Ext.isEmpty(data.get(storeBind.dataField))) val = data.get(storeBind.dataField);

        if (val == null && storeBind.defaultValue != null) val = storeBind.defaultValue;

        if (Ext.isFunction(storeBind.renderer)) val = storeBind.renderer.call(me, val, storeBind.dataField, storeBind);

        if (storeBind.setHTML === true) me.setConfig({ html: val });
        else if (Ext.isFunction(me.setText)) me.setText(val);
        else if (Ext.isFunction(me.setSelection)) me.select(val);
        else if (Ext.isFunction(me.setValue)) me.setValue(val);

        if (storeBind.hideOnNull === true && val == null) me.hide();
        if (storeBind.hideOnNull === true && val != null) me.show();

        if (storeBind.neverHide === true) me.show();

        me.fireEvent('storebindupdate', me, storeBind, val);
    }
});