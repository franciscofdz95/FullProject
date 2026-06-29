/* ====================================================================================================
NAME:			[Location Vendor Controller]
BEHAVIOR:		Shows LocationVendor Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/09/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.LocationVendor.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-LocationVendor-Report': {
                activate: this.ReportTabActivate
            },
            'App-View-LocationVendor-Grid': {
                cellclick: this.LocationVendorCellClick
            }
        });
    },
    ReportTabActivate: function ReportTabActivate(tab) {

        if (localStorage) { localStorage.setItem('pageName', 'locationvendor'); }
        PgAtt.setControllerPage("locationvendor");
        var grid = tab.down('App-View-LocationVendor-Grid');
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }


        filter.showHideFilter();
        grid = tab.down('grid');
        filter.down('#msgWarning').hide();

        if (grid) {
            PgAtt.getGridCustomMsg("Location Vendor");
            var store = grid.getStore();
            if (store) {
                var pager = grid.down('[xtype="pagingtoolbar"]');
                var extraParams = {}
                if (PgAtt.getGeoCode() !== 'CO') {
                    Ext.Object.merge(extraParams, filter.GetParameters(), { GeoId: PgAtt.getGeoId(), GeoCode: PgAtt.getGeoCode() });
                } else {
                    Ext.Object.merge(extraParams, filter.GetParameters());
                }
                store.getProxy().extraParams = extraParams;
                //Re-load the grid.
                if (PgAtt.getMsgEmptyDataFlag()) {
                    if (pager) pager.moveFirst(); else store.load();
                } else {
                    store = null;
                    var view = grid.getView();
                    view.getStore().clearFilter(true);
                    view.getStore().removeAll(true);
                    view.emptyText = '<div class="x-grid-empty">' + PgAtt.getMsgEmptyDataCustom() + '</div>';
                    view.refresh();
                }
            }
        }
    },
    LocationVendorCellClick: function (me, td, cellIndex) {
        if (cellIndex > 0) {
            var colName = me.grid.columns[cellIndex].itemId;
            var colValue = Ext.util.Format.trim(td.innerText);
            var filter = this.getActiveFilterPanel();
            if (filter == null) {
                filter = this.getAllFilterPanel()[0];
            }

            if (colName == 'colVendorCode') {
                var tabPanel = this.getActiveCurrent();
                if (tabPanel == null) {
                    tabPanel = this.getAllCurrent();
                }
                filter.down('#filVendorCode clearCombo').setValue(colValue);
                filter.down('#filVendorCode clearCombo').getTrigger('clear').show();
                PgAtt.setVendor_code(colValue);
                tabPanel.setActiveTab(5);
            }
        }

    }
});