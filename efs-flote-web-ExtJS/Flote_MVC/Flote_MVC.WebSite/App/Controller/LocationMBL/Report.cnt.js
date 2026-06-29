/* ====================================================================================================
NAME:			[Location MBL Ocean Controller]
BEHAVIOR:		Shows Location MBL Ocean Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/09/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.LocationMBL.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-LocationMBL-Report': {
                activate: this.ReportTabActivate
            },
            'App-View-LocationMBL-Grid': {
                cellclick: this.LocationMBLCellClick
            }
        });
    },
    ReportTabActivate: function ReportTabActivate(tab) {

        if (localStorage) { localStorage.setItem('pageName', 'locationmasterbill'); }
        PgAtt.setControllerPage("locationmasterbill");
        var grid = tab.down('App-View-LocationMBL-Grid'), store = '', pager = '';
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        PgAtt.setDisplay_currency(filter.down('#filDisplayCurr combobox').rawValue);

        filter.showHideFilter();
        grid = tab.down('grid');
        this.SetCurrencyColumn(grid);
        filter.down('#msgWarning').hide();

        if (grid) {
            PgAtt.getGridCustomMsg("Location Ocean MBL");
            store = grid.getStore();
            if (store) {
                pager = grid.down('[xtype="pagingtoolbar"]');
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
    LocationMBLCellClick: function (me, td, cellIndex, record) {

        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        if (cellIndex > 0) {
            var colName = me.grid.columns[cellIndex].itemId;
            var colValue = Ext.util.Format.trim(td.innerText);

            /*ignore jslint start*/
            switch (colName) {
                case 'colMblNbrSortLocM':
                    colValue = record.get('mbl_nbr');
                    if (colValue != PgAtt.getMbl_number()) {
                        PgAtt.setMbl_number(colValue);
                        filter.down('#filMBLNumber clearCombo').setValue(colValue)
                        filter.down('#filMBLNumber clearCombo').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setMbl_number('');
                        filter.down('#filMBLNumber clearCombo').setValue('')
                    }

                    break;
                case 'colMblNbr':

                    // Add ‘processing’ message when page is waiting for something  by  Sriram
                    Ext.get(me.grid.getEl()).mask();
                    Ext.defer(function () {
                        var win = Ext.widget('App-View-LocationMBL-OceanMBL-Report');
                        win.record = record;
                        win.show();
                        Ext.get(me.grid.getEl()).unmask();
                    }, 100);

                    break;
                default:
            }
            if (colName == 'colMblNbrSortLocM') {
                filter.showHideFilter();
                var pager = me.grid.down('[xtype="pagingtoolbar"]');
                me.grid.getStore().getProxy().extraParams = filter.GetParameters();
                // load new data
                if (pager) pager.moveFirst(); else me.grid.getStore().load();
            }
        }
    },
    SetCurrencyColumn: function SetCurrencyColumn(me) {
        var colManifested = me.down('#colManifested');
        var colLocal = me.down('#colLocal');
        var colTotDiff = me.down('#colTotDiff');

        colManifested.setText('<Div style="color:white;">Manifested (' + PgAtt.getDisplay_currency() + ')</Div>');
        colLocal.setText('<Div style="color:white;">Local (' + PgAtt.getDisplay_currency() + ')</Div>');
        colTotDiff.setText('<Div style="color:white;">Total Diff <BR> Amt (' + PgAtt.getDisplay_currency() + ')</Div>');
    }
});