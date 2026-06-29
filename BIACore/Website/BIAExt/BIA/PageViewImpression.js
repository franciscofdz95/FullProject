Ext.define('BIA.PageViewImpression', {
    single: true
}, function PageViewImpression(me) {
    var pageViewCmp = new Array();

    var getMatchingPageViewCmp = function getMatchingPageViewCmp(cmp) {
        return Ext.Array.findBy(pageViewCmp, function (c) { return c.id === cmp.getId(); });
    };

    var getPageViewTitle = function getPageViewTitle(cmp) {
        var title = '';

        if (!Ext.isEmpty(cmp.biaPageViewTitle)) title = cmp.biaPageViewTitle;
        else if (!Ext.isEmpty(cmp.title)) title = cmp.title;
        else if (cmp.owerCt && Ext.isFunction(cmp.owerCt.isXType) && cmp.owerCt.isXType('tabpanel') && !Ext.isEmpty(cmp.title)) title = cmp.title;
        else if (Ext.isFunction(cmp.isXType) && cmp.isXType('window') && !Ext.isEmpty(cmp.title) && Ext.isString(title)) title = cmp.title;
        else if (Ext.isFunction(cmp.isXType) && !Ext.isEmpty(cmp.header) && Ext.isObject(cmp.header) && Ext.isFunction(cmp.header.down) && cmp.header.down('title')) title = cmp.header.down('title').text;        
        else title = cmp.xtype.replace(/\-/g, '');

        return title;
    };

    var getLoadTime = function getLoadTime(pv) {
        var loadTime = 0;
        if (Ext.isDate(pv.loadStart)) {
            loadTime = Ext.Date.diff(pv.loadStart, new Date(), Ext.Date.MILLI);
            pv.loadStart = null;
        }
        return loadTime;
    }

    Ext.apply(me, {
        addPageViewComponent: function addPageViewComponent(cmp) {
            var matchingPageViewCmp = getMatchingPageViewCmp(cmp);
            if (!matchingPageViewCmp) {
                pageViewCmp.push({ id: cmp.getId(), title: getPageViewTitle(cmp), xtype: cmp.xtype, loadStart: null });
            }
        },
        startPageViewLoad: function startPageViewLoad(cmp) {
            var matchingPageViewCmp = getMatchingPageViewCmp(cmp);
            if (matchingPageViewCmp && !this.isPageViewLoading(cmp)) {
                matchingPageViewCmp.loadStart = new Date();
            }
        },
        initPageViewComponent: function initPageViewComponent(cmp) {
            this.addPageViewComponent(cmp);
            this.startPageViewLoad(cmp);
        },
        isPageViewLoading: function isPageViewLoading(cmp) {
            var loading = false;
            var matchingPageViewCmp = getMatchingPageViewCmp(cmp);
            if (matchingPageViewCmp && matchingPageViewCmp.loadStart != null) loading = true;
            return loading;
        },
        logPageView: function logPageView(cmp) {
            var matchingPageViewCmp = getMatchingPageViewCmp(cmp);
            if (matchingPageViewCmp) {
                BIACore.Logger.PageView(matchingPageViewCmp.title, matchingPageViewCmp.xtype, getLoadTime(matchingPageViewCmp));
            }
        }
    })
});