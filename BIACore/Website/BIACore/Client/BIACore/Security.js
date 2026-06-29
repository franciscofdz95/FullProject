BIACore.define('BIACore.Security', {

    enabled: false,
    secured: false,
    loginURI: BIACore.URL.Login,
    logoutURI: BIACore.URL.Logout,
    include: [],
    exclude: [],

    // Messages which we get back from EAM after session timeout
    // Used to trap for redirects and to skip logging decode errors
    eamMessages: [
        'This page is used to hold your data while you are being authorized for your request.',
        'UPS Enterprise Access Management',
        'UPS&nbsp;Enterprise Access&nbsp;Management'
    ],

    // this is effectively a duplicate for BIACoreModule's SecurePath.
    securePath: function () {
        var i, list, exclude, include;
        if (!BIACore.Security.enabled) { return false; }

        var path = window.location.pathname.toLowerCase();

        // if we got a root node, assume it's default.aspx
        if (path.charAt(path.length - 1) === '/') { path += 'default.aspx'; }

        list = BIACore.Security.exclude || [];
        exclude = (list.length > 0);
        if (exclude) {
            for (i = 0, len = list.length; i < len; ++i) {
                if (path.indexOf(list[i].toLowerCase()) >= 0) {
                    return false;
                }
            }
        }

        list = BIACore.Security.include || [];
        include = (list.length > 0);
        if (include) {
            for (i = 0, len = list.length; i < len; ++i) {
                if (path.indexOf(list[i].toLowerCase()) >= 0) {
                    return true;
                }
            }
        }

        return exclude || !include;
    },

    // public - log in to BIA
    login: function () {

        var query = BIACore.Object.fromQueryString(window.location.search);
        if (query[BIACore.Config.tokenQP] != null) delete query[BIACore.Config.tokenQP];
        if (query["BIA_Session"] != null) delete query["BIA_Session"];

        var uriString = "";

        if (window.location.origin) uriString = window.location.origin + window.location.pathname + BIACore.Object.toQueryString(query);
        else uriString = "https://" + window.location.host + window.location.pathname + BIACore.Object.toQueryString(query);

        var param = {
            //action: 'Login.ValidateLogin', WHY IN THE FUDGE IS THIS HERE?!! MME 08/14/2018
            AppCode: BIACore.Config.appCode,
            ReturnURI: uriString
        };

        var FingerprintObj;

        BIACore.ajax({
            async: false,
            url: BIACore.URL.GetFingerprintByValue,
            data: {
                Value: param
            },
            success: function (data) {
                FingerprintObj = data;
            }
        });

        var uri = BIACore.Security.loginURI + (FingerprintObj != null ? '?rt=' + FingerprintObj.FingerprintId : '');
        // for the moment, just redirect the user to the login app.
        BIACore.Console('Redirect to Login requested');
        window.location.href = uri;
    },

    // public - log out of BIA
    logout: function () {
        if (window.location.host.indexOf('localhost') > -1) {
            BIACore.Cookie.set({
                name: BIACore.Config.sessionCookie,
                value: '',
                expires: BIACore.Date.add(new Date(), BIACore.Date.DAY, -30)
            });
            BIACore.ajax({ url: BIACore.URL.LocalhostLogout, method: 'POST' });
        }
        BIACore.Console('Redirect to Logout requested');
        window.location.href = BIACore.Security.logoutURI + '?' + BIACore.$.param({ onFinish: 'close' }) +
            '&' + BIACore.$.param({ appCode: BIACore.Security.Session.appCode }) + '&' + BIACore.$.param({ t: BIACore.Security.authType });
    },

    // public - kept for legacy reasons - security handles impersonation.
    impersonateUser: function () {
        BIACore.Console('BIACore: impersonateUser requested - should be using Security operations');
    }
}, function (me) {
    // add this here because onReady is now a BIACore.define event function.
    me.onReady = function (func, scope) {
        alert('This application is using the deprecated function BIACore.Security.onReady. Please switch to BIACore.onReady.');
        BIACore.Console('BIACore.Security.onReady: please switch to using BIACore.onReady instead');
        BIACore.onReady(func, scope);
    };

    BIACore.onReady(function () {
        // Ext
        var ext = (typeof (Ext) !== 'undefined') ? Ext : null,
            version = (ext !== null && ext.getVersion) ? ext.getVersion().major : 0;
        if (version >= 5) {
            ext.Ajax.on('requestexception', function (connection, response, options) {
                // check if the client already has error handling on the request
                //if (options && options.failure) { return; }

                // authentication failure - redirect the application to the login screen
                // We aren't using a 302 or a 403 here because IIS captures and re-writes the exception.
                if ([0, 511, 401, 403].indexOf(response.status) > -1 && response.timedout !== true) {
                    // me.login(); // Previously we send the page to login, with EAM and even how BIASecurity works a refresh of the page is better
                    BIACore.Console('BIACore.Security.onReady: Ajax Request Exception, Reloading Page.');
                    self.location.reload();
                    // at this point, we've handled the exception, stop others from having to (maybe) deal with it.
                    return false;
                }
            });
        }

        // After session timeout EAM rewrites form posts with their own pages which respond as 200s.
        // Ext forms try to decode them as json and cause an error so trap it and redirect if we can see it is an EAM page.
        if (version >= 5) {
            Ext.define('BIACore.Security.form', {
                override: 'Ext.form.Basic',
                submit: function submit(options) {
                    if (!options) options = {};
                    var scope = options && options.scope ? options.scope : this,
                        callback = Ext.isFunction(options.failure) ? options.failure : null;

                    options.failure = function failure(form, action) {
                        if (action && action.response && action.response.responseText) {
                            for (var i in BIACore.Security.eamMessages) {
                                if (action.response.responseText.indexOf(BIACore.Security.eamMessages[i]) > -1) {
                                    self.location.reload();

                                    return false;
                                }
                            }
                        }

                        if (callback)
                            callback.call(scope, form, action);
                    };

                    this.callParent([options]);
                }
            });
        }

        // jQuery
        var $ = (typeof (jQuery) !== 'undefined') ? jQuery : null;
        if ($ !== null) {
            $(document).ajaxError(function (event, xhr, settings, thrownError) {
                if ([0, 511, 401, 403].indexOf(xhr.status) > -1) {
                    // me.login(); // Previously we send the page to login, with EAM and even how BIASecurity works a refresh of the page is better
                    self.location.reload();
                    // at this point, we've handled the exception, stop others from having to (maybe) deal with it.
                    return false;
                }
            });
        }
    });
});
