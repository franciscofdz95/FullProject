Ext.define('App.Controller.Component.List', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        this.control({
            'App-View-Component-List-Container': {
                beforerender: this.ListContainerBeforeRender
            },
            'App-View-Component-List-Container>pagedlist': {
                beforerender: this.ListContainerPagedListBeforeRender,
                //storebeforesort: this.ListContainerPagedListStoreBeforeSort,
                deepLinkPaging: this.ListContainerPagedListDeepLinkPaging,
                storebeforeload: this.ListContainerPagedListStoreBeforeLoad,
                storeload: this.ListContainerPagedListStoreLoad
            },
            'pagedlist[autoPageSize=true]': {
                beforerender: this.ViewBeforeRender,
                storebeforeload: {
                    fn: this.ViewStoreBeforeLoad,
                    priority: -9999
                },
                resize: this.ViewResize
            }
        });
    },
    ListContainerBeforeRender: function ListContainerBeforeRender(me) {
        me.doDeepLink = this.ListContainerDoDeepLink.bind(this, me);
    },
    ListContainerDoDeepLink: function ListContainerDoDeepLink(me, itemXtype, sorts, params) {
        var pagedlist = me.down('pagedlist') || {};

        //Get ItemXtype for PagedList Items
        itemXtype = itemXtype || pagedlist.itemXtype || me.listItem;
        //Get Params for PagedList Store Excluding Paging Params
        params = Ext.apply(pagedlist.store && Ext.isFunction(pagedlist.store.getProxy) ? pagedlist.store.getProxy().extraParams : {}, params || {});

        if (me.displayChild !== true) {
            if (Ext.isObject(params)) {
                delete params.start;
                delete params.limit;
            }

            //Get Sorts for PagedList
            if (Ext.isEmpty(sorts)) {
                sorts = new Array();
                if (pagedlist.store.getSorters().length > 0) {
                    var storeSorts = pagedlist.store.getSorters().items;
                    for (var i = 0; i < storeSorts.length; i++) {
                        sorts.push({ property: storeSorts[i].getProperty(), direction: storeSorts[i].getDirection() });
                    }
                }
                else sorts = me.sorts;
            }
            else if (Ext.isObject(sorts)) {
                var tempSorts = new Array();
                for (var i = 0; i < (sorts.items || {}).length; i++) tempSorts.push({ property: sorts.items[i].getProperty(), direction: sorts.items[i].getDirection() });
                sorts = tempSorts;
            }

            //Get current filters
            var toolbar = me.down('App-View-Component-ListToolbar-Container'),
                filters = toolbar.down('segmentedbutton[filterProperty]'),
                filterValues = {};
            Ext.each(filters, function (a) {
                if (a.filterProperty) {
                    filterValues[a.filterProperty] = a.getValue();
                }
            });

            //Fire DeepLink Global Event to navigate to new view
            Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', {
                xtype: me.xtype,
                flex: 1,
                listItem: itemXtype,
                sorts: sorts,
                params: params,
                currentPage: pagedlist.currentPage,
                filterValues: filterValues
            });
        } else {
            if (!Ext.isEmpty(sorts)) {
                var sorters = pagedlist.store.getSorters();
                sorters.clear();
                sorters.add(sorts);
            }
            pagedlist.store.load();
        }
    },
    ListContainerPagedListBeforeRender: function ListContainerPagedListBeforeRender(me) {
        var listCnt = me.up();
        if (listCnt) {
            if (!Ext.isEmpty(listCnt.listItem)) me.itemXtype = listCnt.listItem;
            if (!Ext.isEmpty(listCnt.params)) me.store.getProxy().extraParams = listCnt.params;
            if (!Ext.isEmpty(listCnt.currentPage)) me.changeCurrentPage(listCnt.currentPage);
            if (!Ext.isEmpty(listCnt.sorts)) {
                me.store.suspendEvent('load');
                me.store.suspendEvent('beforesort');
                me.store.setSorters(listCnt.sorts);
                me.store.resumeEvent('beforesort');
                me.store.resumeEvent('load');
            }
        }

        if (!Ext.isEmpty(me.headerConfig)) {
            me.addDocked(Ext.apply(me.headerConfig, { xtype: me.itemXtype }));
        }

        me.doDeepLink = this.ListContainerDoDeepLink.bind(this, me.up('App-View-Component-List-Container'));
    },
    ListContainerPagedListStoreBeforeSort: function ListContainerPagedListStoreBeforeSort(me, store, sorters) {
        me.doDeepLink();
        return false;
    },
    ListContainerPagedListDeepLinkPaging: function ListContainerPagedListDeepLinkPaging(me, deepLinkObj) {
        me.doDeepLink();
    },
    ListContainerPagedListStoreBeforeLoad: function ListContainerPagedListStoreBeforeLoad(me, store) {

    },
    ListContainerPagedListStoreLoad: function ListContainerPagedListStoreLoad(me, store, records, success) {

    },
    ViewBeforeRender: function ViewBeforeRender(me) {
        me.addListener({
            afterlayout: {
                fn: this.ViewAfterLayout,
                single: true,
                scope: this
            }
        });
    },
    CalculateFitRows: function CalculateFitRows(me) {
        var content = me.up(),
            contentHeight = content.getHeight(),
            contentInnerPadding = 0,
            pagedlistPadding = 0,
            pagingToolbar = me.down('BIA-Components-PagedList-PagingToolbar'),
            pagingToolbarHeight = pagingToolbar.getHeight(),
            toolbar = me.down('App-View-Component-ListToolbar-Container'),
            toolbarHeight = toolbar.getHeight(),
            header = me.down(me.itemXtype + '[header=true]'),
            headerHeight = header.getHeight(),
            itemHeight = 0,
            itemContainerHeight = 0,
            visibleItems;

        Ext.Object.eachValue(content.getBorderPadding(), function (v) { contentInnerPadding += v; });
        Ext.Object.eachValue(me.getBorderPadding(), function (v) { pagedlistPadding += v; });

        switch (me.itemXtype) {
            case me.gridItemXtype:
                itemHeight = me.gridItemHeight;
                break;
            case me.listItemXtype:
                itemHeight = me.listItemHeight;
                break;
            case me.detailItemXtype:
                itemHeight = me.detailItemHeight;
                break;
        }

        itemHeight += header.getEl().getMargin().bottom + header.getEl().getMargin().top;
        itemContainerHeight = contentHeight - contentInnerPadding - pagedlistPadding - toolbarHeight - headerHeight - pagingToolbarHeight;
        visibleItems = Math.floor(itemContainerHeight / itemHeight) * me.columns;
        me.pageSize = visibleItems;
        me.store.setPageSize(visibleItems);
    },
    ViewStoreBeforeLoad: function ViewStoreBeforeLoad(me) {
    },
    ViewAfterLayout: function ViewAfterLayout(me) {
        this.CalculateFitRows(me);
        if (!me.store.isLoading())
            me.store.load();
    },
    ViewResize: function ViewResize(me) {
        if (me.store.loadCount >= 1) {
            me.addListener({
                afterlayout: {
                    fn: this.ViewAfterLayout,
                    single: true,
                    scope: this
                }
            });
        }
    }
});