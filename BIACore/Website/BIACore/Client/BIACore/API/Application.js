BIACore.define('BIACore.API.Application', {
}, function (me) {
    var _getApplicationUserAccess = function _getApplicationUserAccess(userId, appCode) {
        var userAccess = null,
            callbackFn = function (request, success, response) {
                if (success) {
                    if (response.userAccess) userAccess = response.userAccess;
                    else {
                        var json = eval(response.responseText);
                        if (json && BIACore.isObject(json) && json.userAccess) userAccess = json.userAccess;
                    }
                }
            },
            jsonData = {
                UserId: userId,
                AppCode: appCode
            };

        if (Ext && BIA && BIA.Ajax && BIA.Ajax.request && BIACore.isFunction(BIA.Ajax.request)) {
            BIA.Ajax.request({
                url: BIACore.URL.ApplicationUserAccess,
                method: 'POST',
                async: false,
                jsonData: jsonData,
                callback: callbackFn
            });
        }
        else {
            BIACore.ajax({
                url: BIACore.URL.ApplicationUserAccess,
                type: 'POST',
                async: false,
                data: jsonData,
                complete: callbackFn
            });
        }

        return userAccess;
    }

    BIACore.apply(me, {
        getApplicationUserAccess: function getApplicationUserAccess(userId, appCode) {
            return _getApplicationUserAccess(userId, appCode);
        }
    });
});