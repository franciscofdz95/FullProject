/*
 * This is the javascript side of the Login page.
 * Since I got tired of maintaining it in 2 different places (aspx + js)
 *  * aspx would detect if the user was already logged in at start
 *  * js would deal with the same logic after the user logged in
 * I have combined all of the control logic into one place (js). This
 * will help reduce duplicate code paths and make maintenance generally
 * easier.
 * 
 * Since I have a 'class' type system built in BIACore, I will
 * make copius use of it here. Also BIACore's jQuery.
 */

/**
 * Login.TempMessage
 * This is a shortcut to the 'Error' Panel.
 */

BIACore.Header.inject('BIAHeader', { showButtonBar: false });

BIACore.define('Login.TempMessage', {
    //item: 'div.instructions',
    item: 'div.tempMessage',
    onReady: function () {
        this.el = BIACore.$(this.item);
        this.originalWidth = this.el.width();
        this.positionMessage();
        //BIACore.$(this.item + ' a').attr('href', "mailto:merdmann@ups.com?subject=Login%20Support/Help for " + Login.Params.appCode.toUpperCase())
        BIACore.$(window).resize(BIACore.$.proxy(this.positionMessage, this));
    },
    positionMessage: function () {
        if (BIACore.$('div.loginBox').is(':visible')) {
            if (BIACore.Browser.deviceType != 'Desktop') {
                //BIACore.$('div.loginBox').addClass('Mobile');

                var width = this.originalWidth;
                var left = BIACore.$('div.loginBox').offset().left + (BIACore.$('div.loginBox').width() / 2) - (this.el.width() / 2);
                //var leftMargin = 40;
                //var windowWidth = BIACore.$(window).width() - 40;
                //if (width + left + leftMargin > windowWidth) {
                //    width = windowWidth - (left + leftMargin);
                //}
                this.el.css({ marginTop: 40, left: left, width: width, display: 'block', marginLeft: 0 });
            }
            else {

                var width = this.originalWidth;
                var left = BIACore.$('div.loginBox').offset().left + BIACore.$('div.loginBox').width();
                var leftMargin = 40;
                var windowWidth = BIACore.$(window).width() - 40;
                if (width + left + leftMargin > windowWidth) {
                    width = windowWidth - (left + leftMargin);
                }

                var top = BIACore.$('div.loginBox').offset().top;


                this.el.css({ top: top, left: left + leftMargin, width: width, display: 'block' });
            }
        }
    }
});

/**
 * Login.Params
 * An easy object for accessing all of the query string parameters
 * Note: Needs to be first since it's referenced in the 'init' type 
 * method of Login.
 */
BIACore.define('Login.Params', {
    onReady: function () {
        this.application = {
            useSSL: true,
            appOnline: BIACore.$('#fld_apponline') && BIACore.$('#fld_apponline').val() == "0" ? false : true,
            appCode: BIACore.$('#fld_appcode').val(),
            appCodeAlt: BIACore.$('#fld_appcodealt').val(),
        };

        this.session = {
            status: BIACore.$('#fld_usessl') && BIACore.$('#fld_sstatus').val()
        }

        this.localhost = BIACore.$('#fld_islh') && BIACore.$('#fld_islh').val() == "0" ? false : true;

        this.appCode = BIACore.$('#fld_appcode').val().toLowerCase();
    }
}, function (me) {
    BIACore.apply(me, BIACore.Object.fromQueryString(window.location.search.slice(1)));
    if (window.location.hash != '' && this.returnUri) {
        if (window.location.hash.indexOf('&') == -1) {
            this.returnUri += window.location.hash;
        }
        else {
            var hashSplit = window.location.hash.split('&');
            this.returnUri += hashSplit.splice(0, 1);
            BIACore.apply(me, BIACore.Object.fromQueryString('&' + hashSplit.join('&')));
        }
    }
});

/**
 * Login.User
 * This is a shortcut to the 'User' field.
 */
