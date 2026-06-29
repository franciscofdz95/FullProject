/* ====================================================================================================
NAME:			[Common Report Filter Controller ]
BEHAVIOR:		Connects to reports data for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/


Ext.define('App.Controller.Common.FilteredReport', {
    extend: 'Ext.app.Controller',
    itemId: 'filterControllerId',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        var me = this;

        me.control({
            '[xtype="App-View-Component-FilterFields"] #searchTextId': {
                keyup: me.onSearchTextKeyPress
            },
            '[xtype="App-View-Component-FilterFields"]': {
                btnApply: me.applyFilter
            },
            '[xtype="button"]': {
                btnApply: me.applyFilter
            },
            '[xtype="actioncolumn"] ': {
                btnApply: me.applyFilter
            }
        });
        me.listen({
            global: {
                btnApply: me.applyFilter
            }
        });

    },

    onSearchTextKeyPress: function (textfield, event, options) {
        if (event.getKey() == event.ENTER) {
            this.applyFilter()
        }
    },
    // Applies the Filter criteria based on GO button click 
    applyFilter: function applyFilter() {
        this.searchFilterParams();
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }

        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }

        var button = filter.down('#ApplyButton');
        button.disable();
        PgAtt.setDisplay_currency(filter.down('#filDisplayCurr combobox').rawValue);
        var t = tabPanel.activeTab.tab.text;
        if (t != "Bills" && t != "Vendor Statement Summary") {
            tabPanel.activeTab.fireEvent('activate', tabPanel.activeTab);
        }
        var pageName = t;
        if (tabPanel) {
            switch (pageName) {
                case 'Location Shipment':

                    break;
                case 'Location Ocean MBL':
                    break;
                case 'Bills':
                    activeTab = tabPanel.activeTab.activeTab;


                    var billsTab = tabPanel.down('#AppBillTabPanelId');

                    // Enter Invoice Status in  filter panel and click Go 
                    // then  user must be  navigated between   Invoice status tabs 
                    filter = this.getActiveFilterPanel();
                    if (filter == null) {
                        filter = this.getAllFilterPanel()[0];
                    }

                    if (activeTab.title != 'Payment Details') {
                        if (filter.down('#filInvoiceStatus textfield').getValue() != '') {
                            PgAtt.setInvoice_status(filter.down('#filInvoiceStatus textfield').getValue());
                        }
                        // Sriram Sundara (BFM8QLD)
                        BillsSingCls.getByPassImgByLocCmpCode();

                        if (activeTab.tabNo != PgAtt.getBillTabCount()) {
                            billsTab.setActiveTab(PgAtt.getBillTabCount());
                        } else {
                            activeTab.fireEvent('activate', activeTab);
                        }
                    }
                    else {
                        activeTab.fireEvent('activate', activeTab);
                    }
                    break;
                case 'Location Vendor':
                    break;
                case 'Vendor Shipment':
                    break;
                case 'Vendors':
                    break;
                case 'Reports':                   
                    activeTab = tabPanel.activeTab.activeTab;
                    activeTab.fireEvent('activate', activeTab);
                    break;
                case 'Vendor Statement Summary':
                    var activeTab = tabPanel.activeTab.activeTab;
                    activeTab.fireEvent('activate', activeTab);
                    break;
                default:
                    break;
            }
        }

        button.enable();
    },
    searchFilterParams: function () {
        var me = this;
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var tabPanel = this.getActiveCurrent().activeTab;

        if (tabPanel == null) {
            tabPanel = this.getAllCurrent().activeTab;
        }

        var tabName = tabPanel.tab.text;
        var searchTextValue = filter.down('#searchTextId').getValue();
        var tableName = ''
        var whereClause = ''

        if (!Ext.isEmpty(searchTextValue) && Ext.String.trim(searchTextValue)) {
            var sValue = searchTextValue.split(" ");
            Ext.Array.each(sValue, function (searchText) {
                if (Ext.util.Format.trim(searchText) != '') {
                    if (tabName != 'Invoice Processing' && tabName != 'Vendor Statement Summary' && tabName != 'Paid Differently') {
                        tableName = 'dim.location';
                        whereClause = 'location_code=' + "'" + searchText + "'";
                        if (searchText.length == 3 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                            PgAtt.setLocation_code(searchText.toUpperCase());
                        }
                    }
                    switch (tabName) {
                        case 'Location Shipment':
                            //Origin/Distination(O/D)
                            if (searchText.length == 1 && ['O', 'D'].indexOf(searchText) >= 0) {
                                PgAtt.setOD(searchText);
                            }
                            if (searchText.length == 4 && ['Orig', 'Dest'].indexOf(searchText) >= 0) {
                                PgAtt.setOD(searchText);
                            }
                            // Charge_Status(U/I)
                            if (searchText.length == 1 && ['U', 'I'].indexOf(searchText) >= 0) {
                                PgAtt.setCharge_status(searchText);
                            }
                            if (searchText.length == 8 && ['UNRELEAS', 'INVOICED'].indexOf(searchText.toUpperCase()) >= 0) {
                                PgAtt.setCharge_status(searchText);
                            }
                            // receivedate
                            tableName = 'AppData.flote_main';
                            whereClause = 'rcvd_at_dt = ' + "'" + searchText + "'";
                            if (searchText.length > 7 && Date.parse(searchText, "mm/dd/yyyy") && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setRcvdAtDate(searchText);
                            }
                            //Shipment Number
                            // tableName = 'AppData.flote_main';
                            whereClause = 'shpmnt_nbr = ' + "'" + searchText + "'";
                            if (searchText.length == 10 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setShipment_number(searchText);
                            }
                            //mbl number
                            tableName = 'e2k.mbl_fact';
                            whereClause = 'mbl_busid = ' + "'" + searchText + "'";
                            if (searchText.length == 14 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setMbl_number(searchText);
                            }
                            //Carrier Id                
                            whereClause = 'mbl_iata_busid = ' + "'" + searchText + "'";
                            if (searchText.length > 10 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setCarrier_id(searchText);
                            }
                            //Service Code
                            tableName = 'AppData.flote_main';
                            whereClause = 'service_code=' + "'" + searchText + "'" + '  and acctg_per_year =' + "'" + PgAtt.getYear() + "'";
                            if (searchText.length >= 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setService_code(searchText);
                            }
                            //Country Code
                            tableName = 'e2k.COUNTRY_DIM';
                            whereClause = 'country_code = ' + "'" + searchText + "'" + '  or country_name like ' + "'%" + searchText + "'";
                            if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setCountry_code(searchText);
                            }

                            break;
                        case 'Location Ocean MBL':
                            // Origin/Distination(O/D) 
                            if (searchText.length == 1 && ['O', 'D'].indexOf(searchText) >= 0) {
                                PgAtt.setOD(searchText);
                            }
                            if (searchText.length == 4 && ['Orig', 'Dest'].indexOf(searchText) >= 0) {
                                PgAtt.setOD(searchText);
                            }
                            if (searchText.length == 7) {
                                var vOrig = Ext.util.Format.substr(searchText.toUpperCase(), 1, 3);
                                var vDest = Ext.util.Format.substr(searchText.toUpperCase(), 5, 3);

                                tableName = 'AppData.flote_main';
                                whereClause = '[orig_tp] = ' + "'" + vOrig + "'" + ' and acctg_per_year =' + "'" + PgAtt.getYear() + "'";
                                if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setOrigin(vOrig);
                                }
                                whereClause = '[dest_tp] = ' + "'" + vDest + "'" + ' and acctg_per_year =' + "'" + PgAtt.getYear() + "'";
                                if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setDestination(vOrig);
                                }
                            }
                            // Charge_Status(U/I)
                            if (searchText.length == 1 && ['U', 'I'].indexOf(searchText) >= 0) {
                                PgAtt.setCharge_status(searchText);
                            }
                            if (searchText.length == 8 && ['UNRELEAS', 'INVOICED'].indexOf(searchText.toUpperCase()) >= 0) {
                                PgAtt.setCharge_status(searchText);
                            }
                            //mbl_cost_basis
                            tableName = 'e2k.cost_basis_dim';
                            whereClause = 'COST_BASIS_CODE = ' + "'" + searchText + "'";
                            if (searchText.length > 1 && searchText.length < 7 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setOrigin(vOrig);
                            }
                            //Shipment Number
                            tableName = 'AppData.flote_main'
                            whereClause = 'shpmnt_nbr = ' + "'" + searchText + "'";
                            if (searchText.length == 10 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setShipment_number(searchText);
                            }
                            //mbl number
                            tableName = 'e2k.mbl_fact';
                            whereClause = 'mbl_busid = ' + "'" + searchText + "'";
                            if (searchText.length == 14 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setMbl_number(searchText);
                            }
                            //Carrier Id                
                            whereClause = 'mbl_iata_busid = ' + "'" + searchText + "'";
                            if (searchText.length > 10 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setCarrier_id(searchText);
                            }
                            //Country Code
                            tableName = 'e2k.COUNTRY_DIM';
                            whereClause = 'country_code = ' + "'" + searchText + "'" + '  or country_name like ' + "'%" + searchText + "'";
                            if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setCountry_code(searchText);
                            }
                            break;
                        case 'Bills':
                            //Invoice Status , Invoice Id, InvoiceRef No, Batch Id
                            if (searchText.length >= 4 && searchText.length <= 8
                                && ['VERIFIED', 'APPROVED', 'ARCHIVED', 'PENDING', 'SCANNED', 'PRINTED', 'LOGGED', 'QUEUED', 'SENT'].indexOf(searchText.toUpperCase()) >= 0) {
                                PgAtt.setInvoice_status(searchText.toUpperCase());
                            }
                            tableName = 'AppData.Invoice';
                            whereClause = 'Invoice_Id=' + "'" + searchText + "'";
                            if (searchText.length >= 5 && Ext.isNumeric(searchText) && Math.round(searchText) == searchText && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setInvoice_id(searchText);
                            }
                            whereClause = 'ImageNumber=' + "'" + searchText + "'";
                            if (['Scanned', 'Queued', 'Archived', 'Sent'].indexOf(PgAtt.getInvoice_status()) >= 0 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setImageNumber(searchText);
                            }
                            whereClause = 'InvRefNo=' + "'" + searchText + "'";
                            if (searchText.length >= 5 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setInvRefNo(searchText);
                            }
                            tableName = 'AppData.InvoiceBatch';
                            whereClause = 'batch_id=' + "'" + searchText + "'";
                            if (['Archived', 'Sent'].indexOf(PgAtt.getInvoice_status()) >= 0 && Ext.isNumeric(searchText) && Math.round(searchText) == searchText && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setInvBatchID(searchText);
                            }
                            //vendor english name,vednor code,vendor legal name, Ap_Remit_Id, Ap Vendor ID
                            tableName = 'AppData.vendor';
                            whereClause = 'Vendor_Name_English like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_Name_English(searchText);
                            }
                            whereClause = 'vendor_code like ' + "'%" + searchText + "%'";
                            if (searchText.length > 5 && searchText.length < 8 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_code(searchText);
                            }
                            whereClause = 'AP_Vendor_Id like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && searchText.length < 8 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_code(searchText);
                            }
                            whereClause = 'AP_Remit_Id like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_code(searchText);
                            }
                            whereClause = 'Vendor_Legal_Name like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_Legal_Name(searchText);
                            }
                            //Container Number
                            tableName = 'e2k.Container_Fact';
                            whereClause = 'Container_BUSID=' + "'" + searchText + "'";
                            if (searchText.length == 11 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setContainer_number(searchText);
                            }
                            //Company Code
                            tableName = 'flote.CMP_COMPANY_CODES';
                            whereClause = 'ora_company=' + "'" + searchText + "'";
                            if (searchText.length == 3 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setCompany_code(searchText);
                            }
                            break;
                        case 'Location Vendor':
                            break;
                        case 'Vendor Shipment':
                            // Origin/Distination(O/D)                 
                            if (searchText.length == 7) {
                                vOrig = Ext.util.Format.substr(searchText.toUpperCase(), 1, 3)
                                vDest = Ext.util.Format.substr(searchText.toUpperCase(), 5, 3)
                                tableName = 'AppData.flote_main';
                                whereClause = '[orig_tp] = ' + "'" + vOrig + "'" + ' and acctg_per_year =' + "'" + PgAtt.getYear() + "'";
                                if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setOrigin(vOrig);
                                }
                                whereClause = '[dest_tp] = "' + "'" + vDest + "'" + ' and acctg_per_year =' + "'" + PgAtt.getYear() + "'";
                                if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setDestination(vOrig);
                                }
                            }

                            // receivedate
                            tableName = 'AppData.flote_main';
                            whereClause = 'rcvd_at_dt= ' + "'" + searchText + "'";
                            if (searchText.length > 7 && Date.parse(searchText, "mm/dd/yyyy") && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setRcvdAtDate(searchText);
                            }
                            //Shipment Number
                            tableName = 'AppData.flote_main';
                            whereClause = 'shpmnt_nbr =' + "'" + searchText + "'";
                            if (searchText.length == 10 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setShipment_number(searchText);
                            }
                            //mbl number
                            tableName = 'e2k.mbl_fact';
                            whereClause = 'mbl_busid =' + "'" + searchText + "'";
                            if (searchText.length == 14 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setMbl_number(searchText);
                            }
                            //Carrier Id                
                            whereClause = 'mbl_iata_busid = ' + "'" + searchText + "'";
                            if (searchText.length > 10 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setCarrier_id(searchText);
                            }

                            //vendor english name,vednor code,vendor legal name, Ap_Remit_Id, Ap Vendor ID
                            tableName = 'AppData.vendor';
                            whereClause = 'Vendor_Name_English like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_Name_English(searchText);
                            }
                            whereClause = 'vendor_code like ' + "'%" + searchText + "%'";
                            if (searchText.length > 5 && searchText.length < 8 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_code(searchText);
                            }
                            whereClause = 'AP_Vendor_Id like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && searchText.length < 8 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_code(searchText);
                            }
                            whereClause = 'AP_Remit_Id like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_code(searchText);
                            }
                            whereClause = 'Vendor_Legal_Name like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_Legal_Name(searchText);
                            }
                            //Container Number
                            tableName = 'e2k.Container_Fact';
                            whereClause = 'Container_BUSID=' + "'" + searchText + "'";
                            if (searchText.length == 11 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setContainer_number(searchText);
                            }
                            //Service Code
                            tableName = 'AppData.flote_main';
                            whereClause = 'service_code=' + "'" + searchText + "'" + '  and acctg_per_year =' + "'" + PgAtt.getYear() + "'";
                            if (searchText.length >= 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setService_code(searchText);
                            }
                            //Country Code
                            tableName = 'e2k.COUNTRY_DIM';
                            whereClause = 'country_code = ' + "'" + searchText + "'" + '    or  country_name like ' + "'%" + searchText + "'";
                            if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setCountry_code(searchText);
                            }
                            tableName = 'dim.ChargeCodeMap';
                            whereClause = 'CHARGE_CODE = ' + "'" + searchText + "'" + '  or CHARGE_TYPE=' + "'" + searchText + "'";
                            if (searchText.length > 1 && searchText.length < 5 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setCharge_code(searchText);
                            }
                            if (searchText.length == 1 && (searchText == "M" || searchText == "L")) {
                                PgAtt.setCost_type(searchText);
                            }

                            break;
                        case 'Vendors':
                            //vendor english name,vednor code,vendor legal name, Ap_Remit_Id, Ap Vendor ID,e2k_Carrier_Code
                            var isFindFlag = false;
                            tableName = 'AppData.vendor';
                            whereClause = 'Vendor_Name_English like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_Name_English(searchText);
                                isFindFlag = true;
                            }
                            whereClause = 'vendor_code like ' + "'%" + searchText + "%'";
                            if (searchText.length > 5 && searchText.length < 8 && me.isDataExits(tableName, whereClause, searchText) > 0 && !isFindFlag) {
                                PgAtt.setVendor_code(searchText);
                            }
                            whereClause = 'AP_Vendor_Id like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && searchText.length < 8 && me.isDataExits(tableName, whereClause, searchText) > 0 && !isFindFlag) {
                                PgAtt.setVendor_code(searchText);
                            }
                            whereClause = 'AP_Remit_Id like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0 && !isFindFlag) {
                                PgAtt.setVendor_code(searchText);
                            }
                            whereClause = 'Vendor_Legal_Name like ' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setVendor_Legal_Name(searchText);
                            }
                            whereClause = 'e2k_Carrier_Code like' + "'%" + searchText + "%'";
                            if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setE2k_Carrier_Code(searchText);
                            }
                            //Container Number
                            tableName = 'e2k.Container_Fact';
                            whereClause = 'Container_BUSID=' + "'" + searchText + "'";
                            if (searchText.length == 11 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setContainer_number(searchText);
                            }
                            //Company Code
                            tableName = 'flote.CMP_COMPANY_CODES';
                            whereClause = 'ora_company=' + "'" + searchText + "'";
                            if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setCompany_code(searchText);
                            }
                            //Country Code
                            tableName = 'e2k.COUNTRY_DIM';
                            whereClause = 'country_code = ' + "'" + searchText + "'" + '  or country_name like ' + "'%" + searchText + "'";
                            if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                PgAtt.setCountry_code(searchText);
                            }

                            break;
                        //case 'Paid Differently':
                        //    tableName = 'AppData.vendor';
                        //    whereClause = 'Vendor_Name_English like ' + "'%" + searchText + "%'";
                        //    if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                        //        PgAtt.setVendorName(searchText);
                        //    }
                        //    //charge currency
                        //    tableName = 'AppData.flote_main';
                        //    whereClause = 'sell_cid =' + "'" + searchText + "'";
                        //    if (searchText.length == 3 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                        //        PgAtt.setChargeCurrency(searchText);
                        //    }
                        //    //Service Code
                        //    whereClause = 'service_code=' + "'" + searchText + "'";
                        //    if (searchText.length >= 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                        //        PgAtt.setServiceLevel(searchText);
                        //    }

                        //    break;
                        case 'Reports':
                            var rptTabName = tabPanel.activeTab.tab.text
                            switch (rptTabName) {
                                case 'Accrual Monthly Journal Entry':
                                    //Company Code
                                    tableName = 'flote.CMP_COMPANY_CODES';
                                    whereClause = 'ora_company=' + "'" + searchText + "'";
                                    if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setCompany_code(searchText);
                                    }
                                    //Country Code
                                    tableName = 'e2k.COUNTRY_DIM';
                                    whereClause = 'country_code =' + "'" + searchText + "'" + ' or country_name like ' + "'%" + searchText + "'";
                                    if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setCountry_code(searchText);
                                    }

                                    break;
                                case 'Accrual Monthly Details':
                                    // receivedate
                                    tableName = 'AppData.flote_main';
                                    whereClause = 'rcvd_at_dt= ' + "'" + searchText + "'";
                                    if (searchText.length > 7 && Date.parse(searchText, "mm/dd/yyyy") && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setRcvdAtDate(searchText);
                                    }
                                    //Shipment Number
                                    tableName = 'AppData.flote_main';
                                    whereClause = 'shpmnt_nbr =' + "'" + searchText + "'";
                                    if (searchText.length == 10 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setShipment_number(searchText);
                                    }
                                    //Company Code
                                    tableName = 'flote.CMP_COMPANY_CODES';
                                    whereClause = 'ora_company=' + "'" + searchText + "'";
                                    if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setCompany_code(searchText);
                                    }
                                    //Country Code
                                    tableName = 'e2k.COUNTRY_DIM';
                                    whereClause = 'country_code =' + "'" + searchText + "'" + ' or country_name like ' + "'%" + searchText + "'";
                                    if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setCountry_code(searchText);
                                    }
                                    //Service Code
                                    tableName = 'AppData.flote_main';
                                    whereClause = 'service_code=' + "'" + searchText + "'" + 'and acctg_per_year =' + "'" + PgAtt.getYear() + "'";
                                    if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setService_code(searchText);
                                    }
                                    tableName = 'dim.ChargeCodeMap';
                                    whereClause = 'CHARGE_CODE = ' + "'" + searchText + "'" + '  or CHARGE_TYPE=' + "'" + searchText + "'";
                                    if (searchText.length > 1 && searchText.length < 5 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setCharge_code(searchText);
                                    }
                                    if (searchText.length == 1 && (searchText == "M" || searchText == "L")) {
                                        PgAtt.setCost_type(searchText);
                                    }

                                    break;
                                //case 'Accrual Accuracy Report':

                                //    break;
                                case 'Paid Differently':
                                    tableName = 'AppData.vendor';
                                    whereClause = 'Vendor_Name_English like ' + "'%" + searchText + "%'";
                                    if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setVendorName(searchText);
                                    }
                                    //charge currency
                                    tableName = 'AppData.flote_main';
                                    whereClause = 'sell_cid =' + "'" + searchText + "'";
                                    if (searchText.length == 3 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setChargeCurrency(searchText);
                                    }
                                    //Service Code
                                    whereClause = 'service_code=' + "'" + searchText + "'";
                                    if (searchText.length >= 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setServiceLevel(searchText);
                                    }
                                    break;

                                default:
                                    break;
                            }
                            break;
                        case 'Invoice Processing':
                            if (Ext.util.Format.trim(searchText) != '') {
                                // Origin/Distination(O/D)     
                                PgAtt.setSearchTextApplied(true);
                                if (searchText.length == 7) {
                                    vOrig = Ext.util.Format.substr(searchText.toUpperCase(), 1, 3)
                                    vDest = Ext.util.Format.substr(searchText.toUpperCase(), 5, 3)
                                    tableName = 'AppData.flote_main';
                                    whereClause = '[orig_tp] = ' + "'" + vOrig + "'" + ' and acctg_per_year =' + "'" + PgAtt.getYear() + "'";
                                    if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setOrigin(vOrig);
                                    }
                                    whereClause = '[dest_tp] = "' + "'" + vDest + "'" + ' and acctg_per_year =' + "'" + PgAtt.getYear() + "'";
                                    if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                        PgAtt.setDestination(vOrig);
                                    }
                                }

                                // receivedate
                                tableName = 'AppData.flote_main';
                                whereClause = 'rcvd_at_dt= ' + "'" + searchText + "'";
                                if (searchText.length > 7 && Date.parse(searchText, "mm/dd/yyyy") && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setRcvdAtDate(searchText);
                                }
                                //Shipment Number
                                tableName = 'AppData.flote_main';
                                whereClause = 'shpmnt_nbr =' + "'" + searchText + "'";
                                if (searchText.length == 10 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setShipment_number(searchText);
                                }
                                //mbl number
                                tableName = 'e2k.mbl_fact';
                                whereClause = 'mbl_busid =' + "'" + searchText + "'";
                                if (searchText.length == 14 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setMbl_number(searchText);
                                }
                                //Carrier Id                
                                whereClause = 'mbl_iata_busid = ' + "'" + searchText + "'";
                                if (searchText.length >= 10 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setCarrier_id(searchText);
                                }

                                //vendor english name,vednor code,vendor legal name, Ap_Remit_Id, Ap Vendor ID
                                tableName = 'AppData.vendor';
                                whereClause = 'vendor_code like ' + "'%" + searchText + "%'";
                                if (searchText.length > 5 && searchText.length < 8 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setVendor_code(searchText);
                                }
                                whereClause = 'AP_Vendor_Id like ' + "'%" + searchText + "%'";
                                if (searchText.length > 4 && searchText.length < 8 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setVendor_code(searchText);
                                }
                                whereClause = 'AP_Remit_Id like ' + "'%" + searchText + "%'";
                                if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setVendor_code(searchText);
                                }
                                //Container Number
                                tableName = 'e2k.Container_Fact';
                                whereClause = 'Container_BUSID=' + "'" + searchText + "'";
                                if (searchText.length == 11 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setContainer_number(searchText);
                                }
                                //Service Code
                                tableName = 'AppData.flote_main';
                                whereClause = 'service_code=' + "'" + searchText + "'" + 'and acctg_per_year =' + "'" + PgAtt.getYear() + "'";
                                if (searchText.length > 4 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setService_code(searchText);
                                }
                                //Country Code
                                tableName = 'e2k.COUNTRY_DIM';
                                whereClause = 'country_code = ' + "'" + searchText + "'" + '    or  country_name like ' + "'%" + searchText + "'";
                                if (me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setCountry_code(searchText);
                                }
                                tableName = 'dim.ChargeCodeMap';
                                whereClause = 'CHARGE_CODE = ' + "'" + searchText + "'" + '  or CHARGE_TYPE=' + "'" + searchText + "'";
                                if (searchText.length > 1 && searchText.length < 5 && me.isDataExits(tableName, whereClause, searchText) > 0) {
                                    PgAtt.setCharge_code(searchText);
                                }
                                if (searchText.length == 1 && (searchText == "M" || searchText == "L")) {
                                    PgAtt.setCost_type(searchText);
                                }

                                filter.getAttirbuteFieldValues();
                            } else {
                                PgAtt.setSearchTextApplied(false);
                            }
                            break;
                        default:
                            break;
                    }
                    filter.getAttirbuteFieldValues();
                    filter.down('#searchTextId').setValue('');
                }
            });
        }

    },
    isDataExits: function (table, whereClause, testValue) {
        var params = {
            Table: table,
            WhereClause: whereClause,
            TestValue: testValue
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/IsDataExists',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        if (result.responseText !== "null") {
            return result.testcount;
        }
        else {
            return 0;
        }

    }


});

