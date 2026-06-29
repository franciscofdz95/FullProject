BIACore.define('BIACore', {
}, function (BIACore) {
    // wait till onReady so that user is authenticated.
    BIACore.onReady(function () {
        if (!BIACore.isLocalHost() && /(\/|default.aspx)$/i.test(window.location.pathname)) {
            BIACore.ajax({
                url: BIACore.URL.BrowserTrack,
                data: {
                    AppCode: BIACore.Config.appCode,
                    UserId: BIACore.Security.User.userId,
                    Browser: BIACore.String.format(BIACore.Browser.mode ? '{browser}{version}|{mode}' : '{browser}{version}', BIACore.Browser)
                },
                // override the default error, so we fail silently.
                error: function () { }
            });
        }
    });
});