BIACore.define('Login.User', {
    item: '#BIA_Login',
    goodItem: '#BIA_Login_Good',
    warningItem: '#BIA_Login_Warning',
    badItem: '#BIA_Login_Bad',
    loadingItem: '#BIA_Login_Loading',
    minChars: 4,
    onReady: function () {
        this.goodIcon = BIACore.$(this.goodItem);
        this.warningIcon = BIACore.$(this.warningItem);
        this.badIcon = BIACore.$(this.badItem);
        this.loadingIcon = BIACore.$(this.loadingItem);

        this.el = BIACore.$(this.item);

        var keyUpTimeout = null;
        this.el.keyup(function (event) {
            clearTimeout(keyUpTimeout);
            keyUpTimeout = window.setTimeout(BIACore.$.proxy(Login.User.onKeyUp, Login.User, event), 250);
        });

        // Garrett Hogan 04/27/2016 - Added to handle browser autocomplete form fill to trigger Login Button disabled status change
        this.el.autocomplete({ source: BIACore.$.proxy(this.onAutocomplete, this) });

        this.el.focus(function (event) { Login.retryLoginReset = false; });

        this.el.focus();

        //window.setTimeout(Login.User.usernameValidation, 50);
    },
    getValue: function () {
        //Temporary til we switch over to full domain authentication
        return this.el.val().replace('us\\', '').replace('us/', '');
    },
    onKeyUp: function (event) {        
        if (Login.autofillCheck != null) {
            clearInterval(Login.autofillCheck);
            Login.autofillCheck = null;
        }

        Login.Button.setDisabled(!Login.isValid());

        // Garrett Hogan 04/27/2016 - Changed to allow for enter in User field if login is valid to trigger authenticate
        // they should be using tab to jump to the next field...
        if (event.keyCode === 13 && !Login.isValid()) {
            Login.Pass.focus();
        }
        else if (event.keyCode === 13 && Login.isValid()) {
            Login.authenticate();
        }

        //Login.User.usernameValidation();

        //Custom override for QA to skip JS validation
        if (Login.Params.noval != null) {
            Login.User.error = false;
            Login.User.warning = false;
            Login.Error.error(Login.lockoutMessage || null);
            Login.Error.message(null);
            return;
        }

        usernameToValidate = Login.User.val().indexOf('=') > -1 ? Login.User.val().split('=')[1] : Login.User.val();
        //if (console) console.log('UsernameToValidate = ' + usernameToValidate);

        if (usernameToValidate.length > 0 && usernameToValidate.length < Login.User.minChars) {
            Login.User.errMsg = 'Username entered is too short, minimum</br>username length is ' + Login.User.minChars + ' characters.';
            Login.Error.error(Login.User.errMsg);
            Login.User.warning = false;
            Login.User.message = null;
            Login.Error.message(Login.User.message);
        }
        else {
            Login.User.message = null;
            if (event.keyCode !== 13) Login.Error.message(Login.User.message);
            Login.User.error = false;
            Login.User.errMsg = null;
            if (event.keyCode !== 13) Login.Error.error(Login.Pass.errMsg);
        }

        if (Login.isValid()) Login.retryLoginReset = false;
    },
    // Garrett Hogan 04/27/2016 - Added to handle browser autocomplete form fill to trigger Login Button disabled status change
    onAutocomplete: function (event) {
        Login.Button.setDisabled(!Login.isValid());
    },
    isValid: function () {
        return (Login.Params.noval != null ? true : (this.el.val().length > Login.User.minChars && !this.error));
    },
    blur: function () {
        this.el.blur();
    },
    focus: function () {
        this.el.focus();
    },
    val: function (v) {
        return (v) ? this.el.val(v) : this.el.val();
    },
    setDisabled: function (disabled) {
        this.el.prop('disabled', disabled);
    }
});

/**
 * Login.Pass
 * This is a shortcut to the 'Pass' field.
 */
