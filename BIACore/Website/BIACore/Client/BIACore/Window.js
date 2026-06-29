BIACore.define('BIACore.Window', {
}, function (me) {
    var windows = [],
        _defaultOptions = {
            status: 0,
            menubar: 0,
            scrollbars: 1,
            resizable: 1,
            toolbar: 0,
            location: 0,
            width: screen.availWidth - 10,
            height: screen.availHeight - 150,
            screenX: 5,
            screenY: 5,
            left: 5,
            top: 5
        },
        open = function (url, name, screenOptions, fullScreen, autoClose) {
            var name = (name || '_blank').replace(/\s+/g, ''),
                fullScreen = fullScreen || false,
                autoClose = autoClose || true,
                options = screenOptions || {},
                wind, opts = '';

            BIACore.applyIf(options, _defaultOptions);
            for (var prop in options) {
                if (options.hasOwnProperty(prop)) {
                    opts += ',' + prop + '=' + options[prop];
                }
            }
            opts = opts.slice(1);

            try {
                wind = window.open(url, name, opts, true);
                try { wind.moveTo(0, 0); } catch (e) { }
                try { wind.blur(); } catch (e) { } // required by chrome?
                if (fullScreen) { try { wind.resizeTo(screen.availWidth, screen.availHeight); } catch (e) { } }
                if (autoClose) { windows = [].concat(windows, wind); }
                try { wind.focus(); } catch (e) { }
            } catch (e) {
                BIACore.Console('Unable to open window to URI: ' + url);
                BIACore.Exception(e);
            }
            return wind;
        };

    BIACore.apply(me, {
        Open: function (url, name, params, screen) {
            window.OpenParameters = BIACore.JSON.stringify(params || {});
            return open(url, name, screen, false, true);
        },
        OpenMax: function (url, name, params) {
            window.OpenParameters = BIACore.JSON.stringify(params || {});
            return open(url, name, null, true, true);
        },
        Close: function () {
            BIACore.$.each(windows, function (wind) {
                try { wind.close(); } catch (e) { }
            });
        },
        OpenParameters: function () {
            var params = {};
            try {
                params = BIACore.JSON.parse(window.opener.OpenParameters);
            } catch (ex) { }
            return params;
        }
    });

    if (window.addEventListener) {
        window.addEventListener('beforeunload', me.Close);
    } else if (window.attachEvent) {
        window.attachEvent('onbeforeunload', me.Close);
        //} else {
        //    window['onbeforeunload'] = UtilWindow.Close;
    }
});
