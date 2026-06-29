BIACore.define('BIACore.Security.Session', {
    // timer for 'active' event?

    update: function () {
        var security = BIACore.Security;
        BIACore.ajax({
            url: BIACore.URL.Session,
            data: {
                AppCode: BIACore.Config.appCode,
                TokenLocal: BIACore.Config.tokenLocal(),
                Anonymous: BIACore.Security.anonymous
            },
            success: function (data) {
                BIACore.Console('updated Session Info');
                BIACore.apply(security.Session, data);
            }
        });
    },

    onLoad: function () {
        var security = BIACore.Security;
        if (security.securePath()) {
            BIACore.ajax({
                url: BIACore.URL.Session,
                data: {
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal(),
                    Anonymous: BIACore.Security.anonymous
                },
                success: function (data) {
                    BIACore.Console('loaded Session Info');
                    BIACore.apply(security.Session, data);
                    if (security.enabled && !security.anonymous && (!security.Session.appOnline || security.Session.status !== 1)) {
                        security.login();
                    } else {
                        security.secured = true;
                    }
                    BIACore.Event.fire('ready');
                }
            });
        } else {
            BIACore.Event.fire('ready');
        }
    }
});