BIACore.define('Login.Pass', {
    item: '#BIA_Pass',
    badItem: '#BIA_Pass_Bad',
    onReady: function () {
        this.badIcon = BIACore.$(this.badItem);

        this.el = BIACore.$(this.item);

        var keyUpTimeout = null;
        this.el.keyup(function (event) {
            clearTimeout(keyUpTimeout);
            keyUpTimeout = window.setTimeout(BIACore.$.proxy(Login.Pass.onKeyUp, Login.Pass, event), 750);
        });

        // Garrett Hogan 04/27/2016 - Added to handle browser autocomplete form fill to trigger Login Button disabled status change
        this.el.autocomplete({ source: BIACore.$.proxy(this.onAutocomplete, this) });

        this.el.focus(function (event) { Login.retryLoginReset = false; });
    },
    onKeyUp: function (event) {
        if (Login.autofillCheck != null) {
            clearInterval(Login.autofillCheck);
            Login.autofillCheck = null;
        }

        // enable/disable login button
        Login.Button.setDisabled(!Login.isValid());
        Login.Pass.errMsg = null;
        Login.Pass.badIcon.css({ display: 'none' });

        // check for submit validity
        if (event && event.which === 13) {
            Login.authenticate();
        }

        if (Login.Params.noval == null) {
            if (Login.Pass.val().length > 0 && !Login.Pass.isValid()) {
                Login.Pass.badIcon.css({ display: 'inline-block' });
                Login.Pass.errMsg = 'Password entered is too short, minimum</br>password length is 6 characters.';
                Login.Error.error(Login.Pass.errMsg);
            }
            else if (Login.Pass.isValid() && (Login.User.error && Login.User.warning)) {
                Login.Pass.errMsg = null;
                Login.Error.error(Login.User.errMsg);
            }
            else {
                if(event.keyCode != null) Login.Error.error(Login.User.errMsg || Login.Pass.errMsg);
            }
        }
        else {
            //Custom override for QA to skip JS validation
            Login.Pass.message = null;
            if (event.keyCode != null) Login.Error.message(null, false);
        }

        if (Login.Pass.val() != null && Login.Pass.val() != '') Login.Pass.autofillValid = false;

        if (Login.isValid()) Login.retryLoginReset = false;
    },
    // Garrett Hogan 04/27/2016 - Added to handle browser autocomplete form fill to trigger Login Button disabled status change
    onAutocomplete: function (event) {
        Login.Button.setDisabled(!Login.isValid());
    },
    isValid: function (checkInputLength) {
        var usernameFocus = BIACore.$(Login.User.item + ':focus').length > 0;

        if (checkInputLength) {
            this.el[0].select();
            if (this.el[0].selectionEnd > 0) this.autofillValid = true;
            this.el[0].selectionStart = this.el[0].selectionEnd;
            //if (usernameFocus) Login.User.focus();
        }
        var valid = (Login.Params.noval != null ? true : (this.val().length > 5 || this.autofillValid));
        return valid;
    },
    blur: function () {
        this.el.blur();
    },
    focus: function () {
        this.el.focus();
    },
    val: function (v) {
        return (v) ? this.el.val(v) : this.el.val();
    },
    setDisabled: function (disabled) {
        this.el.prop('disabled', disabled);
    }
});

/**
 * Login.Button
 * This is a shortcut to the 'Login' Button.
 */
BIACore.define('Login.Button', {
    item: '#login',
    onReady: function () {
        this.el = BIACore.$(this.item);
        this.el.click(BIACore.$.proxy(this.onClick, this));
        this.setDisabled(true);
    },
    onClick: function () {
        if (this.el.prop('disabled') === false) Login.authenticate();
    },
    setDisabled: function (disabled) {
        this.el.prop('disabled', disabled);
    }
});

/**
 * Login.Error
 * This is a shortcut to the 'Error' Panel.
 */
