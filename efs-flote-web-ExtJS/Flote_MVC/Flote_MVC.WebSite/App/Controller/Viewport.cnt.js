/* ====================================================================================================
NAME:			[View port Controller]
BEHAVIOR:		Shows view port component initialization Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
05/12/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Viewport', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Viewport' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-Viewport': {
                beforerender: this.ViewportBeforeRender
            },
            'App-View-Main-TabPanel': {
                beforetabchange: this.cardSwitchTab,
                beforerender: this.TabPanelBeforeRender
            }

        });
    },
    ViewportBeforeRender: function ViewportBeforeRender(me) {
        PgAtt.setDisplay_currency(me.down('#filDisplayCurr combobox').getValue());
        var geoCode, geoId, userId = '',
            geoIndex = !Ext.isEmpty(Ext.util.Cookies.get("geoIndex")) ? Ext.util.Cookies.get("geoIndex") : PgAtt.getGeoIndex();
        PgAtt.setGeoIndex(parseInt(geoIndex));
        geoCode = BIACore.Security.User.permissions[geoIndex].geoCode;
        geoId = BIACore.Security.User.permissions[geoIndex].geoId;
        userId = BIACore.Security.User.permissions[geoIndex].userId;
        PgAtt.setUserId(userId);
        PgAtt.setGeoCode(geoCode);
        PgAtt.setGeoId(geoId);
        PgAtt.getSecurity(geoCode, geoId);
        var pA = {};
        pA = PgAtt.getConfig();
        var userPrefKeyList = PgAtt.getUserPrefKeyList().split(",");
        for (var k = 0; k < userPrefKeyList.length; k++) {
            var data = PgAtt.getUserPreference(userId, userPrefKeyList[k], PgAtt.getControllerPage())
            if (data !== null) {
                if (userPrefKeyList[k].toLowerCase() != data.key.toLowerCase() && data.value != null) {
                    PgAtt.setUserPreference(userId, data.key, PgAtt.getControllerPage(), data.value)
                }
                else {
                    var fieldName = data.key.toLowerCase();
                    var attr = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                    var str = 'PgAtt.set' + attr + '(' + '"' + data.value.toUpperCase() + '"' + ')';
                    if (pA.hasOwnProperty(data.key.toLowerCase())) { eval(str); }
                }
            }
        }

        me.down('#FilterFieldsId').getAttirbuteFieldValues();
        if (PgAtt.getLocation_code() != '') {
            PgAtt.getValidLocation();
        }
    },
    cardSwitchTab: function (tabPanel, newTab, oldTab, index) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        newTab.previousTab = oldTab.tab.text;
        if (oldTab.tab.text == "Invoice Processing") {
            IProcessingSCls.resetFilterPopFilter(filter);
            tabPanel.down('#InvoiceProcessingId').setDisabled(true);
        }

        if (oldTab.tab.text == "Vendor Statement Summary") {
            if (newTab.tab.text != "Invoice Processing") {
                IProcessingSCls.resetFilterPopFilter(filter);
            }
            tabPanel.down('#appCbolSumId').setDisabled(true);
        }

    },
    TabPanelBeforeRender: function TabPanelBeforeRender(tab) {
        var timeThis = this;
        $(document).ready(function () {
            setInterval(timeThis.AdminMessageWarning, 60000);
        })

    },
    AdminMessageWarning: function AdminMessageWarning(me) {
        var userId = BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId
        var adminVal = HSCls.getMessageAdmin();
        var userVal = HSCls.isReadByUser(userId);
        if (adminVal.Required_Reading && (userVal.Message_ID !== adminVal.ID && userVal.Message_ID != '')) {
            var msg = 'There is a critical communication message from the FLOTE \'Home \'page.\nPlease confirm that you have read this message.';
            Ext.MessageBox.show({
                msg: msg,
                buttons: Ext.MessageBox.OKCANCEL,
                icon: Ext.MessageBox.WARNING,
                closable: false,
                fn: function (btn) {
                    if (btn == 'ok') {
                        var tabPanel = Ext.ComponentQuery.query('#tabPanelId')[0];
                        tabPanel.setActiveTab(0);
                        HSCls.updateAdminMessageByUser(adminVal.ID, userId);
                    }
                }
            });

        }
    }
});