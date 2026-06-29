using BIACore.Model;
using System.Collections.Generic;
using System.Data;
using extjs = BIACore.Web.Model.ExtJS;


namespace BIASecurity.WebAPI.Model
{
    public class EARegGoods : extjs.Parameter
    {
        public string TableName { get; set; }
        public string BIA_ID { get; set; }
        public string EA_USHazMat { get; set; }
        public string EA_NonUSHazMat { get; set; }
        public string EA_Wine { get; set; }
        public string EA_Tobacco { get; set; }
        public string EA_WineExport { get; set; }
        public string EA_ReadOnly { get; set; }
        public string EA_2DAHandgun { get; set; }
        public string EA_UserAdmin { get; set; }
        public string EA_ISC { get; set; }
        public string EA_IHVW { get; set; }
        public string EA_Hemp { get; set; }



        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();
            if (!string.IsNullOrEmpty(BIA_ID)) args.Add(new DBParameter("@BIA_ID", DbType.AnsiString, BIA_ID));            
            if (!string.IsNullOrEmpty(TableName)) args.Add(new DBParameter("@TableName", DbType.AnsiString, TableName));
            if (!string.IsNullOrEmpty(EA_USHazMat)) args.Add(new DBParameter("@EA_USHazMat", DbType.AnsiString, EA_USHazMat));
            if (!string.IsNullOrEmpty(EA_NonUSHazMat)) args.Add(new DBParameter("@EA_NonUSHazMat", DbType.AnsiString, EA_NonUSHazMat));
            if (!string.IsNullOrEmpty(EA_Wine)) args.Add(new DBParameter("@EA_Wine", DbType.AnsiString, EA_Wine));
            if (!string.IsNullOrEmpty(EA_Tobacco)) args.Add(new DBParameter("@EA_Tobacco", DbType.AnsiString, EA_Tobacco));
            if (!string.IsNullOrEmpty(EA_WineExport)) args.Add(new DBParameter("@EA_WineExport", DbType.AnsiString, EA_WineExport));
            if (!string.IsNullOrEmpty(EA_ReadOnly)) args.Add(new DBParameter("@EA_ReadOnly", DbType.AnsiString, EA_ReadOnly));
            if (!string.IsNullOrEmpty(EA_2DAHandgun)) args.Add(new DBParameter("@EA_2DAHandgun", DbType.AnsiString, EA_2DAHandgun));
            if (!string.IsNullOrEmpty(EA_UserAdmin)) args.Add(new DBParameter("@EA_UserAdmin", DbType.AnsiString, EA_UserAdmin));
            if (!string.IsNullOrEmpty(EA_ISC)) args.Add(new DBParameter("@EA_ISC", DbType.AnsiString, EA_ISC));
            if (!string.IsNullOrEmpty(EA_IHVW)) args.Add(new DBParameter("@EA_IHVW", DbType.AnsiString, EA_IHVW));
            if (!string.IsNullOrEmpty(EA_Hemp)) args.Add(new DBParameter("@EA_Hemp", DbType.AnsiString, EA_Hemp));

            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }
}