BIACore.define('Login.Error', {
    //item: 'div.instructions',
    item: 'div.messages',
    defaultMessage: 'Enter your ID and password to login and continue.',
    loadingAppClass: 'loadingApp',
    onReady: function () {
        this.el = BIACore.$(this.item);
        this.message(this.defaultMessage, false);
    },
    error: function (error) {
        var errBlock = BIACore.$(Login.Error.item + ' .newError');
        errBlock.html(error || '');
        if (error) errBlock.addClass('visible');
        else errBlock.removeClass('visible');
    },
    message: function (msg) {
        var msgBlock = BIACore.$(Login.Error.item + ' .info');
        msgBlock.html(msg || Login.Error.defaultMessage);
        msgBlock.removeClass(Login.Error.loadingAppClass);
    }
});

/**
 * Login.RequestId
 * This is a shortcut to the 'RequestId' Panel.
 */
BIACore.define('Login.RequestId', {
    item: '#RequestId',
    trigger: '#RequestIdTrigger',
    onReady: function () {
        this.el = BIACore.$(this.item).dialog({
            title: 'Create BIA User Profile',
            modal: true,
            resizable: false,
            autoOpen: false,
            width: 500
        });

        BIACore.$(this.trigger).click(BIACore.$.proxy(this.onClick, this));
    },
    onClick: function () {
        this.el.dialog('open');
    }
});

/**
 * Login.ForgotId
 * This is a shortcut to the 'ForgotId' Panel.
 */
BIACore.define('Login.ForgotId', {
    item: '#ForgotId',
    trigger: '#ForgotIdTrigger',
    onReady: function () {
        this.el = BIACore.$(this.item).dialog({
            title: 'Forgotten ID',
            modal: true,
            resizable: false,
            autoOpen: false,
            width: 500
        });

        BIACore.$(this.trigger).click(BIACore.$.proxy(this.onClick, this));
    },
    onClick: function () {
        this.el.dialog('open');
    }
});

/**
 * Login.ForgotPass
 * This is a shortcut to the 'ForgotPass' Panel.
 */
BIACore.define('Login.ForgotPass', {
    item: '#ForgotPass',
    trigger: '#ForgotPassTrigger',
    onReady: function () {
        this.el = BIACore.$(this.item).dialog({
            title: 'Forgotten Password',
            modal: true,
            resizable: false,
            autoOpen: false,
            width: 500
        });

        BIACore.$(this.trigger).click(BIACore.$.proxy(this.onClick, this));
    },
    onClick: function () {
        this.el.dialog('open');
    }
});

/**
 * Login.RequestAccess
 * This is a shortcut to the 'RequestAccess' Panel.
 * 
 * fld_NoAccess = 1 && fld_Pending = 0
 */
BIACore.define('Login.RequestAccess', {
    item: '#RequestAccess'
}, function (me) {
    var _accepted = false,
        _dataLoaded = false,
        _user = {};

    var requestAccess = function () {
        if (_accepted) {
            //var url = BIACore.Config.server + '/bia/apps/BIASecurity/unsecure/index.cfm?' +
            //    BIACore.$.param({
            //        action: 'UserAdmin.RequestApplicationUserGeoAccess',
            //        sysm: BIACore.$('#fld_User').val(), //replace with fld_User value
            //        fName: BIACore.$('#fld_FirstName').val(), //replace with fld_FirstName value
            //        lName: BIACore.$('#fld_LastName').val(), //replace with fld_LastName value
            //        appCode: BIACore.$('#fld_appcode').val(),
            //        appName: BIACore.$('#fld_appcode').val()
            //    });
            if (BIACore.Config.environment == '') var url = 'https://biasecurity.bia.inside.ups.com/default.aspx?accessRequest=' + BIACore.$('#fld_appcode').val();
            if (BIACore.Config.environment == 'PROD') var url = 'https://biasecurity.bia.inside.ups.com/default.aspx?accessRequest=' + BIACore.$('#fld_appcode').val();
            if (BIACore.Config.environment == 'ALPHA') var url = 'https://biasecurity.biaalpha.inside.ups.com/default.aspx?accessRequest=' + BIACore.$('#fld_appcode').val();
            if (BIACore.Config.environment == 'DEV') var url = 'https://biasecurity.biadev.inside.ams1907.com/default.aspx?accessRequest=' + BIACore.$('#fld_appcode').val();

            BIACore.Console('Redirecting to ' + url);
            // and redirect user to access request
            window.location.href = url;
        }
    };

    BIACore.onReady(function () {
        Login.RequestAccess.el = BIACore.$(Login.RequestAccess.item).dialog({
            title: 'Request Access',
            modal: true,
            resizable: false,
            autoOpen: false,
            dialogClass: 'no-close',
            closeOnEscape: false,
            width: 500,
            buttons: {
                Yes: function () { _accepted = true; requestAccess(); },
                No: function () { window.close(); }
            }
        });
    });

    BIACore.apply(me, {
        launch: function () {
            Login.RequestAccess.el.dialog('open');
        }
    });
});

