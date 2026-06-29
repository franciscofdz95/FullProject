using BIACore.Model;
using System.Collections.Generic;
using System.Data;
using extjs = BIACore.Web.Model.ExtJS;


namespace BIASecurity.WebAPI.Model
{
    public class EAModel : extjs.Parameter
    {
        public string TableName { get; set; }
        public string BIA_ID { get; set; }
        public string sysm { get; set; }


        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();
            if (!string.IsNullOrEmpty(BIA_ID)) args.Add(new DBParameter("@BIA_ID", DbType.AnsiString, BIA_ID));            
            if (!string.IsNullOrEmpty(sysm)) args.Add(new DBParameter("@sysm", DbType.AnsiString, sysm));            
            if (!string.IsNullOrEmpty(TableName)) args.Add(new DBParameter("@TableName", DbType.AnsiString, TableName));
            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }
}
