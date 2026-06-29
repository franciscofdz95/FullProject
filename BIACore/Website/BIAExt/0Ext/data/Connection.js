// This code needs to be reviewed and a 7.0 specific override of the 7.0 method needs to be written. It has moved from Ext.data.Connection to Ext.data.request.Ajax.
if (Ext.getVersion().major == 5) {
    Ext.override(Ext.data.Connection, {
        request: function (options) {
            options = options || {};
            var me = this,
                scope = options.scope || window,
                username = options.username || me.getUsername(),
                password = options.password || me.getPassword() || '',
                async, requestOptions, request, headers, xdr, xhr;
            if (me.fireEvent('beforerequest', me, options) !== false) {
                requestOptions = me.setOptions(options, scope);
                if (me.isFormUpload(options)) {
                    me.upload(options.form, requestOptions.url, requestOptions.data, options);
                    return null;
                }

                if (options.autoAbort || me.getAutoAbort()) {
                    me.abort();
                }

                async = options.async !== false ? (options.async || me.getAsync()) : false;
                xhr = me.openRequest(options, requestOptions, async, username, password);

                xdr = me.getIsXdr();
                if (!xdr) {
                    headers = me.setupHeaders(xhr, options, requestOptions.data, requestOptions.params);
                }

                request = {
                    id: ++Ext.data.Connection.requestId,
                    xhr: xhr,
                    headers: headers,
                    options: options,
                    async: async,
                    binary: options.binary || me.getBinary(),
                    timeout: Ext.defer(function () {
                        request.timedout = true;
                        me.abort(request);
                    }, options.timeout || me.getTimeout())
                };
                me.requests[request.id] = request;
                me.latestId = request.id;

                if (async) {
                    if (!xdr) {
                        xhr.onreadystatechange = Ext.Function.bind(me.onStateChange, me, [
                            request
                        ]);
                    }
                }
                if (xdr) {
                    me.processXdrRequest(request, xhr);
                }

                xhr.send(requestOptions.data);
                if (!async) {
                    return me.onComplete(request);
                }
                return request;
            } else {
                async = options.async !== false ? (options.async || me.getAsync()) : false;

                var request = {
                    status: -1,
                    request: { options: options, async: async },
                    statusText: 'Cancelled Request',
                    responseText: '{ExceptionType: "BIACoreCancelledRequest", Message: "BIACoreCancelledRequest", ExceptionMessage: "JavaScript Cancelled Request by Unknown", MessageDetail: "JavaScript Cancelled Request by Unknown", StackTrace: "None"}',
                    getAllResponseHeaders: function () { return []; },
                    getResponseHeader: function () { return ''; },
                    contentType: null
                };

                if (options.LoopPrevention) {
                    request.responseText = '{ExceptionType: "BIACoreLoopPrevention", Message: "BIACoreCancelledRequest", ExceptionMessage: "JavaScript Cancelled Request by BIACore Loop Prevention", MessageDetail: "JavaScript Cancelled Request by BIACore Loop Prevention", StackTrace: "You can\'t handle the truth."}';

                    Ext.callback(options.callback, options.scope, [
                        options,
                        false,
                        request
                    ]);
                }
                else {
                    Ext.callback(options.callback, options.scope, [
                        options,
                        false,
                        request
                    ]);
                }
                return null;
            }
        }
    });
}
