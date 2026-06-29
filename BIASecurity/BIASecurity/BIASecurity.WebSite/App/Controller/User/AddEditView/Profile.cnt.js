Ext.define('App.Controller.User.AddEditView.Profile', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-User-AddEditView-Profile-Component-InfoList': {
                afterrender: this.ProfileInfoListShowLoadingMask,
                storebeforeload: { fn: this.ProfileInfoListShowLoadingMask, delay: 1 },
                storeload: this.ProfileInfoListStoreLoad
            },
            'App-View-User-AddEditView-Profile-Component-InfoList [dataField]': {
                beforerender: this.ProfileInfoListDataFieldBeforeRender
            },
            'App-View-User-AddEditView-Profile-AccessSummaryList-View': {
                beforerender: this.AccessSummaryListBeforeRender
            },
            'App-View-User-AddEditView-Profile #User_UserId': {
                storebindupdate: this.UserIdFieldStoreBindUpdate
            }
        });
    },
    ProfileInfoListShowLoadingMask: function ProfileInfoListShowLoadingMask(me) {
        if (me.rendered === true && me.isMasked() === false && me.store.isLoading() === true) me.mask(me.loadingText);
        else if(me.isMasked() === true) me.unmask();
    },
    ProfileInfoListStoreLoad: function ProfileInfoListStoreLoad(me, store, records, success) {
        if (success && records.length > 0) {
            var addFn = function addFn(me,record) {
                me.add({ xtype: me.itemXtype, user: record });
            }

            for (var i = 0; i < records.length; i++) {
                Ext.defer(addFn, me.delayAdd * i, this, [me, records[i].data]);
            }
        }

        if (me.isMasked() === true) me.unmask();
    },
    ProfileInfoListDataFieldBeforeRender: function ProfileInfoListDataFieldBeforeRender(me) {
        var display = me.up('[user]');
        if (display) {
            var val = display.user[me.dataField];
            if (me.formatFn && Ext.isFunction(me.formatFn))
                val = me.formatFn(val);
            me.setText((me.preText || '') + val + (me.postText || ''));
        }

    },
    AccessSummaryListBeforeRender: function AccessSummaryListBeforeRender(me) {

    },
    UserIdFieldStoreBindUpdate: function UserIdFieldStoreBindUpdate(me, storeBind, val) {
        if (!Ext.isEmpty(val) && BIACore.Security.User.isSA()) me.show();
        else me.hide();
    }
});