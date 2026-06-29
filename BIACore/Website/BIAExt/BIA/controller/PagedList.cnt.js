//#region Controller
Ext.define('BIA.controller.PagedList', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function () {
        var me = this;
        me.control({
            'BIA-Components-PagedList': {
                beforerender: {
                    fn: this.PagedListBeforeRender,
                    priority: -999
                },
                afterrender: {
                    fn: this.PagedListShowLoadingMask
                },
                boxready: {
                    fn: this.PagedListBoxReady
                },
                destroy: {
                    fn: this.PagedListDestroyed
                },
                storebeforeload: this.PagedListStoreBeforeLoad,
                beforestoreload: this.PagedListShowLoadingMask,
                resize: {
                    element: 'el',
                    fn: function (me) {
                        var currentColumns = me.columns;
                        me.fireEvent('beforeResize', me);
                        if (currentColumns != me.columns) {
                            this.CreatePagedListItemsForCurrentPage(me);
                        }
                        me.fireEvent('afterResize', me);
                    }
                }
            },
            'BIA-Components-PagedList-PagingToolbar': {
                beforerender: {
                    fn: this.PagingToolbarBeforeRender
                }
            },
            'BIA-Components-PagedList-PagingToolbar BIA-Components-PagedList-PagingToolbar-Button': {
                beforerender: this.PagingToolberButtonBeforeRender
            }
        });
        me.listen({
            global: {}
        });
        me.DestroyableGlobalKeypressListener = undefined;
    },
    BaseClassSearch: function BaseClassSearch(me, baseClassName) {
        var recursiveSearch = function (me, className) {
            //console.log(me.$className)
            if (me.$className == className) {
                return true;
            }
            //console.log(Object.getPrototypeOf(me));
            if (!Object.getPrototypeOf(me)) {
                return false;
            }
            return recursiveSearch(Object.getPrototypeOf(me), className);
        }
        return recursiveSearch(me, baseClassName)
    },
    ClassPropertyBaseTypeSearch: function ClassPropertyBaseTypeSearch(me, baseTypeName, matchingObjectProperties) {
        matchingObjectProperties = matchingObjectProperties || [];
        if (Ext.isArray(me)) {
            for (var i = 0; i < me.length; i++) {
                this.ClassPropertyBaseTypeSearch.call(this, me[i], baseTypeName, matchingObjectProperties);
            }
            /*Ext.Array.each(me, function (obj, index, all) {
                this.BaseClassSearch.call(this, obj, baseTypeName, matchingObjectProperties);
            },this);*/
        }
        else if (Ext.isObject(me)) {
            Ext.Object.each(me, function (prop, value, myself) {
                if (Ext.isObject(myself[prop]) && this.BaseClassSearch(myself[prop], baseTypeName)) {
                    matchingObjectProperties.push({ object: myself, property: prop });
                }
            }, this);
        }

        return matchingObjectProperties;
    },
    GetDefaultColumnWidth: function GetDefaultColumnWidth(me) {
        return 1 / this.GetCurrentPagedList(me).columns;
    },
    GetCurrentPagedList: function (me) {
        var pagedList = undefined;
        if (me.extendedFrom == 'BIA-Components-PagedList') {
            pagedList = me;
        }
        else if (me.up && me.up('[extendedFrom="BIA-Components-PagedList"]')) {
            try {
                pagedList = me.up('[extendedFrom="BIA-Components-PagedList"]');
            }
            catch (ex) {
                Ext.log({ msg: 'Error getting Current Paged List', dump: { me: me, error: ex } });
            }
        }
        else if (me.down && me.down('[extendedFrom="BIA-Components-PagedList"]')) {
            try {
                pagedList = me.down('[extendedFrom="BIA-Components-PagedList"]');
            }
            catch (ex) {
                Ext.log({ msg: 'Error getting Current Paged List', dump: { me: me, error: ex } });
            }
        }
        return pagedList;
    },
    GetPagingToolbar: function (me) {
        var pagedList = this.GetCurrentPagedList(me);
        var pagingToolbar = undefined;
        if (pagedList) {
            try {
                pagingToolbar = pagedList.down('BIA-Components-PagedList-PagingToolbar');
            }
            catch (ex) {
                Ext.log({ msg: 'Error getting Current Paged List Paging Toolbar.', dump: { me: me, pagedList: pagedList, error: ex } });
            }
        }
        return pagingToolbar;
    },
    SyncHeightOfListItems: function SyncHeightOfListItems(me) {
        Ext.suspendLayouts();
        var PagedList = this.GetCurrentPagedList(me);
        if (PagedList && PagedList.syncListItemHeights) {
            var listItems = PagedList.query(PagedList.itemXtype);
            while (listItems.length > 0) {
                var rowListItems = listItems.splice(0, PagedList.columns);
                var maxHeight = Ext.Array.max(Ext.Array.pluck(Ext.Array.pluck(Ext.Array.pluck(rowListItems, 'el'), 'dom'), 'offsetHeight'));
                rowListItems.forEach(function (item, index, array) {
                    item.setHeight(maxHeight);
                });
            }
        }
        Ext.resumeLayouts(true);
    },
    CreatePagedListItemsForCurrentPage: function (me) {
        var PagedList = this.GetCurrentPagedList(me);
        var PagingToolbar = this.GetPagingToolbar(me);
        let currentPage = 0;
        if (PagingToolbar) currentPage = parseInt(PagingToolbar.currentPage);
        if (PagedList && PagingToolbar) {
            var startAllTimer = new Date;
            if (!PagedList.isMasked() && PagedList.rendered &&
                PagedList.loadingMessage != '' && PagedList.loadingMessage != null) {
                PagedList.mask('Loading');
                setTimeout(this.CreatePagedListItemsForCurrentPage.bind(this), 50, me);
                return;
            }
            Ext.suspendLayouts();
            PagedList.removeAll();
            var startAddItemsTimer = new Date;
            var pagedListItems = [];
            var pagedDataItems = [];
            if (PagedList.remotePaging) {
                pagedDataItems = PagedList.store.data.items;
            }
            else {
                var startIndex = (currentPage - 1) * PagedList.store.getPageSize();
                var endIndex = currentPage * PagedList.store.getPageSize();
                endIndex = (endIndex == 0 ? 50 : endIndex);
                pagedDataItems = Ext.Array.slice(PagedList.store.data.items, startIndex, endIndex)
            }

            for (index in pagedDataItems) {
                var newItem = { xtype: PagedList.itemXtype };
                newItem[PagedList.itemRecordAttribute] = pagedDataItems[index].getData();
                if(PagedList.columns > 0) newItem['columnWidth'] = this.GetDefaultColumnWidth(me);
                pagedListItems.push(newItem);
            }

            if (pagedListItems.length > 0) { PagedList.add(pagedListItems); }
            if (PagedList.store.getCount() == 0) {
                PagedList.add({
                    xtype: 'container',
                    html: PagedList.noRecordsMessage,
                    padding: 5,
                    width: '100%',
                    style: {
                        fontWeight: 'bold'
                    }
                });
            }
            if (PagedList.DEBUG_MESSAGES) { Ext.log('Add All Items ' + (Date.now() - startAddItemsTimer.getTime()) + ' ms'); }

            var startTimer = new Date;
            var finishPagedListLayout = function finishPagedListLayout(me, startTimer) {
                var PagedList = this.GetCurrentPagedList(me);
                var PagingToolbar = this.GetPagingToolbar(me);
                if (PagedList && PagingToolbar) {
                    if (Ext.Array.every(this.ClassPropertyBaseTypeSearch(PagedList.query(''), 'Ext.data.Store'), function (obj, index, array) {
                            return (obj.object[obj.property].loadCount == 0 && !obj.object[obj.property].isLoading()) || obj.object[obj.property].isLoaded();
                    }, this)) {
                        Ext.resumeLayouts(true);
                        if (PagedList.DEBUG_MESSAGES) { Ext.log('Do PagedList Ext Layout ' + (Date.now() - startTimer.getTime()) + ' ms'); }

                        startTimer = new Date;
                        this.UpdatePagingToolbarDisplay(me);
                        if (PagedList.DEBUG_MESSAGES) { Ext.log('UpdatePagingToolbarDisplay ' + (Date.now() - startTimer.getTime()) + ' ms'); }

                        startTimer = new Date;
                        this.SyncHeightOfListItems(me);
                        if (PagedList.DEBUG_MESSAGES) { Ext.log('SyncHeightOfListItems ' + (Date.now() - startTimer.getTime()) + ' ms'); }

                        startTimer = new Date;
                        if (PagedList.isMasked()) { PagedList.unmask(); }
                        if (PagedList.DEBUG_MESSAGES) { Ext.log('Add All Items ' + (Date.now() - startAllTimer.getTime()) + ' ms'); }

                        PagedList.fireEvent('loadcomplete', PagedList);
                    }
                    else {
                        Ext.defer(finishPagedListLayout, 10, this, [me, startTimer], false);
                    }
                }
                else {
                    Ext.resumeLayouts(true);
                }
            };
            finishPagedListLayout.call(this, me, startTimer);
        }
    },
    UpdatePagingToolbarDisplay: function (me) {
        Ext.suspendLayouts();
        var PagedList = this.GetCurrentPagedList(me);
        var PagingToolbar = this.GetPagingToolbar(me);
        var PageButtonsCnt = PagingToolbar.down('#PageButtonContainer');

        var currentPage = parseInt(PagingToolbar.currentPage);
        var pageSize = PagedList.store.getPageSize();
        pageSize = (pageSize == 0 ? 50 : pageSize);
        var totalRecords = PagedList.store.count();
        if (PagedList.remotePaging) {
            totalRecords = PagedList.store.totalCount || 0;
        }

        var totalPages = Math.ceil(totalRecords / pageSize),
            pageButtonDefaultWidth = 22,
            pageButtonDefaultWidthInc = 11;

        var pageButtons = PageButtonsCnt.query('BIA-Components-PagedList-PagingToolbar-Button'),
            visiblePageButtons = PagedList.pagingToolbarNumberPageLinksShown < totalPages ? PagedList.pagingToolbarNumberPageLinksShown : totalPages,
            indexMiddleCurrentPageButton = visiblePageButtons > 0 ? Math.round((visiblePageButtons + 1) / 2) : 0;

        if (pageButtons.length < visiblePageButtons) {
            for (var i = 0; i < visiblePageButtons - pageButtons.length; i++) {
                PageButtonsCnt.add({ xtype: 'BIA-Components-PagedList-PagingToolbar-Button', html: '', hidden: true });
            }
        }

        var pageButtonsBeforeCurrent = currentPage >= indexMiddleCurrentPageButton
            ? visiblePageButtons - (currentPage >= totalPages - indexMiddleCurrentPageButton ? totalPages - currentPage + 1 : indexMiddleCurrentPageButton)
            : currentPage - 1,
            pageButtonsAfterCurrent = visiblePageButtons - 1 - pageButtonsBeforeCurrent,
            pageButtonCurrent = visiblePageButtons - pageButtonsAfterCurrent,
            pageButtons = PageButtonsCnt.query('BIA-Components-PagedList-PagingToolbar-Button');

        for (var i = 0; i < pageButtons.length; i++) {
            var pageNumber = i + 1;
            if (pageNumber < pageButtonCurrent - pageButtonsBeforeCurrent || pageNumber > pageButtonCurrent + pageButtonsAfterCurrent) {
                pageButtons[i].hide();
                pageButtons[i].removeCls(PageButtonsCnt.currentPageCls);
                pageButtons[i].setConfig({ html: '' });
            }
            else {
                pageButtons[i].show();
                pageButtons[i].removeCls(PageButtonsCnt.currentPageCls);
                pageButtons[i].changePage = pageNumber - pageButtonCurrent;
                pageButtons[i].setConfig({ html: (currentPage + pageButtons[i].changePage).toString() });
                if (pageNumber == pageButtonCurrent) pageButtons[i].addCls(PageButtonsCnt.currentPageCls);
            }
        }

        var firstPageButton = PagingToolbar.down('#FirstPage'),
            previousPageButton = PagingToolbar.down('#PreviousPage'),
            previousPageGroupButton = PagingToolbar.down('#PreviousPageGroup'),
            nextPageGroupButton = PagingToolbar.down('#NextPageGroup'),
            nextPageButton = PagingToolbar.down('#NextPage'),
            lastPageButton = PagingToolbar.down('#LastPage');

        if (firstPageButton) {
            firstPageButton.changePage = 1 - currentPage;
            if (currentPage == 1 || totalPages == 0) firstPageButton.hide();
            else firstPageButton.show();
        }
        if (previousPageButton) {
            previousPageButton.changePage = -1;
            if (currentPage == 1 || totalPages == 0) previousPageButton.hide();
            else previousPageButton.show();
        }
        if (previousPageGroupButton) {
            previousPageGroupButton.changePage = (pageButtonsBeforeCurrent * -1) - 1;
            if (currentPage - pageButtonsBeforeCurrent - 1 < 1 || totalPages == 0) previousPageGroupButton.hide();
            else previousPageGroupButton.show();
        }
        if (nextPageGroupButton) {
            nextPageGroupButton.changePage = 1 + pageButtonsAfterCurrent;
            if (currentPage + pageButtonsAfterCurrent + 1 > totalPages || totalPages == 0) nextPageGroupButton.hide();
            else nextPageGroupButton.show();
        }
        if (nextPageButton) {
            nextPageButton.changePage = 1;
            if (currentPage == totalPages || totalPages == 0) nextPageButton.hide();
            else nextPageButton.show();
        }
        if (lastPageButton) {
            lastPageButton.changePage = totalPages - currentPage;
            if (currentPage == totalPages || totalPages == 0) lastPageButton.hide();
            else lastPageButton.show();
        }

        var currentPageDisplay = '';
        currentPageDisplay =
            (totalRecords > 0 ? ((currentPage - 1) * pageSize) + 1 : 0).toString() +
            ((currentPage * pageSize) < totalRecords
                ? '-' + (currentPage * pageSize)
                : totalRecords > 0 ? '-' + totalRecords : '').toString() +
            ' of ' + totalRecords.toString() + ' ' + PagedList.pagingToolbarTotalRecordsPostfixString +
            (totalRecords > 1 &&
                PagedList.pagingToolbarTotalRecordsPostfixString.indexOf('s') != PagedList.pagingToolbarTotalRecordsPostfixString.length - 1
                ? 's' : '');
        PagingToolbar.down('#CurrentPageDisplay').update(currentPageDisplay);
        PagingToolbar.down('#CurrentPageDisplay').changePage = 0;

        Ext.resumeLayouts(true);
    },
    PagedListBeforeRender: function (me, eOpts) {

        me.store.addListener({
            load: {
                fn: this.PagedListStoreLoad,
                scope: this,
                args: [me]
            }
        });

        me.changeCurrentPage(me.currentPage);

        if (me.deeplinkPaging && me.deeplinkPagingObj && Ext.isObject(me.deeplinkPagingObj)) {
            me.changeCurrentPage(me.deeplinkPagingObj.pagedListCurrentPage);
            me.store.getProxy().extraParams = Ext.apply(me.store.getProxy().extraParams, me.deeplinkPagingObj.pagedListExtraParams);
        }

        if (me.loadOnInit) {
            if (me.fireEvent('beforeStoreLoad', me, me.store) !== false) {
                me.store.load();
            }
        }

        this.DestroyableGlobalKeypressListener = Ext.getDoc().addListener({
            keydown: {
                fn: this.PagingToolbarKeypressListener,
                scope: this,
                destroyable: true
            }
        });
    },
    PagedListShowLoadingMask: function (me) {
        if (me.store.isLoading() && me.loadingMessage != '' && me.loadingMessage != null && !me.isMasked()) { me.mask(me.loadingMessage); }
        else {
            Ext.defer(function (me) {
                if (me.store.isLoading() && me.loadingMessage != '' && me.loadingMessage != null && !me.isMasked()) { me.mask(me.loadingMessage); }
            }, 50, this, [me]);
        }
    },
    PagedListBoxReady: function PagedListBoxReady(me, width, height, eOpts) {
        this.SyncHeightOfListItems(me);
        me.updateLayout({ isRoot: true });
    },
    PagedListDestroyed: function () {
        if (this.DestroyableGlobalKeypressListener) {
            Ext.getDoc().removeListener('keydown', this.PagingToolbarKeypressListener, this);
            this.DestroyableGlobalKeypressListener = undefined;
        }
    },
    PagedListStoreBeforeLoad: function PagedListStoreBeforeLoad(me) {
        if (me.remotePaging) {
            var start = (me.currentPage * me.store.pageSize) - me.store.pageSize;
            me.store.getProxy().extraParams = Ext.apply(me.store.getProxy().extraParams, { start: start, limit: me.store.pageSize });
        }

        this.PagedListShowLoadingMask(me);
    },
    PagedListStoreLoad: function (threadList, store, records, successful, operation, eOpts) {
        this.CreatePagedListItemsForCurrentPage(threadList);
        /*if (successful) {
            this.CreatePagedListItemsForCurrentPage(threadList);
        }
        else if(threadList.isMasked()) {
            threadList.unmask();
        }*/
    },
    PagingToolbarBeforeRender: function (me, eOpts) {
        if (this.GetCurrentPagedList(me).showPagingToolbar) {
            me.currentPage = this.GetCurrentPagedList(me).currentPage || 1;

            this.UpdatePagingToolbarDisplay(me);

            //me.query('BIA-Components-PagedList-PagingToolbar-Button').forEach(function (cmp, index, allChildren) {
            //    cmp.addListener({
            //        click: {
            //            element: 'el',
            //            fn: this.PagingToolbarButtonClick,
            //            scope: this
            //        }
            //    });
            //}, this);

            me.down('BIA-Components-PagedList-PagingToolbar-Refresh').addListener({
                click: {
                    element: 'el',
                    fn: this.PagingToolbarRefreshClick,
                    scope: this,
                    args: [this.GetCurrentPagedList(me)]
                }
            });
        }
        else {
            me.hide();
        }
    },
    PagingToolberButtonBeforeRender: function PagingToolberButtonBeforeRender(me) {
        me.addListener({
            click: {
                element: 'el',
                fn: this.PagingToolbarButtonClick,
                scope: this
            }
        });
    },
    PagingToolbarButtonClick: function (event, element, eOpts) {
        if ((Ext.fly(element).component || Ext.fly(event.currentTarget).component).changePage != 0) {
            var me = (Ext.fly(element).component || Ext.fly(event.currentTarget).component);
            var PagedList = this.GetCurrentPagedList(me);
            var PagingToolbar = this.GetPagingToolbar(me);
            PagedList.changeCurrentPage(parseInt(PagingToolbar.currentPage) + me.changePage);
            this.PagingToolbarDoPaging(me);
        }
    },
    PagingToolbarRefreshClick: function PagingToolbarRefreshClick(pagedList) {
        if (pagedList.fireEvent('beforeStoreLoad', pagedList, pagedList.store) !== false) {
            pagedList.mask(pagedList.loadingMessage);
            pagedList.store.load();
        }
    },
    PagingToolbarKeypressListener: function (event, element, eOpts) {
        var me = (Ext.fly(element).component || Ext.fly(event.currentTarget).component);
        if (me) {
            var PagedList = this.GetCurrentPagedList(me);
            var PagingToolbar = this.GetPagingToolbar(me)//this.GetPagingToolbar(me);
            if (PagingToolbar) {
                if (event.keyCode == 36) { //Home key
                    if (PagingToolbar.down('[itemId="FirstPage"]') && PagingToolbar.down('[itemId="FirstPage"]').isVisible()) {
                        PagedList.changeCurrentPage(parseInt(PagingToolbar.currentPage) + (PagingToolbar.down('[itemId="FirstPage"]').changePage || 0));
                        this.PagingToolbarDoPaging(me);
                    }
                }
                if (event.keyCode == 35) { //End key
                    if (PagingToolbar.down('[itemId="LastPage"]') && PagingToolbar.down('[itemId="LastPage"]').isVisible()) {
                        PagedList.changeCurrentPage(parseInt(PagingToolbar.currentPage) + (PagingToolbar.down('[itemId="LastPage"]').changePage || 0));
                        this.PagingToolbarDoPaging(me);
                    }
                }
                if (event.keyCode == 33) { //PageUp key
                    if (PagingToolbar.down('[itemId="PreviousPageGroup"]') && PagingToolbar.down('[itemId="PreviousPageGroup"]').isVisible()) {
                        PagedList.changeCurrentPage(parseInt(PagingToolbar.currentPage) + (PagingToolbar.down('[itemId="PreviousPageGroup"]').changePage || 0));
                        this.PagingToolbarDoPaging(me);
                    }
                }
                if (event.keyCode == 34) { //PageDown key
                    if (PagingToolbar.down('[itemId="NextPageGroup"]') && PagingToolbar.down('[itemId="NextPageGroup"]').isVisible()) {
                        PagedList.changeCurrentPage(parseInt(PagingToolbar.currentPage) + (PagingToolbar.down('[itemId="NextPageGroup"]').changePage || 0));
                        this.PagingToolbarDoPaging(me);
                    }
                }
                if (event.keyCode == 37 || event.keyCode == 38) { //Left key OR Up key
                    if (PagingToolbar.down('[itemId="PreviousPage"]') && PagingToolbar.down('[itemId="PreviousPage"]').isVisible()) {
                        PagedList.changeCurrentPage(parseInt(PagingToolbar.currentPage) + (PagingToolbar.down('[itemId="PreviousPage"]').changePage || 0));
                        this.PagingToolbarDoPaging(me);
                    }
                }
                if (event.keyCode == 39 || event.keyCode == 40) { //Right key OR Down key
                    if (PagingToolbar.down('[itemId="NextPage"]') && PagingToolbar.down('[itemId="NextPage"]').isVisible()) {
                        PagedList.changeCurrentPage(parseInt(PagingToolbar.currentPage) + (PagingToolbar.down('[itemId="NextPage"]').changePage || 0));
                        this.PagingToolbarDoPaging(me);
                    }
                }
            }
        }
    },
    PagingToolbarDoPaging: function PagingToolbarDoPaging(me) {
        var PagedList = this.GetCurrentPagedList(me);
        var PagingToolbar = this.GetPagingToolbar(me);
        if (PagedList.deeplinkPaging) {
            var deepLinkPagingEventObj = new Object();
            deepLinkPagingEventObj.pagedListCurrentPage = parseInt(PagingToolbar.currentPage);
            deepLinkPagingEventObj.pagedListExtraParams = PagedList.store.getProxy().extraParams;

            PagedList.fireEvent('deepLinkPaging', PagedList, deepLinkPagingEventObj);
        }
        else if (PagedList.remotePaging) {
            var start = (parseInt(PagingToolbar.currentPage) * PagedList.store.pageSize) - PagedList.store.pageSize;
            PagedList.store.getProxy().extraParams = Ext.apply(PagedList.store.getProxy().extraParams, { start: start, limit: PagedList.store.pageSize });
            PagedList.store.load();
        }
        else {
            this.CreatePagedListItemsForCurrentPage(me);
        }
    }

});
//#endregion