/**
 * Login.AccessRequested
 * This is a shortcut to the 'AccessRequested' Panel.
 * 
 * fld_NoAccess = 1 && fld_Pending = 1
 */
BIACore.define('Login.AccessRequested', {
    item: '#AccessRequested',
    onReady: function () {


        this.el = BIACore.$(this.item).dialog({
            title: 'Access Requested',
            modal: true,
            resizable: false,
            autoOpen: false,
            width: 500,
            buttons: {
                OK: function () {
                    window.close();
                }
            }
        });
    },
    launch: function () {
        this.el.dialog('open');
    }
});

/**
 * Login.Offline
 * This is a shortcut to the 'Offline' Panel.
 * 
 * fld_Offline = 1
 */
BIACore.define('Login.Offline', {
    item: '#Offline',
    appOfflineItem: '#AppOfflineMsg',
    appOfflineMsg: null,
    onReady: function () {
        this.el = BIACore.$(this.item).dialog({
            title: 'Application Offline',
            modal: true,
            resizable: false,
            autoOpen: false,
            width: 500,
            buttons: {
                OK: function () {
                    // redirect to reports.
                    var url = BIACore.Config.server + '/home';

                    BIACore.Console('Redirecting to ' + url);
                    window.location.href = url;
                }
            }
        });
    },
    launch: function () {
        if (this.appOfflineMsg != null) {
            BIACore.$(this.appOfflineItem).html(this.appOfflineMsg);
            BIACore.$(this.appOfflineItem).show();
        }
        else {
            BIACore.$(this.appOfflineItem).html('');
            BIACore.$(this.appOfflineItem).hide();
        }
        this.el.dialog('open');
    }
});

/**
 * Login.NewUser
 * This is a shortcut to the 'New User' Panel.
 * 
 * fld_NewUser = 1
 */
BIACore.define('Login.NewUser', {
    item: '#NewUser',
    onReady: function () {
        this.el = BIACore.$(this.item).dialog({
            title: 'New User',
            modal: true,
            resizable: false,
            autoOpen: false,
            width: 500,
            buttons: {
                OK: function () {
                    //var url = BIACore.Config.server + '/bia/apps/BIASecurity/unsecure/index.cfm?' +
                    //    BIACore.$.param({
                    //        action: 'UserAdmin.NewUserProfile'
                    //    });
                    if (BIACore.Config.environment == '') var url = 'https://biasecurity.bia.inside.ups.com/NewUser.aspx';
                    if (BIACore.Config.environment == 'PROD') var url = 'https://biasecurity.bia.inside.ups.com/NewUser.aspx';
                    if (BIACore.Config.environment == 'ALPHA') var url = 'https://biasecurity.biaalpha.inside.ups.com/NewUser.aspx';
                    if (BIACore.Config.environment == 'DEV') var url = 'https://biasecurity.biadev.inside.ams1907.com/NewUser.aspx';

                    BIACore.Console('Redirecting to ' + url);
                    // and redirect user to profile creation
                    window.location.href = url;
                },
                Cancel: function () {
                    window.close();
                }
            }
        });
    },
    launch: function () {
        this.el.dialog('open');
    }
});

