/* ====================================================================================================
NAME:			[Location Shipment Controller]
BEHAVIOR:		Shows Location Shipment Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/09/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.LocationShipment.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-LocationShipment-Report': {
                activate: this.ReportTabActivate
            },
            'App-View-LocationShipment-Grid': {
                cellclick: this.LocationShipmentCellClick
            }
        });
    },
    ReportTabActivate: function ReportTabActivate(tab) {

        if (localStorage) { localStorage.setItem('pageName', 'locationshipment'); }
        PgAtt.setControllerPage("locationshipment");
        var grid = tab.down('App-View-LocationShipment-Grid');
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
            PgAtt.getGridCustomMsg("Location Shipment");
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

            if (PgAtt.getLocation_type() == 'TP') {
                grid.getColumns()[grid.down('[dataIndex=BalanceSheetAmtUSD]').fullColumnIndex].setVisible(true);
            }
            else {
                grid.getColumns()[grid.down('[dataIndex=BalanceSheetAmtUSD]').fullColumnIndex].setVisible(false);
            }
            //Loc Difference column
            grid.getColumns()[grid.down('[dataIndex=Loc_Diff]').fullColumnIndex].setVisible(true);
        }
    },
    LocationShipmentCellClick: function (me, td, cellIndex, record) {
        if (cellIndex > 0) {
            var filter = this.getActiveFilterPanel();
            if (filter == null) {
                filter = this.getAllFilterPanel()[0];
            }
            var colName = me.grid.columns[cellIndex].itemId;
            var colValue = Ext.util.Format.trim(td.innerText);

            /*ignore jslint start*/
            switch (colName) {
                case 'colShpNbrSortLS':
                    colValue = record.get('shpmnt_nbr');
                    if (colValue != PgAtt.getShipment_number()) {
                        PgAtt.setShipment_number(colValue);
                        filter.down('#filShipmentNumber clearCombo').setValue(colValue)
                        filter.down('#filShipmentNumber clearCombo').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setShipment_number('');
                        filter.down('#filShipmentNumber clearCombo').setValue('')
                    }

                    break;
                case 'colShpNbrLS':                   

                    // Add ‘processing’ message when page is waiting for something  by  Sriram
                    Ext.get(me.grid.getEl()).mask();
                    Ext.defer(function () {
                        var win = Ext.widget('App-View-ShipmentSummary-Report');
                        win.rec = record;
                        win.show();
                        Ext.get(me.grid.getEl()).unmask();
                    }, 100);

                    break;
                default:
                    break;
            }
            if (colName == 'colShpNbrSortLS') {

                if (filter == null) {
                    filter = this.getAllFilterPanel()[0];
                }
                filter.showHideFilter();
                var pager = me.grid.down('[xtype="pagingtoolbar"]');
                me.grid.getStore().getProxy().extraParams = filter.GetParameters();
                // load new data
                if (pager) pager.moveFirst(); else me.grid.getStore().load();
            }
        }
        /*ignore jslint end*/


    },
    SetCurrencyColumn: function SetCurrencyColumn(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var grid = me;
        if (['TP'].indexOf(filter.down('#filLocType combobox').getValue()) >= 0) {
            grid.columns[2].setVisible(false);
            grid.columns[3].setVisible(false);
            grid.columns[23].setVisible(false);
            grid.columns[24].setVisible(false);
            grid.columns[26].setVisible(true);
        }
        else {
            grid.columns[2].setVisible(true);
            grid.columns[3].setVisible(true);
            grid.columns[23].setVisible(true);
            grid.columns[24].setVisible(true);
            grid.columns[25].setVisible(true);
            grid.columns[26].setVisible(true);
        }
        var colManifested = me.down('#colManifestedShip');
        var colLocal = me.down('#colLocalShip');
        var colTotDiff = me.down('#colTotDiffShip');

        colManifested.setText('<Div style="color:white;">Manifested (' + PgAtt.getDisplay_currency() + ')</Div>');
        colLocal.setText('<Div style="color:white;">Local (' + PgAtt.getDisplay_currency() + ')</Div>');
        colTotDiff.setText('<Div style="color:white;">Total Diff <BR> Amt (' + PgAtt.getDisplay_currency() + ')</Div>');
    }
});