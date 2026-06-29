using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class ActiveUserList : extjs.Parameter
    {
        public string[] server { get; set; }
        public string[] userList { get; set; }
        public string[] userADIDList { get; set; }
        public string[] userNameList { get; set; }
        public bool? vpnUsersOnly { get; set; }
        public string[] environment { get; set; }
        public string[] appcode { get; set; }
        private ActiveUserList() { }
        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (null != server && server.Length > 0) args.Add(new DBParameter("@server", DbType.AnsiString, string.Join(",", server)));
            if (null != userList && userList.Length > 0) args.Add(new DBParameter("@userList", DbType.AnsiString, string.Join(",", userList)));
            if (null != userADIDList && userADIDList.Length > 0) args.Add(new DBParameter("@userADIDList", DbType.AnsiString, string.Join(",", userADIDList)));
            if (null != userNameList && userNameList.Length > 0) args.Add(new DBParameter("@userNameList", DbType.AnsiString, string.Join(",", userNameList)));
            if (vpnUsersOnly != null) args.Add(new DBParameter("@vpnUsersOnly", DbType.AnsiString, vpnUsersOnly));
            if (null != environment && environment.Length > 0) args.Add(new DBParameter("@env", DbType.AnsiString, string.Join(",", environment)));
            if (null != appcode && appcode.Length > 0) args.Add(new DBParameter("@appcode", DbType.AnsiString, string.Join(",", appcode)));

            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }
}
