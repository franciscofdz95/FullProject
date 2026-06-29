Ext.define('App.Utility.ConnectionSecurity', {
    singelton: true
}, function (me) {
    let currentUserRoles = [];

    BIA.Ajax.request({
        url: 'api/BIASecurity/UserRoles',
        async: false,
        method: 'POST',
        callback: function callback(request, success, response) {
            currentUserRoles = response.responseJSON.Roles;
        },
        scope: me
    });

    //Added this BIACore.onReady to verify session info was available prior to below functions being applied.
    BIACore.onReady(function () {
        console.log(BIACore.Security.User.isSA());
    });

    Ext.apply(me, {
        getRoleByCode: function getRoleByCode(roleCode, roleGroup) {
            if (currentUserRoles) {
                return Ext.Array.findBy(currentUserRoles, function (r) {
                    return r.RoleCode === roleCode && (Ext.isEmpty(roleGroup) || r.RoleGroup === roleGroup);
                });
            } else return "";
        },
        getRoleByName: function getRoleByName(roleName, roleGroup) {
            return Ext.Array.findBy(currentUserRoles, function (r) {
                return r.RoleName === roleName && (Ext.isEmpty(roleGroup) || r.RoleGroup === roleGroup);
            });
        },
        isConnectionAdmin: function isConnectionAdmin() {
            return BIACore.Security.User.isSA() || (BIACore.Security.User.permissions.length != 0 && BIACore.Security.User.permissions[0].securityLevel == 'SA');
            //|| App.Utility.ConnectionSecurity.getRoleByCode("ConnAdmin", "App") != null;
        },
        isBIAAppDevMgr: function isBIAAppDevMgr() {
            return BIACore.Security.User.isSA() || (BIACore.Security.User.permissions.length != 0 && BIACore.Security.User.permissions[0].securityLevel == 'SA');
            //|| App.Utility.ConnectionSecurity.isConnectionAdmin() || App.Utility.ConnectionSecurity.getRoleByCode("AppDevMgr", "Dept") != null;
        },
        isBIADeveloper: function isBIADeveloper() {
            return BIACore.Security.User.isSA() || (BIACore.Security.User.permissions.length != 0 && BIACore.Security.User.permissions[0].securityLevel == 'SA');
            //|| App.Utility.ConnectionSecurity.isBIAAppDevMgr() || App.Utility.ConnectionSecurity.getRoleByCode("AppDeveloper", "Dept") != null;
        }
    });

    
});