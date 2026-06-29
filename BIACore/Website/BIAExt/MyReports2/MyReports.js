Ext.define('BIA.MyReports', {
    singleton: true
}, function (me) {
    var _updateButton = function (options, success, response) {
        var button = options.button;

        if (!success) { return; } // need to add handling for the 511.
        if (!button) { return; }

        var result = Ext.decode(response.responseText) || {},
            text = result.Enabled ? 'Disable Reports' : 'Enable Reports',
            icon = result.Enabled ? 'mricon mricon-app_stop' : 'mricon mricon-app_start';


        button.toggle(result.Enabled, true);
        button.resumeEvents(true);
        button.setText(text);
        button.setIconCls(icon);
    };

    Ext.apply(me, {
        Enqueue: function (args) {
            var args = args || {},
                jsonData = args.jsonData || {},
                callback = args.callback || Ext.emptyFn,
                scope = args.scope || me;

            Ext.Ajax.request({
                caller: me,
                url: BIACore.Config.serviceURI + 'api/MyReports/Enqueue',
                params: {
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal()
                },
                jsonData: jsonData,
                method: 'POST',
                callback: function (o, s, r) {
                    var result = Ext.decode(r.responseText);
                    callback(result.Success, result.Message, args);
                },
                scope: scope,
                withCredentials: true
            });
        },
        AgentStatus: function (button) {
            Ext.Ajax.request({
                caller: me,
                url: BIACore.Config.serviceURI + 'api/MyReports/AgentStatus',
                params: {
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal()
                },
                jsonData: {}, // required, else params become "form params" not "query params".
                callback: _updateButton,
                button: button,
                scope: me,
                withCredentials: true
            });
        },
        AgentToggle: function (button, pressed) {
            // block all button clicking until we've received a response.
            button.suspendEvents(false);

            Ext.Ajax.request({
                caller: me,
                url: BIACore.Config.serviceURI + 'api/MyReports/AgentUpdate',
                params: {
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal()
                },
                jsonData: { Enable: pressed },
                callback: _updateButton,
                button: button,
                scope: me,
                withCredentials: true
            });
        },
        BeforeLoad: function (store, operation) {
            operation.setParams(Ext.apply({}, {
                AppCode: BIACore.Config.appCode,
                //SessionId: BIACore.Config.sessionId()
                TokenLocal: BIACore.Config.tokenLocal()
            }, operation.getParams() || {}));
        },
        Download: function (recordId) {
            Ext.create('BIA.form.FileDownload', {
                url: BIACore.Config.serviceURI + 'api/MyReports/Download?' + Ext.urlEncode({
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal(),
                    ReportId: recordId
                })
            });
        },
        Retry: function (records, callback, scope) {
            Ext.Ajax.request({
                caller: this,
                url: BIACore.Config.serviceURI + 'api/MyReports/Retry',
                params: {
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal()
                },
                jsonData: records,
                callback: function (o, s, r) {
                    var result = Ext.decode(r.responseText);
                    (callback || Ext.emptyFn)(result.Success, result.Message, records);
                },
                scope: scope || this,
                withCredentials: true
            });
        },
        Sync: function (store, callback, scope) {
            store.sync({
                params: {
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal()
                },
                callback: callback || Ext.emptyFn,
                scope: scope || this
            });
        }
    });

    if (Ext.getVersion().major < 5) {
        Ext.apply(me, {
            BeforeLoad: function (store, operation) {
                operation.params = Ext.apply({}, {
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal()
                }, operation.params || {});
            }
        });
    }
});