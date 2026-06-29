/* ====================================================================================================
NAME:			[Page Attributes]
BEHAVIOR:		Session attributes for flote application.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Contoller.PgAtt', {
    alias: 'widget.PageAttributes',
    alternateClassName: ['PgAtt'],
    singleton: true,
    session: true,
    config: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        vendor_id: '',
        vendor_code: '',
        vendor_location: '',
        currency_code: '',
        service_code: 'All',
        company_code: '',
        charge_code: '',
        charge_status: 'All',
        invoice_status: '',
        OD: 'All',
        origin: '',
        destination: '',
        rcvdAtDate: '',
        shipment_number: '',
        mbl_number: '',
        mbl_cost_basis: 'All',
        invoice_id: '0',
        invRefNo: '',
        invBatchID: '',
        location_code: '',
        location_type: '',
        country_code: '',
        region_code: '',
        district_code: '',
        display_currency: 'USD',
        currency_list: 'USD,EUR,CNY',
        container_number: '',
        carrier_id: '',
        display_locationtype: 'cost location',
        locationtype_list: 'Cost Location,Service Center,Entry Performed Location',
        cost_type: 'All',
        accrual_flag: 'All',
        man_Diff: '0',
        loc_Diff: '0',
        tot_Diff: '0',
        startDateFilter: '',
        endDateFilter: '',
        modifiedBy: '',
        invoiceReferenceName: '1',
        upsRefType: '',
        referenceFilter: 'N',
        controllerPage: 'Home',
        imageNumber: '',
        statusCBOL: 'All',
        cInvoice_id: '0',
        rdoType: 'ByCarrierBol',
        isSelCharges: 'N',
        containers: '',
        e2k_Carrier_Code: '',
        vendor_Name_English: '',
        vendor_Legal_Name: '',
        mbl_iata_busid: '',
        InvoiceTypeName: '0',
        userPrefKeyList: 'SortBy,SortDir,display_currency,location_code',
        msgEmptyDataFlag: true,
        msgEmptyDataCustom: '',
        incompleteInvoice: '0',
        userId: '',
        geoCode: '',
        geoId: '',
        popupReferenceFilter: '',
        invoiceCID: 'USD',
        filterParams: null,
        isDev: true,
        searchTextApplied: false,
        invRecFlag: false,
        processBtn: false,
        filterGoFlag: false,
        billsStoreCounter: 0,
        cbolTabNo: 2,
        geoIndex: 0,
        Reason: '',
        OriginTp: '',
        DestTp: '',
        OriginCc: '',
        DestCc: '',
        EPADest: '',
        EPAOrig: '',
        LocCountry: '',
        LocRegion: '',
        RegionOrig: '',
        RegionDest: '',
        DivisionOrig: '',
        DivisionDest: '',
        MblNbrFlag: '',
        ServiceLevel: '',
        VendorName: '',
        StartPeriod: '',
        EndPeriod: '',
        scanDest: 'All',
        paidStatus: 'Paid'
    },
    constructor: function (options) {
        this.initConfig(options);
    },
    listeners: {
        afterrender: function () {
            var me = this;
            me.setCurrTab(me.getTabCount());
        }
    },
    getTabCount: function () {
        var pageName = 'Home'
        if (localStorage) { pageName = localStorage.getItem('pageName'); }
        if (pageName == '') {
            pageName = PgAtt.getControllerPage();
        }

        var tabNbr = 0;

        if (pageName) {
            switch (pageName) {
                case 'locationshipment':
                    tabNbr = 1;
                    break;
                case 'locationmasterbill':
                    tabNbr = 2;
                    break;
                case 'bills':
                    tabNbr = 3;
                    break;
                case 'locationvendor':
                    tabNbr = 4;
                    break;
                case 'vendorshipment':
                    tabNbr = 5;
                    break;
                case 'vendorlist':
                    tabNbr = 6;
                    break;
                case 'accrualMonJEntry':
                    tabNbr = 7;
                    break;
                case 'accrualDetail':
                    tabNbr = 7;
                    break;
                case 'accrualaccuracy':
                    tabNbr = 7;
                    break;
                default:
                    break;
            }
        }
        return tabNbr;

    },
    getBillTabCount: function () {
        var invoiceStatus = 'SCANNED'
        if (PgAtt.getInvoice_status() != '') { invoiceStatus = PgAtt.getInvoice_status().toUpperCase(); }

        var tabNbr = 0;

        if (invoiceStatus) {
            switch (invoiceStatus) {
                case 'PENDING':
                    tabNbr = 1;
                    break;
                case 'VERIFIED':
                    tabNbr = 2;
                    break;
                case 'APPROVED':
                    tabNbr = 3;
                    break;
                case 'PRINTED':
                    tabNbr = 4;
                    break;
                case 'SCANNED':
                    tabNbr = 5;
                    break;
                case 'QUEUED':
                    tabNbr = 6;
                    break;
                case 'SENT':
                    tabNbr = 7;
                    break;
                case 'ARCHIVED':
                    tabNbr = 8;
                    break;
                case 'Payment Details':
                    tabNbr = 9;
                    break;
                default:
                    tabNbr = 5;
                    break;
            }
        }
        return tabNbr;

    },
    getGridCustomMsg: function (pageName) {
        var msgEmptyDataFlag = true;
        var msgEmptyDataCustom = '';
        if (pageName) {
            switch (pageName) {
                case 'Location Shipment':
                    if (PgAtt.getLocation_code() == '' && PgAtt.getCountry_code() == '' && PgAtt.getContainer_number() == '' && PgAtt.getShipment_number() == '' && PgAtt.getMbl_number() == '' && (PgAtt.getRcvdAtDate() == null || PgAtt.getRcvdAtDate() == '')) {
                        msgEmptyDataFlag = false;
                        msgEmptyDataCustom = 'No Matches Found or Data Set to Large! <BR> You must include at least one of these filters: Location Code, Country Code, Container Number, Shipment Number, MBL Number, or Recieved At Date';
                    }
                    break;
                case 'Location Ocean MBL':
                    if (PgAtt.getLocation_code() == '' && PgAtt.getCountry_code() == '' && PgAtt.getContainer_number() == '' && PgAtt.getShipment_number() == '' && PgAtt.getMbl_number() == '' && (PgAtt.getRcvdAtDate() == null || PgAtt.getRcvdAtDate() == '')) {
                        msgEmptyDataFlag = false;
                        msgEmptyDataCustom = 'No Matches Found or Data Set to Large! <BR> You must include at least one of these filters: Location Code, Country Code, Container Number, Shipment Number, MBL Number, or Recieved At Date';
                    }
                    break;
                case 'Bills':
                    if (PgAtt.getLocation_code() == '' && PgAtt.getCompany_code() == '' && PgAtt.getInvoice_id() == '0' && (PgAtt.getInvRefNo() == '' || PgAtt.getInvRefNo() == null)) {
                        msgEmptyDataFlag = false;
                        msgEmptyDataCustom = 'No Matches Found or Data Set to Large! <BR> You must include at least one of these filters: Location Code, Company Code, Invoice ID, or Invoice Refrence Number. ';
                    }
                    break;
                case 'Location Vendor':
                    if (PgAtt.getLocation_code() == '') {
                        msgEmptyDataFlag = false;
                        msgEmptyDataCustom = 'No Matches Found or Data Set to Large! <BR> You must include at least one of these filters: Location Code ';
                    }
                    break;
                case 'Vendor Shipment':
                    if (PgAtt.getLocation_code() == '' && PgAtt.getCountry_code() == '' && PgAtt.getContainer_number() == '' && PgAtt.getShipment_number() == '' && PgAtt.getMbl_number() == '' && (PgAtt.getRcvdAtDate() == null || PgAtt.getRcvdAtDate() == '')) {
                        msgEmptyDataFlag = false;
                        msgEmptyDataCustom = 'No Matches Found or Data Set to Large! <BR> You must include at least one of these filters: Location Code, Country Code, Container Number, Shipment Number, MBL Number, or Recieved At Date ';
                    }
                    break;
                case 'Vendors':
                    if (PgAtt.getLocation_code() == '' && PgAtt.getCountry_code() == '' && PgAtt.getVendor_code() == '' && PgAtt.getCompany_code() == '' && PgAtt.getVendor_Name_English() == '') {
                        msgEmptyDataFlag = false;
                        msgEmptyDataCustom = 'No Matches Found or Data Set to Large! <BR> You must include at least one of these filters: Location Code, Country Code, Company Code, Vendor Code, Vendor Name, AP Vendor ID ';
                    }
                    break;
                case 'Accruals':
                    if (PgAtt.getLocation_code() == '' && PgAtt.getCountry_code() == '' && PgAtt.getCompany_code() == '') {
                        msgEmptyDataFlag = false;
                        msgEmptyDataCustom = 'No Matches Found or Data Set to Large! <BR> You must include at least one of these filters: Location Code, Company Code or Country Code ';
                    }
                    break;
                case 'Accrual Monthly Journal Entry':
                    if (PgAtt.getLocation_code() == '' && PgAtt.getCountry_code() == '' && PgAtt.getCompany_code() == '') {
                        msgEmptyDataFlag = false;
                        msgEmptyDataCustom = 'No Matches Found or Data Set to Large! <BR> You must include at least one of these filters: Location Code, Company Code or Country Code ';
                    }
                    break;
                case 'Accrual Monthly Details':
                    if (PgAtt.getLocation_code() == '' && PgAtt.getCountry_code() == '' && PgAtt.getCompany_code() == '' && PgAtt.getShipment_number() == '') {
                        msgEmptyDataFlag = false;
                        msgEmptyDataCustom = 'No Matches Found or Data Set to Large! <BR> You must include at least one of these filters: Location Code, Company Code, Country Code, or Shipment Number';
                    }
                    break;
                case 'Payment Details':
                    if (PgAtt.getLocation_code() == '' && PgAtt.getCompany_code() == '' && (PgAtt.getPaidStatus() == '' || PgAtt.getInvoice_id() == '0' || PgAtt.getInvRefNo() == '' || PgAtt.getInvRefNo() == null)) {
                        msgEmptyDataFlag = false;
                        msgEmptyDataCustom = 'No Matches Found or Data Set to Large! <BR> You must include at least one of these filters: Location Code, Company Code, and (Paid status or Invoice ID, or Invoice Refrence Number or Date). ';
                    }
                    break;
                case 'Accrual Accuracy Report':
                    break;
                default:
                    break;
            }
        }
        PgAtt.setMsgEmptyDataFlag(msgEmptyDataFlag);
        PgAtt.setMsgEmptyDataCustom(msgEmptyDataCustom);
    },
    getApproveInvCountByWeek: function (label) {
        var locCode = PgAtt.getLocation_code(),
            cmpCode = PgAtt.getCompany_code(),
            year = PgAtt.getYear(),
            appInvCount = 0,
            params = {
                LocCode: locCode,
                CompanyCode: cmpCode,
                AcctYear: year
            };

        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetApproveInvCountByWeek',
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
        if (Ext.isDefined(result.responseJSON)) {
            if (result.responseJSON.length > 0) {
                appInvCount = result[0].totcount;
            }
        }
        label.setText('INCOMPLETE Invoices (' + appInvCount + ')');
        label.getEl().frame('#EC0419', 5, { duration: label.animationDuration * 5 });
        PgAtt.setIncompleteInvoice(appInvCount);
        return appInvCount
    },
    enableDisbaleTab: function () {
        var result = false;
        if (PgAtt.getMonth() == 'All') {
            result = true;
        }
        return result
    },
    getCurrencyCodes: function (locCode, combo) {
        if (locCode == '') {
            locCode = PgAtt.getLocation_code()
        }
        var params = {
            query: locCode + ',' + PgAtt.getCountry_code()
        };
        BIA.Ajax.request({
            url: 'api/WebAPIFilter/DisplayCurrency',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (conn, response, options, eOpts) {
                var data = Ext.decode(conn.responseText);
                var userId = BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId;
                var userprfcedata = PgAtt.getUserPreference(userId, "display_currency", PgAtt.getControllerPage());
                combo.clearValue();
                var dataVal = [];
                var count = 0;
                for (var i = 0; data.length > i; i++) {
                    dataVal.push(data[i]);
                    if (data[i].currency_code == userprfcedata.value) {
                        count = i;
                    }
                    if (data[i].defaultCurrency == 1 && count == 0) {
                        count = i;
                    }
                }
                combo.store.loadData(dataVal, true);
                combo.valueField = 'currency_code';
                combo.displayField = 'currency_code';
                combo.setValue(dataVal[count].currency_code);
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

    },
    getSecurity: function (geoCode, geoId) {
        var params = {
            GeoCode: geoCode,
            GeoId: geoId
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/GetSecurity',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (conn, response, options, eOpts) {
                var data = Ext.decode(conn.responseText);
                if (data !== null) {
                    if (data.level == 'Region_code') { PgAtt.setRegion_code(data.value); }
                    if (data.level == 'District_code') { PgAtt.setDistrict_code(data.value); }
                    if (data.level == 'Country_code') { PgAtt.setCountry_code(data.value); }
                    if (data.level == 'Location_code') { PgAtt.setLocation_code(data.value); }
                }

            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    },
    getUserPreference: function (userId, key, page) {
        var params = {
            UserId: userId,
            Key: key,
            Page: page
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetUserPreference',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (response, options) {
                return response.responseText;
            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        return Ext.decode(result.responseText);
    },
    setUserPreference: function (userId, key, page, keyVal) {
        var params = {
            UserId: userId,
            Key: key,
            Page: page,
            KeyVal: keyVal
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/SetUserPreference',
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
    },
    setServerType: function (serverName) {
        var domainList = ['bia.', 'BIA-A.', 'BIA-B.', 'BIA-C.', 'BIA-D.'];
        for (var i = domainList.length - 1; i >= 0; --i) {
            if (serverName.toLowerCase().indexOf(domainList[i].toLowerCase()) != -1) {
                PgAtt.setIsDev(false);
            }
        }
    },
    getValidLocation: function () {

        var params = {
            query: PgAtt.getGeoCode() + ',' + PgAtt.getGeoId() + ',' + PgAtt.getLocation_code()
        };
        BIA.Ajax.request({
            url: 'api/WebAPIFilter/LocationCode',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (conn, response, options, eOpts) {
                var data = Ext.decode(conn.responseText);
                if (data == null || data.data.length == 0) {
                    PgAtt.setLocation_code('');
                }
            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    }


});