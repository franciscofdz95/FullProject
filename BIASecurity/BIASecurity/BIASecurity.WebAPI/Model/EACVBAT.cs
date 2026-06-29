using BIACore.Model;
using System.Collections.Generic;
using System.Data;
using extjs = BIACore.Web.Model.ExtJS;


namespace BIASecurity.WebAPI.Model
{
    public class EACVBAT : extjs.Parameter
    {
        public string TableName { get; set; }
        public string BIA_ID { get; set; }

        public string AccessAdmin { get; set; }
        public string Debug { get; set; }
        public string EditOverride { get; set; }
        public string MyReportsHistory { get; set; }
        public string NBS { get; set; }
        public string NewsEditor { get; set; }
        public string ExportCSV { get; set; }
        public string Attributes { get; set; }
        public string FlagSitesFlagEdit { get; set; }
        public string ParentException { get; set; }


        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();
            if (!string.IsNullOrEmpty(BIA_ID)) args.Add(new DBParameter("@BIA_ID", DbType.AnsiString, BIA_ID));
            if (!string.IsNullOrEmpty(AccessAdmin)) args.Add(new DBParameter("@AccessAdmin", DbType.AnsiString, AccessAdmin));
            if (!string.IsNullOrEmpty(Debug)) args.Add(new DBParameter("@Debug", DbType.AnsiString, Debug));
            if (!string.IsNullOrEmpty(EditOverride)) args.Add(new DBParameter("@EditOverride", DbType.AnsiString, EditOverride));
            if (!string.IsNullOrEmpty(MyReportsHistory)) args.Add(new DBParameter("@MyReportsHistory", DbType.AnsiString, MyReportsHistory));
            if (!string.IsNullOrEmpty(NBS)) args.Add(new DBParameter("@NBS", DbType.AnsiString, NBS));
            if (!string.IsNullOrEmpty(NewsEditor)) args.Add(new DBParameter("@NewsEditor", DbType.AnsiString, NewsEditor));
            if (!string.IsNullOrEmpty(ExportCSV))
            {
                if(ExportCSV != "NA")
                {
                    args.Add(new DBParameter("@Export_4000_CSV", DbType.AnsiString, ExportCSV));
                }
                else
                {
                    args.Add(new DBParameter("@Export_4000_CSV", DbType.AnsiString,  System.DBNull.Value));
                }
            }
            if (!string.IsNullOrEmpty(Attributes)) args.Add(new DBParameter("@Attributes", DbType.AnsiString, Attributes));
            if (!string.IsNullOrEmpty(FlagSitesFlagEdit)) args.Add(new DBParameter("@FlagSitesFlagEdit", DbType.AnsiString, FlagSitesFlagEdit));
            if (!string.IsNullOrEmpty(ParentException)) args.Add(new DBParameter("@Parent_Exception", DbType.AnsiString, ParentException));
            if (!string.IsNullOrEmpty(TableName)) args.Add(new DBParameter("@TableName", DbType.AnsiString, TableName));
            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }
}
