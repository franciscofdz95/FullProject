using BIACore.Model;
using System.Collections.Generic;
using System.Data;
using extjs = BIACore.Web.Model.ExtJS;


namespace BIASecurity.WebAPI.Model
{
    public class EAWVAR : extjs.Parameter
    {
        public string TableName { get; set; }
        public string BIA_ID { get; set; }
        public char ea_View_File { get; set; }
        public char ea_Upload_File { get; set; }
        public char ea_Edit_File { get; set; }
        public char ea_Message_Admin { get; set; }
        public char ea_File_Only { get; set; }
        public char EA_Strategic_Parent { get; set; }
        public char EA_DM_Report_Access { get; set; }
        public char EA_DataManager_Extract { get; set; }
        public char EA_ParentType { get; set; }
        public char EA_Prt_Pers_Restricted { get; set; }
        public char EA_SAM_Emp_ID { get; set; }
        public char ea_exclude_parent_1043039000_amazon { get; set; }
        public char EA_Revised { get; set; }


        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrEmpty(BIA_ID)) args.Add(new DBParameter("@BIA_ID", DbType.AnsiString, BIA_ID));
            if (!string.IsNullOrEmpty(TableName)) args.Add(new DBParameter("@TableName", DbType.AnsiString, TableName));
            args.Add(new DBParameter("@ea_View_File", DbType.Byte, ea_View_File));
            args.Add(new DBParameter("@ea_Upload_File", DbType.Byte, ea_Upload_File));
            args.Add(new DBParameter("@ea_Edit_File", DbType.Byte, ea_Edit_File));
            args.Add(new DBParameter("@ea_Message_Admin", DbType.Byte, value: ea_Message_Admin));
            args.Add(new DBParameter("@ea_File_Only", DbType.Byte, ea_File_Only));
            args.Add(new DBParameter("@EA_Strategic_Parent", DbType.Byte, EA_Strategic_Parent));
            args.Add(new DBParameter("@EA_DM_Report_Access", DbType.Byte, EA_DM_Report_Access));
            args.Add(new DBParameter("@EA_DataManager_Extract", DbType.Byte, EA_DataManager_Extract));
            args.Add(new DBParameter("@EA_ParentType", DbType.Byte, EA_ParentType));
            args.Add(new DBParameter("@EA_Prt_Pers_Restricted", DbType.Byte, EA_Prt_Pers_Restricted));
            args.Add(new DBParameter("@EA_SAM_Emp_ID", DbType.Byte, EA_SAM_Emp_ID));
            args.Add(new DBParameter("@ea_exclude_parent_1043039000_amazon", DbType.Byte, ea_exclude_parent_1043039000_amazon));
            args.Add(new DBParameter("@EA_Revised", DbType.Byte, EA_Revised));

            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }
}
