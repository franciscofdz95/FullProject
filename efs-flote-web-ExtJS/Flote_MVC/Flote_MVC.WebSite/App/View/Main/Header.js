Ext.define('App.View.Main.Header', {
    extend: 'BIA.container.Header',
    alias: 'widget.App-View-Main-Header',
    showMyReports: false,
    showOtherTools: true,
    showTimeout: true,
    applicationButtons: [
        {
            title: 'Sharepoint Links To All Flote Documents',
            itemId: 'RN1',
            icon: 'file-text-o',
            clickFunction: function () {
                var url = "https://upsinc.sharepoint.com/sites/Ocean_FLOTE/SitePages/Home.aspx";
                window.open(url, '_blank');
            }
        }
    ],
    constructor: function (config) {
        var me = this,
            configL = config || {};
        if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].securityLevel == 'Admin') {

            me.applicationButtons.push(
                {
                    title: 'Active Users',
                    itemId: 'btnActiveUsersId',
                    icon: 'user-plus',
                    clickFunction: function () {
                        var urlActive = window.location.href;
                        var newURL = urlActive.split("/");
                        var url = "https://" + newURL[2] + "/bia/apps/getCustomTag.cfm?AppName=" + BIACore.Security.User.permissions[PgAtt.getGeoIndex()].appCode;
                        window.open(url, "ActiveUser", "toolbar=no,width=600,height=400,directories=no,status=no,scrollbars=yes,resizable=yes,menubar=no,left=100,top=100");
                    }
                });

            me.applicationButtons.push(
                {
                    title: 'Msg Admin',
                    itemId: 'btnMsgAdminId',
                    icon: 'file-text',
                    clickFunction: function () {
                        me.fireEvent('headerbtnclick', "MsgAdmin");

                    }
                });

            me.applicationButtons.push(
                {
                    title: 'APUT Admin',
                    itemId: 'btnAputAdminId',
                    icon: 'user-md',
                    clickFunction: function () {
                        me.fireEvent('headerbtnclick', "AputAdmin");
                    }
                });
        }
        if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1) {
            me.applicationButtons.push(
                {
                    title: 'ValuePay Admin',
                    itemId: 'btnValPayAdminId',
                    icon: 'user-secret',
                    clickFunction: function () {
                        me.fireEvent('headerbtnclick', "ValPayAdmin");

                    }
                });

        }

        if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 2 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 4 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 7) {
            me.applicationButtons.push(
                {
                    title: 'APUT Files',
                    image: 'images/reports.png',
                    clickFunction: function () {                      
                        Ext.widget('App-View-Component-FTPFileNFolder-FTPWindow').show();
                    }
                });
        }

        if (BIACore.Security.User.permissions[0].RoleId == 'Admin' || BIACore.Security.User.permissions[0].RoleId == 'SA') {
            me.applicationButtons.push(
                {
                    title: 'EA Permissions',
                    image: 'images/tooloptions.gif',
                    clickFunction: function () { Ext.widget('App-View-Component-UserAccess-UserAccessDefinition').show(); }
                });
        }
        me.callParent([configL]);

    }
});