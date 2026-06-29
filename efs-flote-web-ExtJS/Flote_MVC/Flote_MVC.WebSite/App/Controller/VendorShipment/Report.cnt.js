/* ====================================================================================================
NAME:			[Location Vendor Shipment Controller]
BEHAVIOR:		Shows Vendor Shipment Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/09/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.VendorShipment.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-VendorShipment-Report': {
                activate: this.ReportTabActivate
            },
            'App-View-VendorShipment-Grid': {
                cellclick: this.VendorShipmentCellClick
            },
            '[xtype="App-View-ShipmentSummary-Report"] #btnShipDetailExport ': {
                click: this.ShipDetailExportToExcel
            }
        });
    },
    ReportTabActivate: function ReportTabActivate(tab) {
        if (localStorage) { localStorage.setItem('pageName', 'vendorshipment'); }
        PgAtt.setControllerPage("vendorshipment");
        var grid = tab.down('App-View-VendorShipment-Grid');
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        // Change currency in Excel by Sriram Sundara
        filter.down('#filDisplayCurr combobox').setValue(PgAtt.getDisplay_currency());

        filter.showHideFilter();
        grid = tab.down('grid');
        filter.down('#msgWarning').hide();
        this.SetCurrencyColumn(grid);

        if (grid) {
            PgAtt.getGridCustomMsg("Vendor Shipment");
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
    VendorShipmentCellClick: function (me, td, cellIndex, record) {
        if (cellIndex > 0) {
            var filter = this.getActiveFilterPanel();
            if (filter == null) {
                filter = this.getAllFilterPanel()[0];
            }

            var colName = me.grid.columns[cellIndex].itemId;
            var colValue = Ext.util.Format.trim(td.innerText);

            /*ignore jslint start*/
            switch (colName) {
                case 'colVenCarrName':
                    if (colValue != PgAtt.getVendor_code()) {
                        PgAtt.setVendor_code(colValue);
                        filter.down('#filVendorCode clearCombo').setValue(colValue)
                        filter.down('#filVendorCode clearCombo').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setVendor_code('');
                        filter.down('#filVendorCode clearCombo').setValue('')
                    }
                    break;
                case 'colMblNbr':
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
                case 'colCBOL':
                    if (colValue != PgAtt.getMbl_iata_busid()) {
                        PgAtt.setMbl_iata_busid(colValue);
                        filter.down('#filCarrierBOL textfield').setValue(colValue)
                        filter.down('#filCarrierBOL clearCombo').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setMbl_iata_busid('');
                        filter.down('#filCarrierBOL textfield').setValue('')
                    }
                    break;
                case 'colShipNbr':
                    // Add ‘processing’ message when page is waiting for something  by  Sriram
                    Ext.get(me.grid.getEl()).mask();
                    Ext.defer(function () {
                        var win = Ext.widget('App-View-ShipmentSummary-Report');
                        win.rec = record;
                        win.show();
                        Ext.get(me.grid.getEl()).unmask();
                    }, 100);


                    break;
                case 'colShipNbrSort':
                    colValue = record.get('shpmnt_nbr');
                    if (colValue != '') {
                        if (colValue != PgAtt.getShipment_number()) {
                            PgAtt.setShipment_number(colValue);
                            filter.down('#filShipmentNumber clearCombo').setValue(colValue)
                            filter.down('#filShipmentNumber clearCombo').getTrigger('clear').show();
                        }
                        else {
                            PgAtt.setShipment_number('');
                            filter.down('#filShipmentNumber clearCombo').setValue('')
                        }
                    }
                    break;
                case 'colChargeCode':
                    if (colValue != PgAtt.getCharge_code()) {
                        PgAtt.setCharge_code(colValue);
                        filter.down('#filChargeCode clearCombo').setValue(colValue)
                        filter.down('#filChargeCode clearCombo').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setCharge_code('');
                        filter.down('#filChargeCode clearCombo').setValue('')
                    }
                    break;
                default:
                    break;
            }
            if (['colChargeCode', 'colCBOL', 'colMblNbr', 'colVenCarrName', 'colShipNbrSort'].indexOf(colName) >= 0) {
                if (filter == null) {
                    filter = this.getAllFilterPanel()[0];
                }
                filter.showHideFilter();
                var pager = me.grid.down('[xtype="pagingtoolbar"]');
                me.grid.getStore().getProxy().extraParams = filter.GetParameters();
                // load new data
                if (pager) pager.moveFirst(); else me.grid.getStore().load();
            }
            /*ignore jslint end*/
        }
    },
    SetCurrencyColumn: function SetCurrencyColumn(me) {
        var colSellAmt_VS = me.down('#colSellAmt_VS');
        var colBuyAmt_VS = me.down('#colBuyAmt_VS');
        var colDiffAmt_VS = me.down('#colDiffAmt_VS');

        colSellAmt_VS.setText('<Div style="color:white;">Amt <BR> (' + PgAtt.getDisplay_currency() + ')</Div>')
        colBuyAmt_VS.setText('<Div style="color:white;">Amt <BR> (' + PgAtt.getDisplay_currency() + ')</Div>')
        colDiffAmt_VS.setText('<Div style="color:white;">Diff Amt <BR> (' + PgAtt.getDisplay_currency() + ')</Div>')
    },
    ShipDetailExport: function ShipDetailExport(exportType, rec) {        
        if (rec != '' && rec != null && Ext.isObject(rec)) {

            if (exportType != "PDF") {
                var params = {
                    ShipmentNumber: rec.get("shpmnt_nbr"),
                    // Change currency in Excel by Sriram Sundara
                    DisplayCurr: PgAtt.getDisplay_currency(),
                    ExportType: exportType
                };
                var form = Ext.create('Ext.form.Panel', {
                    standardSubmit: true,
                    url: 'api/WebAPIReport/ShipmentDetailsExport',
                    method: 'POST'
                });

                form.submit({
                    target: '_blank',
                    params: params
                });
            }
        }
    },
    ShipDetailExportToExcel: function ShipDetailExportToExcel(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var win = me.up('window');
        var rec = win.rec;
        var exportType = 'SHPDTL';
        this.ShipDetailExport(exportType, rec);
        filter.fireEvent('btnApply');
    }
});