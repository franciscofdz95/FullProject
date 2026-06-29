Ext.define('App.Controller.Application.AddEditView.Component.InfoList', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Application-AddEditView-Component-InfoList': {
                afterrender: this.ApplicationInfoListShowLoadingMask,
                storebeforeload: { fn: this.ApplicationInfoListShowLoadingMask, delay: 1 },
                storeload: this.ApplicationInfoListStoreLoad
            },
            'App-View-Application-AddEditView-Component-InfoList [dataField]': {
                beforerender: this.ApplicationInfoListDataFieldBeforeRender
            }
        });
    },
    ApplicationInfoListShowLoadingMask: function ApplicationInfoListShowLoadingMask(me) {
        if (me.rendered === true && me.isMasked() === false && me.store.isLoading() === true) me.mask(me.loadingText);
        else if (me.isMasked() === true) me.unmask();
    },
    ApplicationInfoListStoreLoad: function ApplicationInfoListStoreLoad(me, store, records, success) {
        if (success && records.length > 0) {
            me.removeAll();

            var addFn = function addFn(me, record) {
                me.add({ xtype: me.itemXtype, application: record });
            }

            for (var i = 0; i < records.length; i++) {
                Ext.defer(addFn, me.delayAdd * i, this, [me, records[i].data]);
            }
        }

        if (me.isMasked() === true) me.unmask();
    },
    ApplicationInfoListDataFieldBeforeRender: function ApplicationInfoListDataFieldBeforeRender(me) {
        var display = me.up('[application]');
        if (display && me.setText) {
            me.setText((me.preText || '') + display.application[me.dataField] + (me.postText || ''));
        } else {
            // Do nothing
        }

    }
});