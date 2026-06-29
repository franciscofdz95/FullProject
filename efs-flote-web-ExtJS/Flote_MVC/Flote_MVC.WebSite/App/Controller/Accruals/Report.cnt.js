/* ====================================================================================================
NAME:			[Accruals Controller]
BEHAVIOR:		Shows Accruals Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/09/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Accruals.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-Accrual-Accuracy-Report': {
                activate: this.ReportTabActivate
            },
            'App-View-Accrual-Details-Report': {
                activate: this.ReportTabActivate
            },
            'App-View-Accrual-JournalEntry-Report': {
                activate: this.ReportTabActivate
            }
        });
    },
    ReportTabActivate: function ReportTabActivate(tab) {
        var tabName = tab.tab.text;
        var grid = '';
        switch (tabName) {

            case 'Accrual Monthly Journal Entry':
                grid = tab.down('App-View-Accrual-JournalEntry-Grid');
                break;
            case 'Accrual Monthly Details':
                grid = tab.down('App-View-Accrual-Details-Grid');
                break;
            case 'Accrual Accuracy Report':
                grid = tab.down('App-View-Accrual-Accuracy-Grid');
                break;

            default:
                break;
        }
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }

        filter.showHideFilter();

        filter.down('#msgWarning').hide();

        if (grid) {
            PgAtt.getGridCustomMsg(tabName);
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
    }
});