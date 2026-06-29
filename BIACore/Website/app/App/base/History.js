//Ext.define('App.History', {
//    // can't extend a singleton
//    //extend: 'Ext.util.History',
//    singleton: true,

//    sections: ['log', 'logdetail', 'version', 'header', 'myreports'],

//    cleanUrl: function (path) {
//        return path.replace(/^[^#]*#/, "#");
//    }
//}, function (me) {
//    var History = Ext.util.History,
//        pathRe = /^#!?/,
//        modules = [],
//        tokenizer;

//    Ext.apply(me, {
//        init: function () {
//            var sections = Ext.ClassManager.getByAlias('widget.App-Desktop').prototype.modules || [];

//            Ext.each(sections, function (section) {
//                var cfg = Ext.ClassManager.getByAlias('widget.' + section.xtype);
//                if (cfg) {
//                    modules.push({
//                        match: cfg.prototype.urlBase.toLowerCase(),
//                        config: section
//                    });
//                }
//            });

//            tokenizer = RegExp('!?(' + Ext.Array.pluck(modules, 'match').join('|') + ')(\\/(.*))?', 'i');

//            History.useTopWindow = false;
//            History.init(function () {
//                me.historyLoaded = true;
//                me.initialNavigate();
//            }, me);
//            History.on("change", function (token) {
//                me.navigate(token);
//            }, me);
//        },
//        initialNavigate: function () {
//            if (me.loaded && me.historyLoaded) {
//                me.navigate(History.getToken(), true);
//            }
//        },
//        navigate: function (url, load) {
//            if (!load) return;

//            var token = me.parseToken(url);

//            if (!token || !token.type) return;

//            var module = Ext.Array.findBy(modules, function (module) {
//                return module.match == token.type;
//            });

//            if (!module) return;

//            var desktop = Ext.ComponentQuery.query('[xtype="App-Desktop"]');
//            desktop = (desktop && desktop.length > 0) ? desktop[0] : null;

//            if (!desktop) return;

//            desktop.createWindow(Ext.apply({}, { data: token.params }, module.config));
//        },
//        notifyLoaded: function () {
//            me.loaded = true;
//            me.initialNavigate();
//        },
//        push: function (path) {
//            path = me.cleanUrl(path);
//            if (!pathRe.test(path)) {
//                path = "#!" + path;
//            }
//            var last = History.getToken() || "";
//            if ("#" + last.replace(/^%21/, "!") !== path) {
//                History.add(path);
//            }
//        },
//        parseToken: function (path) {
//            var tokens = path && path.match(tokenizer),
//                params = {};

//            if (tokens[2]) {
//                Ext.each(tokens[2].split('/'), function (param) {
//                    var parts = param.split('=');
//                    if (parts.length == 2)
//                        params[parts[0]] = parts[1];
//                });
//            }

//            return tokens ? {
//                type: tokens[1].toLowerCase(),
//                params: params,
//                url: "#!" + tokens[1]
//            } : null;
//        }
//    });
//});