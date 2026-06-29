using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class ApplicationList : extjs.Parameter
    {
        public string searchValue { get; set; }
        public string searchGroup { get; set; }
        public string pinValue { get; set; }
        public string pinGroup { get; set; }
        public string active { get; set; }

        private ApplicationList() { }

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

            if (!string.IsNullOrEmpty(active)) args.Add(new DBParameter("@active", DbType.Boolean, active));

            //Add UserId (ADID) to every call to the ApplicationList stored procedure
            args.Add(new DBParameter("@userId", DbType.AnsiString, BIACore.Security.Session.ad_id));

            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }
}
