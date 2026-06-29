/**
 * @class BIACore.Cookie
 * @singleton
 * 
 * This defines functions for adding to, and reading from, cookies.
 */
BIACore.define('BIACore.Cookie', {
    onInit: function () {
        //var url = BIACore.Object.fromQueryString(window.location.search.slice(1));

        //if (url[BIACore.Config.sessionCookie] && BIACore.isLocalHost() && BIACore.Config.sessionId() != url[BIACore.Config.sessionCookie]) {
        //    BIACore.Logger.Message('BIACore.Cookie.onInit',
        //        BIACore.String.format("BIACoreCookieInit CreateSessionCookieFromURLQueryString{0}url = {1}{0}host = {3}{0}old session = {2}",
        //            ['\n', window.location.href, BIACore.Config.sessionId() || 'null',window.location.host]));
        //    BIACore.Config.sessionId(url[BIACore.Config.sessionCookie]);
        //}
        BIACore.Event.fire('load');
    }
}, function (me) {
    var defaultDomain = BIACore.isLocalHost() ? null : (window.location.host).replace(/^https?:\/\//g, ''),
        cookieRe = /\s?(.*?)=(.*?);/g;

    BIACore.apply(me, {
        /**
         * Fetch the given cookie if it exists.
         * 
         * @param {String} name the name of the cookie to fetch
         * @returns {String} the value of the cookie, or null if it doesn't exist
         */
        get: function (name) {
            var c = document.cookie + ';',
                matches;

            cookieRe.lastIndex = 0; // reset the regex between uses, otherwise there's start-at-last-index issues.
            while ((matches = cookieRe.exec(c)) !== null) {
                if (matches[1] === name) {
                    return unescape(matches[2]);
                }
            }
            return null;
        },

        /**
         * Set the given cookie.
         *
         * @param {String/Object} name the string name of the cookie, or an object that makes up the cookie
         * @param {String} value the value of the cookie
         * @param {String} [domain=current domain] the domain the cookie should adhere to
         * @param {String} [path=/] the path the cookie should to adhere to
         * @param {Date} [expires=24 hours] the expiration date of the cookie
         */
        set: function (name, value, domain, path, expires, secure) {
            // overloaded - can pass a config object or the individual parameters
            var args = BIACore.applyIf(BIACore.isObject(name) ? name : {}, {
                name: name,
                value: value,
                domain: domain || defaultDomain,
                path: path || '/',
                expires: expires || null,
                secure: secure || false
            });

            if (BIACore.String.isNullOrEmpty(args.name)) {
                BIACore.Console('Unable to set cookie with no name');
                return;
            }

            // if expires doesn't exist, make it exist.
            if (!BIACore.isDate(args.expires)) {
                args.expires = BIACore.Date.add(new Date(), BIACore.Date.DAY, 1);
            }

            document.cookie = args.name + '=' + escape(args.value)
                + ((args.expires === null) ? '' : ('; expires=' + args.expires.toUTCString()))
                + ((args.path === null) ? '' : ('; path=' + args.path))
                + ((args.domain === null) ? '' : ('; domain=' + args.domain))
                + ((args.secure === true) ? '; secure' : '');
        }
    });
});