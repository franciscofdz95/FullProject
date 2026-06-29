BIACore.define('BIACore.Loader', {
    script: function (url, success) {
        var script = document.createElement('script'),
            head = document.getElementsByTagName('head')[0],
            done = false;

        if (url === null || url === '') { return; }

        if (url.indexOf('http') < 0) { url = BIACore.Config.server + url; }

        BIACore.Console('loading script ' + url);

        // added cache-busting because it seemed smarter that way.
        script.src = BIACore.String.format('{url}?_dc={version}', {
            url: url,
            version: BIACore.Config.getVersion()
        });
        script.onload = script.onreadystatechange = function () {

            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                done = true;
                if (typeof (success) === 'function') {
                    success();
                }
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
                BIACore.Console('script loaded ' + url);
            }
        };
        head.appendChild(script);
    },

    css: function (url, specialLoad) {
        BIACore.Console('loading CSS ' + url);
        // added cache-busting because it seemed smarter that way.
        BIACore.$('head').append(BIACore.String.format('<link rel="{rel}" href="{url}?_dc={version}" type="text/css"{preload} />', {
            url: url,
            version: BIACore.Config.getVersion(),
            rel: specialLoad != null ? specialLoad : 'stylesheet',
            preload: specialLoad === 'preload' ? ' as="style" crossorigin' : ''
        }));
    },

    font: function (url,fontFileType) {
        BIACore.Console('loading Font ' + url);
        // added cache-busting because it seemed smarter that way.
        BIACore.$('head').append(BIACore.String.format('<link rel="preload" href="{url}" as="font" type="font/{fontFileType}" crossorigin/>', {
            url: url,
            fontFileType: fontFileType
        }));
    }
});