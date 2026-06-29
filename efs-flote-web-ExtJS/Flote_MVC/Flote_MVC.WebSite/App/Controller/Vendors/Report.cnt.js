/* ====================================================================================================
NAME:			[Vendors Controller]
BEHAVIOR:		Shows Vendors Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/09/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Vendors.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-Vendors-Report': {
                activate: this.ReportTabActivate
            },
            'App-View-Vendors-Grid': {
                cellclick: this.VendorsCellClick
            }
        });
    },
    ReportTabActivate: function ReportTabActivate(tab) {
        if (localStorage) { localStorage.setItem('pageName', 'vendorlist'); }
        PgAtt.setControllerPage("vendorlist");
        var grid = tab.down('App-View-Vendors-Grid');

        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }


        filter.showHideFilter();
        grid = tab.down('grid');
        filter.down('#msgWarning').hide();

        if (grid) {
            PgAtt.getGridCustomMsg("Vendors");
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
    },
    VendorsCellClick: function (me, td, cellIndex) {
        if (cellIndex > 0) {
            var filter = this.getActiveFilterPanel();
            if (filter == null) {
                filter = this.getAllFilterPanel()[0];
            }

            var colName = me.grid.columns[cellIndex].itemId;
            var colValue = Ext.util.Format.trim(td.innerText);

            /*ignore jslint start*/
            switch (colName) {
                case 'colApVendorId':
                    me.grid.columnName = 'colApVendorId';
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
                case 'colE2kCarrCode':
                    if (colValue != PgAtt.getE2k_Carrier_Code()) {
                        PgAtt.setE2k_Carrier_Code(colValue);
                        filter.down('#filE2kCarrierCode textfield').setValue(colValue)
                        filter.down('#filE2kCarrierCode textfield').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setE2k_Carrier_Code('');
                        filter.down('#filE2kCarrierCode textfield').setValue('')
                    }

                    break;
                case 'colVenEngName':
                    if (colValue != PgAtt.getVendor_Name_English()) {
                        PgAtt.setVendor_Name_English(colValue);
                        filter.down('#filVendorEnglishName textfield').setValue(colValue)
                        filter.down('#filVendorEnglishName textfield').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setVendor_Name_English('');
                        filter.down('#filVendorEnglishName textfield').setValue('')
                    }
                    break;
                case 'colVenLegName':
                    if (colValue != PgAtt.getVendor_Legal_Name()) {
                        PgAtt.setVendor_Legal_Name(colValue);
                        filter.down('#filVendorLegalName textfield').setValue(colValue)
                        filter.down('#filVendorLegalName textfield').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setVendor_Legal_Name('');
                        filter.down('#filVendorLegalName textfield').setValue('')
                    }
                    break;
                case 'colRemitId':
                    me.grid.columnName = 'colRemitId';
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
                default:
            }
            if (['colApVendorId', 'colRemitId', 'colVenLegName', 'colVenEngName', 'colE2kCarrCode'].indexOf(colName) >= 0) {
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
    }

});