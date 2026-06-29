Ext.define('MyReports', {
    singleton: true,
    Enqueue: function (args) {
        var me = this,
            jsonData = Ext.isObject(args.jsonData) ? args.jsonData : {},
            callback = Ext.isFunction(args.callback) ? args.callback : Ext.emptyFn,
            success = Ext.isFunction(args.success) ? args.success : Ext.emptyFn,
            failure = Ext.isFunction(args.failure) ? args.failure : Ext.emptyFn,
            scope = args.scope || me;

        Ext.Ajax.request({
            caller: me,
            url: 'api/MyReports/Enqueue',
            jsonData: jsonData,
            method: 'POST',
            callback: callback,
            success: success,
            failure: failure,
            scope: scope,
            withCredentials: true
        });
    }
});