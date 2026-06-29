using System;
using System.Collections.Generic;
using System.Data;
using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Model;

namespace BIASecurity.WebAPI
{
    public class Role
    {

        public int RoleId { get; set; }
        public string RoleCode { get; set; }
        public string RoleName { get; set; }
        public string RoleGroup { get; set; }

        public Role() { }
    }
    public class User
    {
        public int UserId { get; set; }
        public string ADID { get; set; }
        public string LoginId { get; set; }
        public string Email { get; set; }
        public string PreferredName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string sysm { get; set; }
        public string JobLevel { get; set; }
        public string Department { get; set; }
        public string BusinessUnitId { get; set; }


    }
    static class CurrentUser
    {
        private const string USER = "BIASecurity.CurrentUser.User";
        private const string ROLES = "BIASecurity.CurrentUser.Roles";
        public static int UserId { get { return UserObj.UserId; } }

        public static Role GetRoleByCode(string RoleCode, string RoleGroup)
        {
            return Roles.Find(r => r.RoleCode == RoleCode && (String.IsNullOrWhiteSpace(RoleGroup) || r.RoleGroup == RoleGroup));
        }
        public static Role GetRoleByName(string RoleName, string RoleGroup)
        {
            return Roles.Find(r => r.RoleName == RoleName && (String.IsNullOrWhiteSpace(RoleGroup) || r.RoleGroup == RoleGroup));
        }

        public static List<Role> GetAllRoles()
        {
            return Roles;
        }

        [ThreadStatic]
        private static User _User;
        private static dynamic UserObj
        {
            get
            {
                if (HttpContext.Current != null)
                {
                    if (HttpContext.Current.Items[USER] == null)
                    {
                        List<User> UserList = BIACore.Provider.SQL.Execute<User>(Connections.BIASecurity, "[userObject].GetUserMapping", new DBParameter[] {
                            new DBParameter("@sysm",DbType.AnsiString, BIACore.Security.Session.userId),
                            new DBParameter("@env",DbType.AnsiString, BIACore.Settings.Config.BIAEnvironment)
                        });
                        if (UserList.Count > 0) HttpContext.Current.Items[USER] = UserList[0];
                    }
                }
                else if (_User == null)
                {
                    _User = new User();
                }

                return (HttpContext.Current != null) ? (User)HttpContext.Current.Items[USER] : _User;
            }
        }

        [ThreadStatic]
        private static List<Role> _Roles;

        private static List<Role> Roles
        {
            get
            {
                if (HttpContext.Current != null)
                {
                    if (HttpContext.Current.Items[ROLES] == null)
                    {
                        HttpContext.Current.Items[ROLES] = BIACore.Provider.SQL.Execute<Role>(Connections.BIASecurity, "secObject.GetApplicationUserRoles", new DBParameter[] {
                            new DBParameter("@userId", DbType.AnsiString, CurrentUser.UserId),
                            new DBParameter("@appCode", DbType.AnsiString, BIACore.Settings.Config.AppCode),
                            new DBParameter("@appEnv",DbType.AnsiString, BIACore.Settings.Config.BIAEnvironment)
                        });
                        if(HttpContext.Current.Items[ROLES] == null) HttpContext.Current.Items[ROLES] = new List<Role>();
                    }
                }
                else if (_Roles == null)
                {
                    _Roles = new List<Role>();
                }
                return (HttpContext.Current != null) ? (List<Role>)HttpContext.Current.Items[ROLES] : _Roles;
            }
        }
    }
}