using BIACore.Model;
using System.Collections.Generic;
using System.Data;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class EABrief : extjs.Parameter
    {
        public string TableName { get; set; }
        public string BIA_ID { get; set; }
        public string LimitedAM { get; set; }
        public string BriefProfiles { get; set; }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();
            if (!string.IsNullOrEmpty(BIA_ID)) args.Add(new DBParameter("@BIA_ID", DbType.AnsiString, BIA_ID));
            if (!string.IsNullOrEmpty(TableName)) args.Add(new DBParameter("@TableName", DbType.AnsiString, TableName));
            if (!string.IsNullOrEmpty(LimitedAM)) args.Add(new DBParameter("@Limited_AM", DbType.AnsiString, LimitedAM));
            if (!string.IsNullOrEmpty(BriefProfiles)) args.Add(new DBParameter("@EA_BRIEF_Profiles", DbType.AnsiString, BriefProfiles));
            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }
}
