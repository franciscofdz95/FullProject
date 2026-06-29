Ext.define('BIA.controller.PerformanceTrackerInterface', {
    extend: 'Ext.app.Controller',
    init: function () {
        if (Ext.versions.major > 4) {
            this.listen({
                global: {
                    added: this.RegisterComponentStore,
                    show: this.RegisterComponentStore
                }
            });
        }
        else {
            this.control({
                'component': {
                    added: this.RegisterComponentStore,
                    show: this.RegisterComponentStore
                }
            });
        }
    },
    RegisterComponentStore: function RegisterComponentStore(cmp) {
        //var appCode = new String(BIACore.Security.Session.appCode);
        //if ((appCode.toLowerCase() == 'smt' || appCode.toLowerCase() == 'askmilton') && (BIACore.Security.Session.userId == 'RNF5GXC' || BIACore.Security.Session.userId == 'adm1mme')) {
        //    if (cmp.store && Ext.isObject(cmp.store) && cmp.store.getData && Ext.isFunction(cmp.store.getData)) {
        //        BIA.header.tool.PerformanceTrackerInterface.registerStore(cmp.store, cmp);
        //    }
        //}

        if (cmp.store && Ext.isObject(cmp.store) && cmp.store.load && Ext.isFunction(cmp.store.load)) {
            BIA.header.tool.PerformanceTrackerInterface.registerStore(cmp.store, cmp);
        }
    }
});