BIACore.define('BIACore.Config', {
}, function (me) {
    // we define a bunch of BIACore defaults here
    // figure out if we need to point at something other than the default server/serviceURI below
    var urlRe = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/,
        //parts = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'],
        biacoreRe = /biacore(\.min)?\.js/i,
        _transactionId = null,
        config = {
            appCode: '',
            environment: '',
            server: '',
            serviceURI: '',
            sessionCookie: 'BIASID',
            tokenCookie: 'BIATID',
            tokenQP: 'lhToken'
        };

    config.server = (BIACore.isLocalHost() ? "https:" : window.location.protocol) + '//' +
        //(BIACore.isLocalHost() && /localhost:59371/i.test(window.location.host) === false ? 'biaalpha.inside.ups.com' : window.location.host);
        (BIACore.isLocalHost() ? 'biaalpha.inside.ups.com' : window.location.host);

        if (config.server.split(".").length == 5 && !BIACore.isLocalHost()) {
            config.server = "https://" + config.server.split(".")[1] + "." + config.server.split(".")[2] + "." + config.server.split(".")[3] + "." + config.server.split(".")[4];
        }

    // set environment based on url
    if (/biadev/i.test(window.location.host) ) { config.environment = 'DEV'; }
    else if (/biaalpha/i.test(window.location.host) || /localhost/i.test(window.location.host) ) { config.environment = 'ALPHA'; }
    //else if (/biamir/i.test(window.location.host)) { config.environment = 'MIR'; }
    else if (/biaqa/i.test(window.location.host)) { config.environment = 'QA'; }
    //else if (/bia\./i.test(window.location.host) || /bia-[a-d]/i.test(window.location.host)) { config.environment = 'PROD'; }

    // figure out where biacore(.min).js is coming from
    var scripts = document.getElementsByTagName('script'),
        i = 0, len = scripts.length;

    for (; i < len; ++i) {
        if (biacoreRe.test(scripts[i].src)) {
            var path = urlRe.exec(scripts[i].src)[5],
                lastSlash = path.lastIndexOf('/');

            if (lastSlash < 0) {
                config.serviceURI = '/';
                if (BIACore.isLocalHost()) {
                    // localhost and no apparent path - testing biacore itself.
                    config.serviceURI = '/common/biacore/2.0/';
                }
            }
            else {
                config.serviceURI = '/' + path.slice(0, lastSlash) + '/';
            }
        }
    }

    config.serviceURI = config.server + config.serviceURI;

    var BIACoreVersion = {
        major: 3,
        minor: 0,
        update: BIABuild != null && BIABuild.version != null ? BIABuild.version : (new Date()).getFullYear() + ('00' + ((new Date()).getMonth() + 1)).substr(-2) + ('00' + (new Date()).getDate()).substr(-2),
        toString: function () {
            return this.major + '.' + this.minor + '.' + this.update
        }
    };

    // remove this once SalesDash is moved over to BIACore.Config.server
    BIACore.server = config.server;

    // use applyIf so a smart developer can override these values without worry that this will trash their config.
    BIACore.apply(me, config);
    BIACore.apply(me, {
        sessionId: function () {
            return BIACore.Security.Session.sessionId;
        },
        tokenLocal: function () {
            return BIACore.isLocalHost() ? BIACore.Cookie.get(me.tokenCookie) : null;
        },
        transactionId: function () {
            if (_transactionId == null) {                
                var sessionId = BIACore.Security.Session.sessionId, transLength = 36;
                if (sessionId == null) {
                    sessionId = [];
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA";
                    for (var i = 0; i < transLength; i++) {
                        sessionId.push(possible.charAt(Math.floor(Math.random() * possible.length)));
                    }
                    sessionId = sessionId.join('');
                }
                var tranId = '';
                for (var i = 0; i < sessionId.length; i++) {
                    if (/[a-zA-Z0-9]/.test(sessionId.charAt(i))) tranId += sessionId.charAt(i);
                    if ([8, 13, 18, 23].indexOf(tranId.length) > -1) tranId += '-';
                    if (tranId.length == transLength) break;
                }
                _transactionId = tranId;
            }

            return _transactionId;
        },
        getVersion: function () { return BIACoreVersion.major + '.' + BIACoreVersion.minor + '.' + BIACoreVersion.update; },
        currentVersion: BIACoreVersion.toString(),
        version: {
            major: BIACoreVersion.major,
            minor: BIACoreVersion.minor,
            update: BIACoreVersion.update
        }
    });
});
