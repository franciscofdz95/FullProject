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
Ext.define('App.Controller.Home.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-Home-ValPayAdmin-ValPayAdminGrid ': {
                btnValAdminLocUpdate: this.UpdateValPayLocation
            },
            'App-View-Home-Report #btnHomeScreenId': {
                click: this.HomeScreenBtn
            },
            'App-View-Home-Report': {
                beforerender: this.ReportTabBeforeRender
            },
            'App-View-Home-MsgAdmin-MessageAdminContainer #btnMsgAdminClearId': {
                click: this.ClearingMessage
            },
            'App-View-Home-MsgAdmin-MessageAdminContainer #btnMsgAdminUpdateId': {
                click: this.UpdateAdminMessage
            },
            'App-View-Main-Header': {
                headerbtnclick: this.HeaderButtonClick,
                beforerender: this.HeaderBeforeRender,
                afterrender: this.HeaderAfterRender
            },
            'App-View-Home-AputAdmin-Container #btnAddUser': {
                click: this.AddAputUser
            },
            'App-View-Home-APUTAdmin-AputUserGrid': {
                selectionchange: this.SelectChangeAddAput,
                addcompanycodes: this.AddCompanyCodes
            },
            'App-View-Home-APUTAdmin-CompanyCodesGrid': {
                removecompanycodes: this.RemoveCompanyCodes
            },
            'App-View-Home-ChangePermission-CPWindow #CPCloseBtn': {
                click: this.CloseCPWindow
            },
            'App-View-Home-ChangePermission-CPWindow displayfield': {
                focusenter: this.OnDisplayFieldFocusEnter,
                focusleave: this.OnDisplayFieldFocusLeave,
                afterrender: this.DisplayFieldAfterRender
            }
        });
    },
    UpdateValPayLocation: function UpdateValPayLocation(record) {
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        var params = {
            LocCode: Ext.util.Format.trim(record.get('req_location')),
            ValuePayLoc: Ext.util.Format.trim(record.get('value_pay_location').toUpperCase()),
            InvoiceTypeCode: Ext.util.Format.trim(record.get('invoice_type_code'))
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/GetValuePayUpdateAction',
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
                tabPanel.down('#valPayAdminLbl').setText('Value Pay Locations Admin');
                if (tabPanel.activeTab.tab.text != 'Home') {
                    tabPanel.setActiveTab(0);
                }
                tabPanel.down('#homeDateContainerId').setVisible(false);
                tabPanel.down('#adminMessage2').setVisible(false);
                tabPanel.down('#homeValPayAdminLocation').setVisible(false);
                tabPanel.down('#valPayAdminLocComboId').setVisible(true);
                tabPanel.down('#msgLocUpdateId').setVisible(true);

            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    },
    HomeScreenBtn: function HomeScreenBtn(me) {
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }

        tabPanel.down('#homeDateContainerId').setVisible(true);
        tabPanel.down('#adminMessage2').setVisible(true);
        tabPanel.down('#homeValPayAdminLocation').setVisible(false);
        tabPanel.down('#valPayAdminLocComboId').setVisible(false);
        tabPanel.down('#msgLocUpdateId').setVisible(false);
        tabPanel.down('#valPayAdminLbl').setVisible(false);
        tabPanel.down('#homeMsgAdminId').setVisible(false);
        tabPanel.down('#homeAputAdminId').setVisible(false);
        tabPanel.down('#btnHomeScreenMsgId').setVisible(false);

    },
    ReportTabBeforeRender: function ReportTabBeforeRender() {
        HSCls.getListCompanyCodes();
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        // Changed Error Message wehn Home Page Loads by Sriram
        if (localStorage) { localStorage.setItem('pageName', 'Home'); }

        var grid = tabPanel.down('#homeAputAdminId').down('grid');
        grid.getStore().load();

        BIA.Ajax.request({
            url: 'api/WebAPIReport/GetLastUpdated',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: '',
            useDefaultXhrHeader: true,
            success: function (conn, response, options, eOpts) {
                var data = Ext.decode(conn.responseText);
                if (data !== null) {
                    tabPanel.down('#e2kUpdDateTime').setText('E2K Update Date and Time:' + data.fLastUpdated);
                    tabPanel.down('#venLstUpdated').setText('Vendor table last updated on:' + data.vLastUpdated)
                }
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        var val = HSCls.getMessageAdmin();
        if (val != null && Ext.isObject(val) && val != undefined) {
            tabPanel.down('#adminMessage2').setHtml(val.Message);
            tabPanel.down('#msgAdminTextAreaId').setValue(val.Message);
        }

    },
    ClearingMessage: function ClearingMessage(me) {
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        tabPanel.down('#msgAdminTextAreaId').setValue('');
        this.InsertUpdateAdminMessage('', tabPanel.down('#chkRequiredMsgFlag').getValue());
        this.HomeScreenBtn(tabPanel.down('#btnHomeScreenMsgId'));
        tabPanel.down('#homeMsgAdminId').setVisible(false);
        this.ReportTabBeforeRender();
    },
    UpdateAdminMessage: function UpdateAdminMessage(me) {
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        this.InsertUpdateAdminMessage(tabPanel.down('#msgAdminTextAreaId').getValue(), tabPanel.down('#chkRequiredMsgFlag').getValue());
        this.HomeScreenBtn(tabPanel.down('#btnHomeScreenMsgId'));
        tabPanel.down('#homeMsgAdminId').setVisible(false);
        this.ReportTabBeforeRender();
    },
    InsertUpdateAdminMessage: function InsertUpdateAdminMessage(adminMsg, rFlag) {
        var rFlagBit = 0
        if (rFlag) {
            rFlagBit = 1;
        }
        var params = {
            AdminMsg: adminMsg,
            RequiredFlag: rFlagBit
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/UpdateAdminMessage',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

    },
    HeaderButtonClick: function HeaderButtonClick(btnName) {
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        if (tabPanel.activeTab.tab.text != 'Home') {
            tabPanel.setActiveTab(0);
        }
        tabPanel.down('#btnHomeScreenMsgId').setVisible(true);
        tabPanel.down('#homeDateContainerId').setVisible(false);
        tabPanel.down('#adminMessage2').setVisible(false);
        tabPanel.down('#homeValPayAdminContainer').setVisible(false);
        tabPanel.down('#homeValPayAdminLocation').setVisible(false);
        tabPanel.down('#valPayAdminLocComboId').setVisible(false);
        tabPanel.down('#homeMsgAdminId').setVisible(false);
        tabPanel.down('#homeValPayAdminLocation').setVisible(false);
        tabPanel.down('#homeAputAdminId').setVisible(false);
        if (btnName == "MsgAdmin") {
            tabPanel.down('#homeMsgAdminId').setVisible(true);
        } else if (btnName == "ValPayAdmin") {
            tabPanel.down('#homeValPayAdminContainer').setVisible(true);
            tabPanel.down('#valPayAdminLocComboId').setVisible(true);
            tabPanel.down('#valPayAdminLbl').setText('Value Pay Locations Admin');
        }
        else if (btnName == "AputAdmin") {
            HSCls.getListCompanyCodes();
            tabPanel.down('#homeAputAdminId').setVisible(true);
        }
    },
    AddAputUser: function AddAputUser() {
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        var userId = tabPanel.down('#aputUserListId clearCombo').getValue();
        var cmpCode = tabPanel.down('#cmpCodesListId combobox').getValue();
        if (userId != '' && cmpCode != '') {
            var params = {
                UserId: userId,
                CompanyCode: cmpCode
            };
            BIA.Ajax.request({
                url: 'api/WebAPIReport/AddAputUser',
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
                    this.RefreshGridData(userId);
                },
                failure: function () {
                    BIACore.Exception(conn.responseText);
                    BIACore.Message(response);
                },
                scope: this
            });
        }
    },
    SelectChangeAddAput: function SelectChangeAddAput(me, selected, eOpts) {
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        if (selected.length) {
            var cmpCodeGrid = tabPanel.down('App-View-Home-APUTAdmin-CompanyCodesGrid');
            cmpCodeGrid.setVisible(true);
            var store = cmpCodeGrid.getStore();
            store.getProxy().extraParams.UserId = selected[0].get('sysm');
            store.load();
        }
    },
    AddCompanyCodes: function AddCompanyCodes(userId, cmpCode) {
        var params = {
            UserId: userId,
            CompanyCode: cmpCode
        };
        if (userId != '' && cmpCode != '') {
            BIA.Ajax.request({
                url: 'api/WebAPIReport/AddAputUser',
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
                    this.RefreshGridData(userId);
                },
                failure: function () {
                    BIACore.Exception(conn.responseText);
                    BIACore.Message(response);
                },
                scope: this
            });
        }
    },
    RemoveCompanyCodes: function RemoveCompanyCodes(userId, cmpCode) {
        if (userId != '' && cmpCode != '') {
            var params = {
                UserId: userId,
                CompanyCode: cmpCode
            };
            BIA.Ajax.request({
                url: 'api/WebAPIReport/RemoveAputUser',
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
                    this.RefreshGridData(userId);
                },
                failure: function () {
                    BIACore.Exception(conn.responseText);
                    BIACore.Message(response);
                },
                scope: this
            });
        }
    },
    RefreshGridData: function RefreshGridData(userId) {
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }

        if (userId) {
            var cmpCodeGrid = tabPanel.down('App-View-Home-APUTAdmin-CompanyCodesGrid');
            cmpCodeGrid.setVisible(true);
            var store = cmpCodeGrid.getStore();
            store.getProxy().extraParams.UserId = userId;
            store.load();
        }

        var aputUserGrid = tabPanel.down('App-View-Home-APUTAdmin-AputUserGrid');
        var storeAput = aputUserGrid.getStore();
        storeAput.load();
    },
    HeaderBeforeRender: function HeaderBeforeRender(item) {
        var me = this;
        if (BIACore.Security.User.permissions.length > 1) {
            item.applicationButtons.push(
                {
                    xtype: 'button',
                    title: 'Change Permissions (Geo/SR)',
                    itemId: 'btnChangePermission',
                    icon: 'users',
                    clickFunction: function () {
                        me.ShowUsersPermissions();
                    }
                }
            );
        }
    },
    HeaderAfterRender: function HeaderAfterRender(item) {
        var me = this;
        if (BIACore.$('#BH_Button_Logout')) BIACore.$('#BH_Button_Logout').click(me.LogoutFunction);
    },
    LogoutFunction: function LogoutFunction() {
        BIACore.Cookie.set({
            name: "geoIndex",
            value: '',
            expires: BIACore.Date.add(new Date(), BIACore.Date.DAY, -30)
        });
    },
    ShowUsersPermissions: function ShowUsersPermissions() {
        var me = this,
            win = Ext.widget('App-View-Home-ChangePermission-CPWindow');
        Ext.each(BIACore.Security.User.permissions, function (item, index) {
            var prefix = '>> ',
                value = prefix + BIACore.Security.User.firstName + ' ' + BIACore.Security.User.lastName + ' - ' + me.GetBusinessUnit(item.businessUnitId) + ' - ' + me.GetCodeDescription(item.geoCode, item.geoId, item.sr_type);
            if (PgAtt.getGeoIndex() === index) {
                value = '<b>' + value + '</b>';
            }
            win.add({
                xtype: 'displayfield',
                itemNum: index,
                value: value
            });
        });
        win.show();
    },
    CloseCPWindow: function CloseCPWindow(btn) {
        btn.up('window').close();
    },
    OnDisplayFieldFocusEnter: function OnDisplayFieldFocusEnter(field) {
        field.setStyle({ textDecoration: 'underline', cursor: 'pointer' });
    },
    OnDisplayFieldFocusLeave: function OnDisplayFieldFocusLeave(field) {
        field.setStyle({ textDecoration: 'none', cursor: 'default' });
    },
    DisplayFieldAfterRender: function DisplayFieldAfterRender(field) {
        var me = this;
        field.getEl().on('click', function () {
            if (Ext.isDefined(field.itemNum)) me.SetPermissions(field);
        });
        field.getEl().on('mouseenter', function () {
            if (Ext.isDefined(field.itemNum)) me.OnDisplayFieldFocusEnter(field);
        });
        field.getEl().on('mouseout', function () {
            if (Ext.isDefined(field.itemNum)) me.OnDisplayFieldFocusLeave(field);
        });
    },
    SetPermissions: function SetPermissions(field) {
        Ext.util.Cookies.set("geoIndex", field.itemNum);
        window.location.reload();
    },
    GetBusinessUnit: function GetBusinessUnit(busUnit) {
        if (busUnit == '01') { return 'Small Pkg'; }
        if (busUnit == '02') { return '?'; }
        if (busUnit == '03') { return 'Trade Direct'; }
        if (busUnit == '04') { return 'Customer Solutions'; }
        if (busUnit == '05') { return 'SCS'; }
        if (busUnit == '06') { return 'Freight'; }
    },
    GetCodeDescription: function GetCodeDescription(geo, geoId, sr_type) {
        var result = '';
        if (geo == 'CO') { return 'CORPORATE'; }
        else if (geo == 'RR') { return 'REGION: ' + geoId; }
        else if (geo == 'DD') { return 'DISTRICT: ' + geoId; }
        else if (geo == 'CN') { return 'COUNTRY: ' + geoId; }
        else if (geo == 'LN') { return 'LOCATION: ' + geoId; }
        else if (geo == 'CR') { return 'CENTER: ' + geoId; }
        else if (geo == 'IS') { return 'INSIDE SALES'; }
        else if (geo == 'SR') {
            if (sr_type == 'AE') return 'Account Executive';
            if (sr_type == 'AM') return 'Area Sales Manager';
            if (sr_type == 'DS') return 'Director of Sales';
            if (sr_type == 'JG') return 'J Type Virtual ASM';
            if (sr_type == 'JQ') return 'J Type Virtual S. Director';
            if (sr_type == 'JM') return 'J Type Virtual S. Manager';
            if (sr_type == 'MD') return 'Global Managing Director';
            if (sr_type == 'NG') return 'Enterprise Sales Director';
            if (sr_type == 'NM') return 'Enterprise Accounts Manager';
            if (sr_type == 'QD') return 'Enterprise Zone Manager';
            if (sr_type == 'SD') return 'Global Senior Director';
            if (sr_type == 'SM') return 'Segment Manager';
            if (sr_type == 'SS') return 'Sales Supervisor';
            if (sr_type == 'TL') return 'Team Lead';
            if (sr_type == 'VP') return 'Global Senior VP';
            if (sr_type == 'ZM') return 'Enterprise Zone Coordinator';
            return 'Account Executive';
        }
        return result;
    }
});