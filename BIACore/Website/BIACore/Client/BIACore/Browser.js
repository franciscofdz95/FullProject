BIACore.define('BIACore.Browser', {
    is: function (name) {
        return !!this[name];
    },
    setFlag: function (name, value) {
        if (value === undefined) {
            value = true;
        }

        if (this.flags) {
            this.flags[name] = value;
        }
        this.is[name] = value;
        this.is[name.toLowerCase()] = value;

        return this;
    },
    name: null
    
}, function (me) {
    var dataBrowser = [
        { string: navigator.userAgent, subString: "Edge", identity: "Edge" },
        { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
        { string: navigator.userAgent, subString: "OmniWeb", versionSearch: "OmniWeb/", identity: "OmniWeb" },
        { string: navigator.userAgent, subString: "PhantomJS", versionSearch: "PhantomJS/", identity: "PhantomJS" },
        { string: navigator.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version" },
        { prop: window.opera, identity: "Opera", versionSearch: "Version" },
        { string: navigator.vendor, subString: "iCab", identity: "iCab" },
        { string: navigator.vendor, subString: "KDE", identity: "Konqueror" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.vendor, subString: "Camino", identity: "Camino" },
        // IE 11+
        { string: navigator.userAgent, subString: "Trident", identity: "IE", versionSearch: "rv", versionStrict: "11" },
        // IE 10-
        { string: navigator.userAgent, subString: "MSIE", identity: "IE", versionSearch: "MSIE" },
        { string: navigator.userAgent, subString: "Gecko", identity: "Mozilla", versionSearch: "rv" },
        // for newer Netscapes (6+)
        { string: navigator.userAgent, subString: "Netscape", identity: "Netscape" },
        // for older Netscapes (4-)
        { string: navigator.userAgent, subString: "Mozilla", identity: "Netscape", versionSearch: "Mozilla" }
    ],
    dataOS = [
        { string: navigator.platform, subString: "Win", identity: "Windows" },
        { string: navigator.platform, subString: "Mac", identity: "Mac" },
        { string: navigator.userAgent, subString: "iPhone", identity: "iPhone/iPod" },
        { string: navigator.platform, subString: "Linux", identity: "Linux" }
    ],
    names= {
        ios: 'iPhone',
        ipad: 'iPad',
        android: 'Android',
        windowsPhone: 'WindowsPhone',
        webos: 'webOS',
        blackberry: 'BlackBerry',
        rimTablet: 'RIMTablet',
        mac: 'MacOS',
        win: 'Windows',
        tizen: 'Tizen',
        linux: 'Linux',
        bada: 'Bada',
        chrome: 'ChromeOS',
        other: 'Other'
    },
    prefixes= {
        tizen: '(Tizen )',
        ios: 'i(?:Phone|Pod)(?:.*)CPU(?: iPhone)? OS ',
        ipad: 'i(?:Pad)(?:.*)CPU(?:.*)? OS ',
        android: '(Android |HTC_|Silk/)', // Some HTC devices ship with an OSX userAgent by default, 
        // so we need to add a direct check for HTC_ 
        windowsPhone: 'Windows Phone ',
        blackberry: '(?:BlackBerry|BB)(?:.*)Version\/',
        rimTablet: 'RIM Tablet OS ',
        webos: '(?:webOS|hpwOS)\/',
        bada: 'Bada\/',
        chrome: 'CrOS '
    },
    searchString = function (data) {
        var i = 0,
            dl = data.length;
        for (; i < dl; ++i) {
            var item = data[i],
                dataString = item.string,
                dataProp = item.prop;
            me.versionSearchString = item.versionSearch || item.identity;
            if (item.versionStrict) me.version = item.versionStrict;
            if (dataString) {
                if (dataString.indexOf(item.subString) !== -1) {
                    return item.identity;
                }
            }
            else if (dataProp) {
                return item.identity;
            }
        }
    },
    searchVersion = function (dataString) {
        if (me.version == null) {
            var index = dataString.indexOf(me.versionSearchString);
            if (index === -1) { return; }
            var endIndex = dataString.indexOf('.', index + me.versionSearchString.length + 1),
                startIndex = index + me.versionSearchString.length + 1;
            return parseFloat(dataString.substring(startIndex, endIndex < startIndex ? len(dataString) : endIndex));
        }
        else return me.version;
    },
    name, i, prefix, match, item, match1;

    for (i in prefixes) {
        if (prefixes.hasOwnProperty(i)) {
            prefix = prefixes[i];

            match = navigator.userAgent.match(new RegExp('(?:' + prefix + ')([^\\s;]+)'));

            if (match) {
                name = names[i];
                match1 = match[1];
                break;
            }
        }
    }

    if (!name) {
        name = names[(navigator.userAgent.toLowerCase().match(/mac|win|linux/) || ['other'])[0]];
    }

    me.name = name;
    me.setFlag(name);

    for (i in names) {
        if (names.hasOwnProperty(i)) {
            item = names[i];

            if (!item.hasOwnProperty(name)) {
                this.setFlag(item, (name === item));
            }
        }
    }

    // Detect if the device is the iPhone 5. 
    if (me.name === "iOS" && window.screen.height === 568) {
        me.setFlag('iPhone5');
    }

    var search = window.location.search.match(/deviceType=(Tablet|Phone)/),
        nativeDeviceType = window.deviceType;

    // Override deviceType by adding a get variable of deviceType. NEEDED FOR DOCS APP. 
    // E.g: example/kitchen-sink.html?deviceType=Phone 
    if (search && search[1]) {
        deviceType = search[1];
    }
    else if (nativeDeviceType === 'iPhone') {
        deviceType = 'Phone';
    }
    else if (nativeDeviceType === 'iPad') {
        deviceType = 'Tablet';
    }
    else {
        if (!me.is.Android && !me.is.iOS && !me.is.WindowsPhone && /Windows|Linux|MacOS/.test(me.name)) {
            deviceType = 'Desktop';

            // always set it to false when you are on a desktop not using Ripple Emulation 
            //Ext.browser.is.WebView = !!Ext.browser.is.Ripple;
        }
        else if (me.is.iPad || me.is.RIMTablet || me.is.Android3 ||
                 //Ext.browser.is.Silk ||
                (me.is.Android4 && userAgent.search(/mobile/i) === -1)) {
            deviceType = 'Tablet';
        }
        else {
            deviceType = 'Phone';
        }
    }

    /**
     * @property {String} deviceType 
     * The generic type of the current device.
     *
     * Possible values:
     *
     * - Phone
     * - Tablet
     * - Desktop
     *
     * For testing purposes the deviceType can be overridden by adding
     * a deviceType parameter to the URL of the page, like so:
     *
     *     http://localhost/mypage.html?deviceType=Tablet
     *
     */
    me.setFlag(deviceType, true);
    me.deviceType = deviceType;

    BIACore.apply(me, {
        browser: searchString(dataBrowser) || "An unknown browser",
        version: searchVersion(navigator.userAgent)
            || searchVersion(navigator.appVersion)
            || "",
        OS: searchString(dataOS) || "An unknown OS",
        compatibilityMode: navigator.userAgent.indexOf("(compatible;") > -1
    });

    if (document.documentMode && me.version !== document.documentMode) {
        BIACore.apply(me, {
            mode: document.documentMode
        });
    }

    var addEnvironmentToDocumentTitle = function () {
        var env = BIACore.isLocalHost() ? 'LOCAL' : BIACore.Config.environment,
            titlePrefix = env != '' ? titleEnvSymbols[env][0] + env + titleEnvSymbols[env][1] : '';
        if (document.title != null && document.title.indexOf(titlePrefix) == -1 && env != '') {
            document.title = titlePrefix + ' ' + document.title;
        }
        else {
            if(++titleSetAttempts < 50) setTimeout(addEnvironmentToDocumentTitle, 10);
        }
    },
    titleSetAttempts = 0,
    titleEnvSymbols = {
        LOCAL: ['+','+'],
        DEV: ['*','*'],
        QA: ['[', ']'],
        ALPHA: ['^', '^'],
        MIR: ['~','~']
    };

    BIACore.onReady(addEnvironmentToDocumentTitle);
});

//(function () {
//    var hidden = "hidden";

//    // Standards:
//    if (hidden in document)
//        document.addEventListener("visibilitychange", onchange);
//    else if ((hidden = "mozHidden") in document)
//        document.addEventListener("mozvisibilitychange", onchange);
//    else if ((hidden = "webkitHidden") in document)
//        document.addEventListener("webkitvisibilitychange", onchange);
//    else if ((hidden = "msHidden") in document)
//        document.addEventListener("msvisibilitychange", onchange);
//        // IE 9 and lower:
//    else if ("onfocusin" in document)
//        document.onfocusin = document.onfocusout = onchange;
//        // All others:
//    else
//        window.onpageshow = window.onpagehide
//        = window.onfocus = window.onblur = onchange;

//    function onchange(evt) {
//        var v = "visible", h = "hidden",
//            evtMap = {
//                focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
//            };

//        evt = evt || window.event;
//        if (evt.type in evtMap) {
//            document.body.className = evtMap[evt.type];
//        }
//        else {
//            document.body.className = this[hidden] ? "hidden" : "visible";
//        }

//        if(BIACore && BIAcore.Browser) BIACore.Browser.hidden = (document.body.className == h);
//    }

//    // set the initial state (but only if browser supports the Page Visibility API)
//    if (document[hidden] !== undefined)
//        onchange({ type: document[hidden] ? "blur" : "focus" });
//})();