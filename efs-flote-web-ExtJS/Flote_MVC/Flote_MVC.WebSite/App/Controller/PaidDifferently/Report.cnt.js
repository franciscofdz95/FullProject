/* ====================================================================================================
NAME:			[PaidDifferently Controller]
BEHAVIOR:		Shows PaidDifferently Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/06/2020          Rama Yagati		      Created.
 ======================================================================================================*/
Ext.define('App.Controller.PaidDifferently.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-PaidDifferently-Report': {
                activate: this.ReportTabActivate
            }
        });
    },
    ReportTabActivate: function ReportTabActivate(tab) {

        if (localStorage) { localStorage.setItem('pageName', 'PaidDifferently'); }
        PgAtt.setControllerPage("PaidDifferently");
        var grid = tab.down('App-View-PaidDifferently-Grid');

        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }

        filter.showHideFilter();
        grid = tab.down('grid');

        if (grid) {
            PgAtt.getGridCustomMsg("PaidDifferently");
            var store = grid.getStore();
            if (store) {
                var pager = grid.down('[xtype="pagingtoolbar"]');
                store.getProxy().extraParams = filter.GetParameters();
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
    }

});