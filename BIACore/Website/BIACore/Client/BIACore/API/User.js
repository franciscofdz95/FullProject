BIACore.define('BIACore.API.User', {
}, function (me) {
    var _doUserSearch = function _doUserSearch(userId, adid, email, appCode) {
        var userSearch = null,
            callbackFn = function (request, success, response) {
                if (success) {
                    if (response.userSearch) userSearch = response.userSearch;
                    else {
                        var json = eval(response.responseText);
                        if (json && BIACore.isObject(json) && json.userSearch) userSearch = json.userSearch;
                    }
                }
            },
            jsonData = {
                UserId: userId,
                ADID: adid,
                Email: email,
                AppCode: appCode
            };

        if (Ext && BIA && BIA.Ajax && BIA.Ajax.request && BIACore.isFunction(BIA.Ajax.request)) {
            BIA.Ajax.request({
                url: BIACore.URL.UserSearch,
                method: 'POST',
                async: false,
                jsonData: jsonData,
                callback: callbackFn
            });
        }
        else {
            BIACore.ajax({
                url: BIACore.URL.UserSearch,
                type: 'POST',
                async: false,
                data: jsonData,
                complete: callbackFn
            });
        }

        return userSearch;
    };

    BIACore.apply(me, {
        search: function search(userId, adid, email, appCode) {
            return _doUserSearch(userId, adid, email, appCode);
        }
    });
});