BIACore.define('BIACore.AJAX', {
    ajax: function (config) {
        var config = config || {},
            async = (config.async === false) ? false : true,
            type = config.type || 'POST',
            global = config.global || false,
            url = config.url || '',
            isLocalTesting = BIACore.isLocalHost() && url.indexOf(BIACore.Config.serviceURI) > -1 && BIACore.Config.serviceURI.indexOf('localhost:') < 0,
            dataType = config.dataType || 'json',
            data = (dataType === 'jsonp') ? config.data :
                (type === 'GET' && dataType === 'json') ? BIACore.$.param(config.data) :
                    BIACore.JSON.stringify(config.data),
            content = config.content || 'application/json; charset=utf-8',
            crossDomain = config.crossDomain || (isLocalTesting ? true : false),
            success = typeof (config.success) === 'function' ? config.success : BIACore.emptyFn,
            error = typeof (config.error) === 'function' ? config.error : // provided handler
                (global) ? function (jqxhr, status, error) { BIACore.Exception({ type: 'AJAX', message: error + ' at (' + url + ')' }); } : // global = true, global handler
                    BIACore.emptyFn, // global = false, empty handler
            complete = typeof (config.complete) === 'function' ? config.complete : BIACore.emptyFn,
            scope = config.scope || this,
            timeout = config.timeout || 20000; // 20 second timeout (default is apparently infinite?)

        if (url === undefined || url === null || url === '') {
            BIACore.Console('Attempted to make an AJAX call with an empty URL at (' + url + ')');
            return;
        }

        if (BIACore.Config && BIACore.Config.debug) BIACore.Console('AJAX (' + type + ') call to ' + url);

        var ajax = {
            global: global,
            type: type,
            async: async,
            url: url,
            contentType: content,
            data: data,
            dataType: dataType,
            context: scope,
            success: success,
            error: error,
            timeout: timeout,
            complete: complete,
            crossDomain: crossDomain
        };

        // Skipping this check as Firefox now supports withCredentials. Delete at some point.
        //if (BIACore.Browser.browser != 'Firefox') ajax.xhrFields = { withCredentials: true };
        ajax.xhrFields = { withCredentials: true };

        return BIACore.$.ajax(ajax);
    }
}, function (me) {
    BIACore.ajax = me.ajax;
});
