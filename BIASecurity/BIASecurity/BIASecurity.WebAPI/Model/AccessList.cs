using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class AccessList : extjs.Parameter
    {

        public string searchValue { get; set; }
        public string searchGroup { get; set; }
        public string pinValue { get; set; }
        public string pinGroup { get; set; }
        public string access { get; set; }
        public string appCode { get; set; }
        public string userId { get; set; }

        //private AccessList() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrEmpty(searchValue)) args.Add(new DBParameter("@searchValue", DbType.AnsiString, searchValue));
            if (!string.IsNullOrEmpty(searchGroup)) args.Add(new DBParameter("@searchGroup", DbType.AnsiString, searchGroup));

            if (BIACore.Security.User.isAdmin)
            {
                if (!string.IsNullOrEmpty(pinValue)) args.Add(new DBParameter("@pinValue", DbType.AnsiString, pinValue));
                if (!string.IsNullOrEmpty(pinGroup)) args.Add(new DBParameter("@pinGroup", DbType.AnsiString, pinGroup));
            }
            else
            {
                args.Add(new DBParameter("@pinValue", DbType.AnsiString, BIACore.Security.User.userId));
                args.Add(new DBParameter("@pinGroup", DbType.AnsiString, "User"));
            }

            if (!string.IsNullOrEmpty(access)) args.Add(new DBParameter("@access", DbType.AnsiString, access));
            if (!string.IsNullOrEmpty(appCode)) args.Add(new DBParameter("@appCode", DbType.AnsiString, appCode));
            args.Add(new DBParameter("@userId", DbType.AnsiString, BIACore.Security.Session.userId));

            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }

}
