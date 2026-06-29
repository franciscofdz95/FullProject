Ext.define('Ext.Theme', {
    singleton: true,

    getTheme: function () {
        var themeRe = /ext-theme-(?:(aria|classic|crisp|gray|neptune))(-sandbox|-touch)?.js/i,
            scripts = document.getElementsByTagName('script'),
            i = 0, len = scripts.length;

        for (; i < len; ++i) {
            if (themeRe.test(scripts[i].src)) {
                return themeRe.exec(scripts[i].src)[1];
            }
        }
    }
}, function (me) {
    Ext.getTheme = me.getTheme;
});