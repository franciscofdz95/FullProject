BIACore.define('BIACore.Security.User', {
    permissions: [],

    onLoad: function () {
        var security = BIACore.Security;
        if (security.securePath()) {
            BIACore.ajax({
                url: BIACore.URL.User,
                data: {
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal()
                },
                success: function (data) {
                    BIACore.Console('loaded User Info');
                    BIACore.apply(security.User, data);
                    BIACore.Event.fire('ready');
                }
            });
        } else {
            BIACore.Event.fire('ready');
        }
    }
}, function (me) {
    var hasPermission = function (param, value) {
        var p = me.permissions || [],
            plen = p.length, i = 0;

        for (; i < plen; ++i) {
            if (p[i][param] === value) {
                return true;
            }
        }
        return false;
    };

    BIACore.apply(me, {
        // public - returns true if the user has the 'SA' flag in their permissions list.
        isSA: function () {
            return hasPermission('securityLevel', 'SA');
        },
        // public - returns true if the user is 'SA' or 'Admin'
        isAdmin: function () {
            return hasPermission('securityLevel', 'SA') ||
                hasPermission('securityLevel', 'Admin');
        },
        // public - returns true if the user has the 'CO' flag in their permissions list.
        isCorporate: function () {
            return hasPermission('geoCode', 'CO');
        },
        // public - deprecated - just refers to security.logout
        logout: function () {
            BIACore.Security.logout();
        },
        // public - deprecated - just refers to security.impersonateUser
        impersonateUser: function (userId) {
            BIACore.Security.ImpersonateUser(userId);
        }
    });
});