BIACore.define('Login.ProblemMessage', {
    item: '#ProblemMessage',
    onReady: function () {
        this.el = BIACore.$(this.item).dialog({
            title: 'Authentication Connection Error',
            modal: true,
            resizable: false,
            autoOpen: false,
            width: 500,
            buttons: {
                OK: function () {
                    window.close();
                },
                Cancel: function () {
                    window.close();
                }
            }
        });
    },
    launch: function () {
        this.el.dialog('open');
    }
});

/**
 * Login
 * This is the "major" part of the login page.
 * On load, it fires off a request to get the current (if any) session 
 * information, and then waits until BIACore.onReady to act on it.
 * 
 * If the user is already logged in, we try to figure out why they
 * were sent here - and then handle appropriately.
 * If the user is not logged in, let them.
 * If the user does not have access, let them request it.
 * If the application is "offline", let the user know.
 */
BIACore.define('Login', {
    /*
    //loadingAppMessage: '<i class="fa fa-spinner fa-pulse" style="color:#3386c2;"></i>Loading ' +
    //    Login.Params.appCode.toUpperCase() + ' Application',
    loadingAppMessage: '<img src="images/BIA_Spinner_50.' + (BIACore.Browser.browser === 'IE' ? 'png' : 'gif') + '"></img>' +
        '<div class="loadingAppMessage">Loading ' + Login.Params.appCode.toUpperCase() + ' Application</div>',
    // redirect user to the given URL.
    // primarily used post-successful login, so we have a method to look
    // up a url if none was provided.
    showLoadingAppMessage: function () {
        Login.Error.message(Login.loadingAppMessage);
        var msgBlock = BIACore.$(Login.Error.item);
        if (msgBlock) msgBlock.addClass(Login.Error.loadingAppClass);
    }*/
}, function (me) {
    var maskTarget = '.login',
        maskText = '.login .loadmask-msg div',
        timeout = false;

    var _secureURITransform = function _secureURITransform(uri) {
        if (BIACore.Config.environment === 'MIR' || Login.Params.application.useSSL !== 1) return uri.replace('https://bia', 'http://bia');
        else return uri.replace('http://bia', 'https://bia');
    }

    // having some issues with scope - also there's no real reason maskTarget/maskText need to be "changeable".
    BIACore.apply(me, {
        unknownErrorCount: 0,
        // Is the login operation valid - e.g. not in timeout,
        // and has the appropriate fields.
        isValid: function () {
            return (!timeout && Login.User.isValid() && Login.Pass.isValid());
        },

        // for making the callback to the server page for authentcation and redirect/result return
        authenticate: function () {
            if (Login.isValid()) {
                BIACore.Console('Authenticating...');
                //BIACore.$(this.maskTarget).mask('Authenticating...');
                Login.Error.error(null);
                Login.Error.message('<i class="fa fa-spinner fa-pulse" style="color:#3386c2;"></i>Authenticating');
                Login.Button.el.addClass('authenticating');
                Login.Button.setDisabled(true);
                Login.authError = null;

                //Replace with Page PostBack for server-side auth call and redirect/error return
                BIACore.$('#fld_un').val(Login.User.getValue().toLowerCase());
                BIACore.$('#fld_ac').val(Login.Pass.val());
                BIACore.$('#fld_source').val(BIACore.Browser.browser + BIACore.Browser.version);

                var prm = Sys.WebForms.PageRequestManager.getInstance();
                if (prm != null) {
                    prm.add_endRequest(function (sender, e) {
                        if (sender._postBackSettings.panelsToUpdate == null && Login.retryLoginReset !== true)
                            Login.loginResult(true, sender, e);
                    });
                }

                //Clear previous unsuccessful login attempt return fields to prevent bad Request.Form values on authentication attempt
                BIACore.$('#fld_Error').val(null);
                BIACore.$('#fld_Lockout').val(null);
                BIACore.$('#fld_Timeout').val(null);
                BIACore.$('#fld_LoginAs').val(null);
                BIACore.$('#fld_NoAccess').val(null);
                BIACore.$('#fld_FirstName').val(null);
                BIACore.$('#fld_LastName').val(null);
                BIACore.$('#fld_User').val(null);
                BIACore.$('#fld_Pending').val(null);
                BIACore.$('#fld_Offline').val(null);
                BIACore.$('#fld_AppOfflineMsg').val(null);
                BIACore.$('#fld_NewUser').val(null);

                //BIACore.$('#frm_postback').submit(this.loginResult);
                BIACore.$('#lnk_FormSubmit').click();
            }
        },

        // deal with the result of the Authenticator service call in authenticate
        loginResult: function (success, returnData, call) {
            var data = {
                Error: BIACore.$('#fld_Error').val(),
                Lockout: BIACore.$('#fld_Lockout').val() === "1",
                Timeout: BIACore.$('#fld_Timeout').val() * 1,
                LoginAs: BIACore.$('#fld_LoginAs').val() === "1",
                NoAccess: BIACore.$('#fld_NoAccess').val() === "1",
                FirstName: BIACore.$('#fld_FirstName').val(),
                LastName: BIACore.$('#fld_LastName').val(),
                User: BIACore.$('#fld_User').val(),
                Pending: BIACore.$('#fld_Pending').val() === "0",
                Offline: BIACore.$('#fld_Offline').val() === "1",
                AppOfflineMsg: BIACore.$('#fld_AppOfflineMsg').val(),
                NewUser: BIACore.$('#fld_NewUser').val() === "1"
            };

            BIACore.Console('Authentication failure');

            Login.Error.message(Login.User.message);
            Login.Button.el.removeClass('authenticating');

            Login.authError = data.Error == '' ? null : data.Error;

            // set error text.
            Login.Error.error(data.Error);

            // clear and focus password field
            Login.Pass.el.val('');
            Login.Pass.focus();

            // figure out what kind of error occurred.
            if (data.Lockout) {
                BIACore.Console('Account is locked for ' + data.Timeout + ' seconds');
                this.lockout(data.Timeout);
            } else if (data.LoginAs) {
                BIACore.Console('Not allowed to use LoginAs');
                var t = Login.User.getValue().split('=');
                // not allowed to login as - remove the attempt.
                Login.User.val((t.length > 1) ? t[1] : '');
            } else if (data.NoAccess && !data.Pending) {
                BIACore.Console('No Access to the specified application');
                Login.RequestAccess.launch();
            } else if (data.NoAccess && data.Pending) {
                BIACore.Console('Pending Access to the specified application');
                Login.AccessRequested.launch();            
            } else if (data.Offline) {
                Login.Offline.appOfflineMsg = data.AppOfflineMsg;
                BIACore.Console('Application offline');
                Login.Offline.launch();
            } else if (data.NewUser) {
                BIACore.Console('New User detected');
                Login.NewUser.launch();
            } else if (data.Error == '') {
                if (Login.unknownErrorCount > 3) {
                    Login.authError = 'Please contact ' +
                        '<a href="mailto:merdmann@ups.com;shogan@ups.com?subject=Login%20Persistent%20Error%20' +
                        Login.Params.appCode.toUpperCase().replace(/ /g, '%20') + '">BIA Security</a> regarding ' +
                        'this error and please include a full screen shot.'
                    Login.Error.error(Login.authError);
                }
                else {
                    Login.authError = 'Authentication error, try again.'
                    Login.Error.error(Login.authError);
                    Login.unknownErrorCount++;
                }
                BIACore.Console('Unknown Login failure');
            } else {
                BIACore.Logger.Message('Login Failure', 'Login attempt failed with no return error for Username = [' + Login.User.getValue() + ']')
            }

            Login.Button.setDisabled(!Login.isValid());
            Login.retryLoginReset = true;
        },

        // lock the user from attempting a login for the given duration (in seconds)
        lockout: function (duration) {
            timeout = true;
            Login.Pass.blur();

            //BIACore.$(maskTarget).mask('Locked');
            var end = + new Date() + duration * 1000,
                //message = BIACore.$(maskText),
                _task = BIACore.$.timer(function updateMessage() {
                    var seconds = ((end - +new Date()) / 1000) >> 0;
                    if (seconds > 0) {
                        var text = 'Account Locked Out. Retry in ',
                            hours = (seconds / 3600) >> 0,
                            seconds = seconds - hours * 3600,
                            minutes = (seconds / 60) >> 0,
                            seconds = seconds - minutes * 60;

                        text += (hours > 0)
                            ? (hours + ':' + BIACore.String.leftPad(minutes, 2, '0'))
                            : minutes;
                        text += ':' + BIACore.String.leftPad(seconds, 2, '0');

                        Login.lockoutMessage = text;
                        //message.text(text);
                        Login.Error.error(text);
                    } else {
                        //BIACore.$(maskTarget).unmask();
                        Login.lockoutMessage = null;
                        BIACore.$(':focus').blur().focus();
                        timeout = false;
                        _task.stop();
                        delete _task;
                    }
                }, 150, true);
        }
    });

    // the method for processing session data (if any) on startup.
    var startup = function () {

        //if (!BIACore.isLocalHost()) {
        //    BIACore.$('#loginWindow').hide();
        //}

        if (BIACore.$('#fld_sstatus').val() === "-1" && BIACore.$('#fld_un').val() != "" && BIACore.$('#fld_ac').val() != "") {
            Login.User.el.val(BIACore.$('#fld_un').val());
            BIACore.$('#fld_un').val(null);
            Login.Pass.el.val(BIACore.$('#fld_ac').val());
            BIACore.$('#fld_ac').val(null);
        }
        else if (BIACore.$('#fld_sstatus').val() === "2") {
            Login.RequestAccess.launch();
        }
        else if (BIACore.$('#fld_sstatus').val() === "3") {
            Login.RequestAccess.launch();
        }
        else if (BIACore.$('#fld_NewUser').val() === "1") {
            Login.NewUser.launch();
        }
        else {

            //Total hack to suppress the Login form when not localhost! M.Erdmann 10/12/2021
            //if (!BIACore.isLocalHost()) {
            //    Login.ProblemMessage.launch();
            //}
            //else {
                BIACore.$('#loginWindow').show();
                Login.User.setDisabled(false);
                Login.Pass.setDisabled(false);
                Login.User.focus();
                if (Login.User.isValid() && Login.Pass.isValid())
                    Login.Button.setDisabled(false);

                if (Login.User.isValid() && Login.Pass.isValid())
                        Login.Button.setDisabled(false);
            //}
        }

        BIACore.$('#BIA_AppCode').html(
            (Login.Params.application.appCodeAlt != null && Login.Params.application.appCodeAlt != '' ? Login.Params.application.appCodeAlt.toUpperCase() : Login.Params.appCode.toUpperCase())
            + (!Login.Params.application.appOnline ? ' [OFFLINE]' : '')
        );
    };

    // force the session processing to wait until after BIACore.onReady
    // so we can guarantee some fields are ready for us (Offline, Application Request)
    BIACore.onReady(function () {
        var deviceClass = '';
        //Add overall device-specific class
        if (BIACore.Browser.deviceType.toLowerCase() != 'desktop') deviceClass += ' Mobile';
        if (BIACore.Browser.deviceType.toLowerCase() == 'phone') deviceClass += ' Phone';
        if (BIACore.Browser.deviceType.toLowerCase() == 'tablet') deviceClass += ' Tablet';
        if (BIACore.Browser.browser == 'IE') deviceClass += ' IE';

        BIACore.$('.loginContents').addClass(deviceClass);
        //BIACore.$('.BIAMessageContainer').addClass(deviceClass);

        startup();

    });
});
