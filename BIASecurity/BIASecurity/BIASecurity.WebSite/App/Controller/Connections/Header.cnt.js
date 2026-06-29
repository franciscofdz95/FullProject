Ext.define('App.Controller.Connections.Header', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'ConnectionsCnt', selector: 'App-View-Connections-Container' },
        { ref: 'ConnectionUserAddEditView', selector: 'App-View-Connections-ConnectionUser-AddEditView' },
        { ref: 'ConnectionList', selector: 'App-View-Connection-List' },
        { ref: 'ConnectionUserList', selector: 'App-View-ConnectionUser-List' },
        { ref: 'DatabaseList', selector: 'App-View-Database-List' },
        { ref: 'ServerList', selector: 'App-View-Server-List' },
    ],

    init: function init() {
        this.control({
            'App-View-Connections-Header-Component-AddButton': {
                beforerender: this.HeaderAddButtonBeforeRender,
                click: this.HeaderAddButtonClick
            },
            'App-View-Connections-Header-Search #SearchButton': {
                click: this.HeaderSearchButtonClick
            },
            'App-View-Connections-Header-Search #SearchText': {
                keyup: this.HeaderSearchTextKeyUp
            }
        });
    },
    HeaderAddButtonBeforeRender: function HeaderAddButtonBeforeRender(me) {
        if (me.displayType === 'NoText') me.setConfig({ text: null, arrowVisible: false });
    },
    HeaderAddButtonClick: function HeaderAddButtonClick(me) {
        if (me.actionSecure != null) {
            if (!Ext.isFunction(App.Utility.ConnectionSecurity[me.actionSecure]) || App.Utility.ConnectionSecurity[me.actionSecure]() !== true) return;
        }
        var windowXType = me.xtype.split('-');
        windowXType = windowXType[windowXType.length - 1];
        var win = Ext.create({ xtype: 'App-View-Connections-' + windowXType.replace('Add', '') + '-AddEditView', purpose: 'Add' }).show();
        if (!me.up('App-View-Connections-Component-AddEditViewWindow')) {
            win.addListener({
                close: {
                    fn: function WindowClose() {
                        var connectionsCnt = this.getConnectionsCnt();
                        if (connectionsCnt) {
                            var grid = connectionsCnt.down('grid');
                            if (grid) grid.store.load();
                        }
                    },
                    scope: this
                }
            });
        }
    },
    HeaderSearchButtonClick: function HeaderSearchButtonClick(me) {
        //var connectionsCnt = this.getConnectionsCnt();
        //if (connectionsCnt) {
        //    var grid = connectionsCnt.down('grid');
        //    if (grid) grid.store.load();
        //}
        var search = me.up('App-View-Connections-Header-Search');
        if (search) {
            search.fireEvent('dosearch', search, search.getSearchParam());
            search.searchApplied = !Ext.isEmpty(search.getSearchParam());
        }
    },
    HeaderSearchTextKeyUp: function HeaderSearchTextKeyUp(me, event, eOpts) {
        var doSearch = false;
        if (event.keyCode === event.ENTER && !Ext.isEmpty(me.getValue())) {
            doSearch = true;
            me.up().searchApplied = true;
        }
        if ((event.keyCode === event.BACKSPACE || event.keyCode === event.DELETE) && Ext.isEmpty(me.getValue()) && me.up().searchApplied) doSearch = true;
        if (doSearch) this.HeaderSearchButtonClick(me.nextSibling('#SearchButton'));
    }
});