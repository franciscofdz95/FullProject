Ext.define('App.Controller.Connections.Container', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'ConnectionsSearch', selector: 'App-View-Connections-Header-Search' },
        { ref: 'ShowInactiveToggle', selector: 'App-View-Connections-Connection-Component-ShowInactiveToggle' },
        { ref: 'ShowEnvironmentMismatch', selector: 'App-View-Connections-Connection-Component-ShowEnvironmentMismatch' },
        { ref: 'EnvironmentFilter', selector: 'App-View-Connections-Connection-Component-EnvironmentFilter' }
    ],

    init: function init() {
        this.control({
            'App-View-Connections-Container': {
                beforerender: this.ConnectionsContainerBeforeRender
            },
            'App-View-Connections-MenuItem': {
                beforerender: this.ConnectionsMenuItemBeforeRender
            },
            'App-View-Connections-AdminMenuItem': {
                beforerender: this.ConnectionsMenuItemBeforeRender
            },
            'App-View-Connections-Container grid': {
                beforerender: this.ConnectionsGridBeforeRender,
                afterlayout: this.ConnectionsGridAfterLayout,
                storebeforeload: this.ConnectionsGridStoreBeforeLoad,
                storeload: this.ConnectionsGridStoreLoad,
                cellclick: this.ConnectionsGridCellClick,
                connectionview: this.ConnectionsGridConnectionView,
                connectionedit: this.ConnectionsGridConnectionEdit,
                connectionuserview: this.ConnectionsGridConnectionUserView,
                connectionuserEdit: this.ConnectionsGridConnectionUserEdit,
                connectionuserpasswordedit: this.ConnectionsGridConnectionUserPasswordEdit,
                databaseview: this.ConnectionsGridDatabaseView,
                databaseedit: this.ConnectionsGridDatabaseEdit,
                serverview: this.ConnectionsGridServerView,
                serveredit: this.ConnectionsGridServerEdit,
                applicationconnectiontest: this.ApplicationConnectionTest,
                updateapplicationstatus: this.UpdateApplicationStatus
            }
        });
    },
    ConnectionsContainerBeforeRender: function ConnectionsContainerBeforeRender(me) {
        if (!App.Utility.ConnectionSecurity.isBIADeveloper()) {
            me.removeAll();
            me.add({ xtype: 'App-View-Connections-Component-NoAccess' });
        }
        else {
            if (!Ext.isEmpty(me.viewListConfig[me.viewList])) me.add(me.viewListConfig[me.viewList]);
            else me.add(me.viewListConfig.Default);
        }
    },
    ConnectionsMenuItemBeforeRender: function ConnectionsMenuItemBeforeRender(me) {
        if (App.Utility.ConnectionSecurity.isBIADeveloper()) me.show();
        else me.hide();
    },
    ConnectionsGridBeforeRender: function ConnectionsGridBeforeRender(me) {
        var showInactiveToggle = this.getShowInactiveToggle();
        if (showInactiveToggle) me.addManagedListener(showInactiveToggle, 'change', function ShowInactiveToggleChange() { me.store.load(); }, this);

        var connectionsSearch = this.getConnectionsSearch();
        if (connectionsSearch) me.addManagedListener(connectionsSearch, 'dosearch', function ConnectionsSearchDoSearch() { me.store.load(); }, this);
        
    },
    ConnectionsGridAfterLayout: function ConnectionsGridAfterLayout(me) {
        me.getColumns()[me.columns.length - 1].setHidden(!App.Utility.ConnectionSecurity.isBIAAppDevMgr());
        if (!me.store.isLoading() && !me.store.isLoaded()) {
            me.adjustPageSize(me);
            me.store.load();
        }
    },
    ConnectionsGridStoreBeforeLoad: function ConnectionsGridStoreBeforeLoad(me) {
        var connectionSearch = this.getConnectionsSearch();
        if (connectionSearch && connectionSearch.searchApplied) {
            me.store.getProxy().extraParams = Ext.apply(me.store.getProxy().extraParams, connectionSearch.getSearchParam() || connectionSearch.getDefaultSearchParam());
        }

        var showInactiveToggle = this.getShowInactiveToggle();
        if (showInactiveToggle) {
            me.store.getProxy().extraParams = Ext.apply(me.store.getProxy().extraParams, { showInactive: showInactiveToggle.getValue() } );
        }

        var showEnvironmentMismatch = this.getShowEnvironmentMismatch();
        if (showEnvironmentMismatch) {
            me.store.getProxy().extraParams = Ext.apply(me.store.getProxy().extraParams, { showEnvironmentMismatch: showEnvironmentMismatch.getValue() });
        }

        var environmentFilter = this.getEnvironmentFilter();
        if (environmentFilter) {
            me.store.getProxy().extraParams = Ext.apply(me.store.getProxy().extraParams, { environmentId: environmentFilter.getValue() });
        }
    },
    ConnectionsGridStoreLoad: function ConnectionsGridStoreLoad(me, store, success, records) {
        //if (store.loadCount == 1) store.load();
    },
    ConnectionsGridCellClick: function ConnectionsGridCellClick(gridView, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        var col = gridView.grid.getColumns()[cellIndex];
        if (col && !Ext.isEmpty(col.clickEvent)) gridView.grid.fireEvent(col.clickEvent, gridView.grid, col, record, rowIndex, td, tr);
    },
    ConnectionsGridShowWindow: function ConnectionsGridShowWindow(me, config) {
        var win = Ext.create(config).show();
        win.addListener({ close: { fn: function WindowClose() { me.store.load(); }, scope: this } });
    },
    ConnectionsGridConnectionView: function ConnectionsGridConnectionView(me, column, record, rowIndex, td, tr) {
        if (App.Utility.ConnectionSecurity.isBIADeveloper()) this.ConnectionsGridShowWindow(me, { xtype: 'App-View-Connections-Connection-AddEditView', purpose: 'View', ConnectionId: record.get('ConnectionId') });
    },
    ConnectionsGridConnectionEdit: function ConnectionsGridConnectionEdit(me, column, record, rowIndex, td, tr) {
        if (App.Utility.ConnectionSecurity.isBIADeveloper()) this.ConnectionsGridShowWindow(me, { xtype: 'App-View-Connections-Connection-AddEditView', purpose: 'Edit', ConnectionId: record.get('ConnectionId') });
    },
    ConnectionsGridConnectionUserView: function ConnectionsGridConnectionUserView(me, column, record, rowIndex, td, tr) {
        if (App.Utility.ConnectionSecurity.isBIAAppDevMgr()) this.ConnectionsGridShowWindow(me, { xtype: 'App-View-Connections-ConnectionUser-AddEditView', purpose: 'View', UserId: record.get('UserId') });
    },
    ConnectionsGridConnectionUserEdit: function ConnectionsGridConnectionUserEdit(me, column, record, rowIndex, td, tr) {
        if (App.Utility.ConnectionSecurity.isBIAAppDevMgr()) this.ConnectionsGridShowWindow(me, { xtype: 'App-View-Connections-ConnectionUser-AddEditView', purpose: 'Edit', UserId: record.get('UserId') });
    },
    ConnectionsGridConnectionUserPasswordEdit: function ConnectionsGridConnectionUserPasswordEdit(me, column, record, rowIndex, td, tr) {
        if (App.Utility.ConnectionSecurity.isBIAAppDevMgr()) this.ConnectionsGridShowWindow(me, { xtype: 'App-View-Connections-ConnectionUser-AuthKeyEdit', UserId: record.get('UserId') });
    },
    ConnectionsGridDatabaseView: function ConnectionsGridDatabaseView(me, column, record, rowIndex, td, tr) {
        if (App.Utility.ConnectionSecurity.isConnectionAdmin()) this.ConnectionsGridShowWindow(me, { xtype: 'App-View-Connections-Database-AddEditView', purpose: 'View', DatabaseId: record.get('DatabaseId') });
    },
    ConnectionsGridDatabaseEdit: function isConnectionAdmin(me, column, record, rowIndex, td, tr) {
        if (App.Utility.ConnectionSecurity.isBIADeveloper()) this.ConnectionsGridShowWindow(me, { xtype: 'App-View-Connections-Database-AddEditView', purpose: 'Edit', DatabaseId: record.get('DatabaseId') });
    },
    ConnectionsGridServerView: function ConnectionsGridServerView(me, column, record, rowIndex, td, tr) {
        if (App.Utility.ConnectionSecurity.isConnectionAdmin()) this.ConnectionsGridShowWindow(me, { xtype: 'App-View-Connections-Server-AddEditView', purpose: 'View', ServerId: record.get('ServerId') });
    },
    ConnectionsGridServerEdit: function ConnectionsGridServerEdit(me, column, record, rowIndex, td, tr) {
        if (App.Utility.ConnectionSecurity.isConnectionAdmin()) this.ConnectionsGridShowWindow(me, { xtype: 'App-View-Connections-Server-AddEditView', purpose: 'Edit', ServerId: record.get('ServerId') });
    },
    ApplicationConnectionTest: function ApplicationConnectionTest(me, column, record, rowIndex, td, tr) {
       var connectionRecord = {
            ConnectionId: '',
            ServerTypeId: ''
        };
        connectionRecord.ConnectionId = record.get('ConnectionId');
        connectionRecord.ServerTypeId = record.get('Provider').toLowerCase().includes('sql') ? '1' : '2';

        td.innerHTML = '<div unselectable="on" class="x-grid-cell-inner " style="text-align: center; "><i class="fa fa-spinner fa-spin" data-qtip="Connecting....."></i></div>'; 

        BIA.Ajax.request({
            url: 'api/BIASecurity/TestApplicationConnection',
            method: 'POST',
            jsonData: connectionRecord,
            success: function (response, request) {
                responseDataDecoded = response.responseText;
                if (responseDataDecoded == 'true') {     
                    td.innerHTML = '<div unselectable="on" class="x-grid-cell-inner " style="text-align: center; "><i class="fa fa-circle" style="color: #64A70B" data-qtip="Connection Successful"></i></div>';                    
                }
                else {
                    td.innerHTML = '<div unselectable="on" class="x-grid-cell-inner " style="text-align: center; "><i class="fa fa-circle" style="color: #F31A12" data-qtip="Connection Failed"></i></div>';                                        
                }
            },
            failure: function (response, request) {
                //todo
            },            
            scope: this
        });
    },
    UpdateApplicationStatus: function UpdateApplicationStatus(me, column, record, rowIndex, td, tr) {

        var connectionDetail = record.data;
        connectionDetail.Active = connectionDetail.Active == 1 ? 0 : 1;
        
        BIA.Ajax.request({
            url: 'api/BIASecurity/AddEditConnection',
            method: 'POST',
            jsonData: connectionDetail,
            success: function (response, request) {
                me.store.load();
            },
            failure: function (response, request) {
                //todo
            },
            scope: this
        });
    }
});