BIACore.define('BIACore.Logger', {
    // defaults: Will be overwritten by Config
    debug: BIACore.isLocalHost(),
    message: BIACore.isLocalHost(),
    error: BIACore.isLocalHost(),
    // can't (and shouldn't) log remotely when running from localhost - no jsonp method set up for it. (and request data would be too long for uri limit)
    remote: !BIACore.isLocalHost(),

    onLoad: function () {
        var me = this;

        // at this point, our configuration should be set;
        // so go through our config options and bind the global BIACore
        // logging events to the logger.
        if (me.debug) { BIACore.Debug = me.Debug; }
        if (me.message) { BIACore.Message = me.Message; }
        if (me.error) { BIACore.Error = me.Error; }

        // if logger is enabled, always handle exceptions.
        if (me.enabled) { BIACore.Exception = me.Exception; }

        BIACore.Event.fire('ready');
    }
}, function (me) {
    var previousCalls = [];

    var _catchLoopedErrors = function (logEvent) {
        var cancelLog = false;
        if (previousCalls.length > 1) {
            var callMatches = 0;
            for (i = 0; i < previousCalls.length; i++) {
                if (logEvent.TransactionId == previousCalls[i].TransactionId && logEvent.Server == previousCalls[i].Server &&
                    logEvent.UserId == previousCalls[i].UserId && logEvent.AppCode == previousCalls[i].AppCode &&
                    logEvent.Level == previousCalls[i].Level && logEvent.Event == previousCalls[i].Event &&
                    Date.now() - previousCalls[i].Date < 2000) {
                    callMatches++;
                }
            }

            if (callMatches >= 2) cancelLog = true;
        }

        previousCalls.push(logEvent);
        if (previousCalls.length > 5) previousCalls.pop();

        return cancelLog;
    };

    var _log = function (message) {
        if (typeof (message) === 'undefined' || message === null) { return; }

        var logEvent = {
            TransactionId: BIACore.Config.transactionId(),
            Date: new Date(),
            Server: BIACore.client,
            UserId: BIACore.Security.User.userId,
            AppCode: BIACore.Config.appCode,
            Level: message.type || 'Debug',
            Event: message.message
        };

        // send the message to the server?
        if (me.remote && !_catchLoopedErrors(logEvent)) {
            now = new Date()
            BIACore.ajax({
                url: BIACore.URL.Event,
                data: {
                    TransactionId: BIACore.Config.transactionId(),
                    Date: now.getUTCDate(),
                    Server: BIACore.client,
                    UserId: BIACore.Security.User.userId,
                    AppCode: BIACore.Config.appCode,
                    Level: message.type || 'Debug',
                    Event: message.message,
                    Detail: message.detail + '\r\n' + message.stack
                },
                // override the default error so that we don't cause stack overflow.
                error: function (jq, status, error) {
                    if (typeof (console) === 'object') {
                        console.log('Unable to log message: ' + error);
                    }
                }
            });
        }

        // send the message to the console?
        if (typeof (console) === 'object' && BIACore.JSON != null && BIACore.JSON.stringify) {
            console.log(message.type + ': ' + BIACore.JSON.stringify(message.message));
        }
    },
        _stack = function () {
            var stackTrace = '';
            try {
                stackTrace = (BIACore.printStackTrace) ? BIACore.printStackTrace().join('\n') : '';
            }
            catch (ex) {
                //Do Nothing
            }
            return stackTrace;//(BIACore.printStackTrace) ? BIACore.printStackTrace().join('\n') : '';
        };

    BIACore.apply(me, {
        // The global logging functions.
        Debug: function (message, detail) {
            var e = { type: 'Debug', stack: _stack() };
            BIACore.apply(e, (typeof (message) === 'object') ? message : { message: message });
            BIACore.apply(e, (typeof (detail) === 'object') ? detail : { detail: detail });
            _log(e);
        },

        Message: function (message, detail) {
            var e = { type: 'Message', stack: _stack() };
            BIACore.apply(e, (typeof (message) === 'object') ? message : { message: message });
            BIACore.apply(e, (typeof (detail) === 'object') ? detail : { detail: detail });
            _log(e);
        },

        Error: function (message, detail) {
            var e = { type: 'Error', stack: _stack() };
            BIACore.apply(e, (typeof (message) === 'object') ? message : { message: message });
            BIACore.apply(e, (typeof (detail) === 'object') ? detail : { detail: detail });
            _log(e);
        },

        Exception: function (message, detail) {
            var e = { type: 'Exception', stack: _stack() };
            BIACore.apply(e, (typeof (message) === 'object') ? message : { message: message });
            //Added if to prevent detail from overridding message.detail.
            if (detail) BIACore.apply(e, (typeof (detail) === 'object') ? detail : { detail: detail });
            _log(e);
        },

        Export: function (type, route, params, rowCnt, columnCnt) {
            BIACore.ajax({
                url: BIACore.URL.Export,
                data: {
                    ExportType: type,
                    Route: route,
                    Params: params,
                    RowCnt: rowCnt,
                    ColumnCnt: columnCnt,
                    ExportUserSysm: BIACore.Security.User.userId
                },
                // override the default error so that we don't cause stack overflow.
                error: function (jq, status, error) {
                    if (typeof (console) === 'object') {
                        console.log('Unable to log export: ' + error);
                    }
                }
            });
        },

        Ajax: function (message, detail) {
            var e = { type: 'AJAX' };
            BIACore.apply(e, (typeof (message) === 'object') ? message : { message: message });
            BIACore.apply(e, (typeof (detail) === 'object') ? detail : { detail: detail });
            _log(e);
        },

        PageView: function (title, xtype, loadTime) {
            BIACore.ajax({
                url: BIACore.URL.PageView,
                type: 'POST',
                data: {
                    Object: title.replace(/ /g, '_'),
                    Params: 'xtype: "' + xtype + '", loadTime: ' + loadTime + 'ms',
                    AppCode: BIACore.Security.Session.appCode,
                    Page: window.location.protocol + '//' + window.location.host + window.location.pathname
                },
                //success: function (response, status, request) {
                //    if (Ext && Ext.log) {
                //        Ext.log({ dump: response });
                //    }
                //},
                // override the default error so that we don't cause stack overflow.
                error: function (jq, status, error) {
                    if (typeof (console) === 'object') {
                        console.log('Unable to log PageView: ' + error);
                    }
                }
            });
        }
    });

    BIACore.onReady(function () {
        // bind to Ext4.x
        var ext = (typeof (Ext) !== 'undefined') ? Ext : null,
            version = (ext !== null && ext.getVersion) ? ext.getVersion().major : 0;
        if (version >= 4) {
            // bind to ajax errors
            ext.Ajax.on('requestexception', function (connection, response, options) {
                if (options.failure !== null) { return; }

                // authentication failure - redirect the application to the login screen
                // We aren't using a 302 or a 403 here because IIS captures and re-writes the exception.
                if ([0, 511, 401, 403].indexOf(response.status) == -1) {
                    // at this point, we've handled the exception, stop others from having to (maybe) deal with it.
                    _log({
                        type: 'AJAX',
                        message: 'AJAX call failed with response ' + response.status,
                        detail: options.url + '\r\n' + response.response
                    });
                }
            });

            // bind to the Ext.Error framework
            ext.Error.handle = function (error) {
                var e = error || {};

                // For users with cross origin requests forced enabled:
                // After EAM session timeout it responds with the login page and Ext tries to decode
                // the responses as json which causes an error so skip logging
                if (e.msg) {
                    for (var i in BIACore.Security.eamMessages) {
                        if (e.msg.indexOf(BIACore.Security.eamMessages[i]) > -1) {
                            self.location.reload();
                            return;
                        }
                    }
                }

                if (e.dump) {
                    me.Exception({ message: 'ExtJS: ' + e.msg, detail: JSON.stringify(e), stack: e.dump });
                }
                else {
                    me.Exception({ message: 'ExtJS: ' + e.msg, detail: JSON.stringify(e) });
                }
            };
        }

        // bind to jQuery
        var $ = (typeof (jQuery) !== 'undefined') ? jQuery : null;
        if ($ !== null) {
            $(document).ajaxError(function (event, jqXHR, settings, thrownError) {
                me.Exception('JQ: ' + thrownError);
            });
        }

        // bind to javascript
        //var old = window.onerror;
        //window.onerror = function (msg, url, line) {
        //    if (old && !old(arguments))
        //        BIACore.Exception();
        //};
    });
});
