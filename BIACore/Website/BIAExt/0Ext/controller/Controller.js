(function () {
    if (Ext.getVersion().major >= 4) {
        Ext.override(Ext.app.Controller, {
            getAllRef: function (ref, info, config) {
                return Ext.ComponentQuery.query(info.selector);
            },
            getActiveRef: function (ref, info, config) {
                var matches = Ext.ComponentQuery.query(info.selector),
                    activeMatch = null;
                var recActiveParent = function (obj) {
                    if (obj.hidden) return false;
                    else {
                        if (obj.ownerCt) return recActiveParent(obj.ownerCt);
                        else return true;
                    }
                };

                for (var i = 0; i < matches.length; i++) {
                    var obj = matches[i];
                    if (recActiveParent(obj)) {
                        activeMatch = obj;
                        break;
                    }
                }

                //if (Ext.ZIndexManager.activeCounter > 0) return null;
                //else return activeMatch;
                return activeMatch;
            },
            initExtraAutoGetters: function (config) {
                var me = this,
                    refs = this.config.refs || [];
                for (var i = 0; i < refs.length; i++) {
                    var info = refs[i],
                        ref = refs[i].ref,
                        selector = refs[i].selector;
                    if (refs[i].selector && refs[i].ref) {
                        var allFn = 'getAll' + Ext.String.capitalize(ref),
                            activeFn = 'getActive' + Ext.String.capitalize(ref);
                        if (!me[allFn]) me[allFn] = Ext.Function.pass(me.getAllRef, [ref, info], me);
                        if (!me[activeFn]) me[activeFn] = Ext.Function.pass(me.getActiveRef, [ref, info], me);
                    }
                }
            },
            constructor: function (config) {
                this.initAutoGetters();
                this.initExtraAutoGetters(config)
                this.callParent(arguments);
            }
        });
    }
}());