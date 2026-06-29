Ext.define('App.Controller.Admin.ActiveUser', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'ActiveUserFilter', selector: 'App-View-Admin-ActiveUser-Filter' }
    ],
    init: function init() {
        this.control({
            'App-View-Admin-ActiveUser-MenuItem': {
                beforerender: this.ActiveUserMenuItemBeforeRender
            },
            'App-View-Admin-ActiveUser-AdminMenuItem': {
                beforerender: this.ActiveUserMenuItemBeforeRender
            },
            'App-View-Admin-ActiveUser-Container': {
                added: this.ActiveUserContainerAdded
            },
            'App-View-Admin-ActiveUser-Filter #ApplyBtn': {
                click: this.ActiveUserFilterBtnClick
            },
            'App-View-Admin-ActiveUser-Filter #ClearBtn': {
                click: this.ActiveUserFilterBtnClick
            },
            'App-View-Admin-ActiveUser-Grid': {
                afterrender: this.ActiveUserGridAfterRender,
                storebeforeload: this.ActiveUserGridStoreBeforeLoad
            },
            'App-View-Admin-ActiveUser-Summary': {
                beforerender: this.ActiveUserSummaryBeforeRender,
                storeload: this.ActiveUserSummaryStoreLoad
            },
            'App-View-Admin-ActiveUser-Component-Summary-Item': {
                beforerender: this.ActiveUserSummaryItemBeforeRender
            }
        });
    },
    ActiveUserMenuItemBeforeRender: function ActiveUserMenuItemBeforeRender(me) {
        if (!BIACore.Security.User.isSA()) me.hide();
        else me.show();
    },
    ActiveUserContainerAdded: function ActiveUserContainerAdded(me) {
        if (!BIACore.Security.User.isSA()) me.hide();
        else me.show();
    },
    ActiveUserFilterBtnClick: function ActiveUserFilterBtnClick(me) {
        var filter = this.getActiveUserFilter();
        if (filter) filter.fireFilterEvent(me.itemId === 'ClearBtn');
    },
    ActiveUserGridAfterRender: function ActiveUserGridAfterRender(me) {
        var filter = this.getActiveUserFilter();
        if (filter) me.addManagedListener(filter, 'filterUpdate', function ActiveUserGridFitlerUpdate() {
            me.store.load();
        });

        me.store.load();
    },
    ActiveUserGridStoreBeforeLoad: function ActiveUserGridStoreBeforeLoad(me) {
        var filter = this.getActiveUserFilter();
        if (filter) me.store.getProxy().extraParams = Ext.apply(me.store.getProxy().extraParams, filter.getParams());
    },
    ActiveUserSummaryBeforeRender: function ActiveUserSummaryBeforeRender(me) {
        me.store.load();
    },
    ActiveUserSummaryStoreLoad: function ActiveUserSummaryStoreLoad(me, store, records, success) {
        if (success) for (var i = 0; i < records.length; i++) me.add({ xtype: 'App-View-Admin-ActiveUser-Component-Summary-Item', record: records[i].data });
    },
    ActiveUserSummaryItemBeforeRender: function ActiveUserSummaryItemBeforeRender(me) {
        var labels = me.query('label[prop]');
        for (var i = 0; i < labels.length; i++) labels[i].setText(me.record[labels[i].prop] + labels[i].postText);
    }
});