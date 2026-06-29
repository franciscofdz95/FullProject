Ext.define('BIA.controller.PageViewImpression', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            '[biaPageView=true]': {
                beforerender: this.BIAPageViewStartLoad,
                show: this.BIAPageViewStartLoad
            }
        });
    },
    BIAPageViewStartLoad: function BIAPageViewStartLoad(me) {
        if (window.location.hostname.toLowerCase() !== 'localhost') {
            BIA.PageViewImpression.initPageViewComponent(me);
            if (me.rendered) {
                me.addListener({
                    afterlayout: {
                        fn: this.BIAPageViewCompleteLoad,
                        scope: this,
                        single: true,
                        args: [me],
                        priority: -9999,
                        delay: 5
                    }
                });
            }
            else {
                me.addListener({
                    boxready: {
                        fn: this.BIAPageViewCompleteLoad,
                        scope: this,
                        single: true,
                        args: [me],
                        priority: -9999,
                        delay: 5
                    }
                });
            }
        }
    },
    BIAPageViewCompleteLoad: function BIAPageViewCompleteLoad(me) {
        if (BIA.PageViewImpression.isPageViewLoading(me)) {
            var loadingStores = me.query('[store]').filter(function (cmp) { return cmp.store.isLoading(); });
            if (loadingStores.length > 0) {
                for (var i = 0; i < loadingStores.length; i++) {
                    loadingStores[i].addListener({
                        storeload: {
                            fn: function (me) {
                                this.BIAPageViewCompleteLoad(me);
                            },
                            scope: this,
                            args: [me],
                            single: true
                        }
                    });
                }
            }
            else {
                BIA.PageViewImpression.logPageView(me);
            }
        }
    }
});