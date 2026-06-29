BIACore.define('BIACore.Security', {
}, function (me) {
    // we are actually bolting an authenticator onto BIACore.Security
    var _authenticate = function (config) {
        var config = config || {},
            callback = typeof(config.callback) === 'function' ? config.callback : BIACore.emptyFn,
            scope = config.scope || BIACore.global;

        BIACore.ajax({
            url: BIACore.URL.Authenticate,
            dataType: 'json',// remove when done with local debugging.
            data: {
                User: config.User,
                Pass: config.Pass,
                AppCode: config.AppCode || BIACore.AppCode,
                Source: BIACore.Browser.browser + BIACore.Browser.version 
            },
            success: function (data) {
                // ajax success, still have to check the message result.
                if (data === null || !data.Success) {
                    callback.apply(scope, [false, data || {}]);
                } else {
                    callback.apply(scope, [true, data || {}]);
                }
            },
            error: function (jqxhr, status, error) {
                callback.apply(scope, [false, { Error: error }, jqxhr]);
            }
        });
    };
    
    BIACore.apply(me, {
        authenticate: function (config) {
            _authenticate(config || {});
        }
    });
});
