/* ====================================================================================================
NAME:			[Home Singleton Class]
BEHAVIOR:		Home related method and variables.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
04/27/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Contoller.Home.HomeSingleTonCls', {
    alias: 'widget.HomeSingleTonCls',
    alternateClassName: ['HSCls'],
    singleton: true,
    session: true,
    config: {
        companyCodeList: ''
    },
    getListCompanyCodes: function getListCompanyCodes() {

        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetCompanyCodesAll',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: '',
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        HSCls.setCompanyCodeList(result.responseJSON);

    },
    homeScreenRenderer: function homeScreenRenderer(value, metaData, record, row, col, store, gridView) {
        if (this.$className == "App.View.Home.APUTAdmin.AputUserGrid") {
            metaData.style = "text-decoration: underline;cursor: pointer";
            return record.get('l_name') + ' , ' + record.get('f_name') + '(' + record.get('sysm') + ')';
        } else {
            return record.get('ORA_Company') + '(' + record.get('SHORT_DESCRIPTION') + ')';
        }
    },
    getMessageAdmin: function getMessageAdmin() {

        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetAdminMessage',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: '',
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        return result.responseJSON;
    },
    updateAdminMessageByUser: function updateAdminMessageByUser(msgId, userId) {
        var params = {
            MessageId: msgId,
            UserId: userId
        }
        BIA.Ajax.request({
            url: 'api/WebAPIReport/UpdateAdminMessageByUser',
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
    isReadByUser: function isReadByUser(userId) {
        var params = {
            UserId: userId
        }
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/IsReadByUser',
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

        return result.responseJSON;
    }
});