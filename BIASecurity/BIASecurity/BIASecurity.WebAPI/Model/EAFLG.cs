using BIACore.Model;
using System;
using System.Collections.Generic;
using System.Data;

using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class EAFLG : extjs.Parameter
    {
        //public int DBNullValue = DBNull.Value;
        public string BIA_ID { get; set; }
        //public string CSC_Access { get; set; }
       //// public string CSC_Type_Country_Code { get; set; }

        /// <summary>
        /// ///
        
        public string VisitationForm { get; set; }
        public string UPSAir { get; set; }
        public string Sonic { get; set; }
        public string VisitationList { get; set; }
        public string Gateway { get; set; }
        public string SPLLocation { get; set; }
        public int AutoSend_UrgentVisits { get; set; }
        public string NFOAdmin { get; set; }
        public string NFOBusinessUnit { get; set; }
        public string SEEP_UserLevel { get; set; }

        /// </summary>
        /// <returns></returns>
        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();
            if (!string.IsNullOrEmpty(BIA_ID)) args.Add(new DBParameter("@BIA_ID", DbType.AnsiString, BIA_ID));

            if (!string.IsNullOrEmpty(VisitationForm)) args.Add(new DBParameter("@VisitationForm", DbType.AnsiString, VisitationForm));
            if (!string.IsNullOrEmpty(UPSAir)) args.Add(new DBParameter("@UPSAir", DbType.AnsiString, UPSAir));
            if (!string.IsNullOrEmpty(Sonic)) args.Add(new DBParameter("@Sonic", DbType.AnsiString, Sonic));
            if (!string.IsNullOrEmpty(VisitationList)) args.Add(new DBParameter("@VisitationList", DbType.AnsiString, VisitationList));
            if (!string.IsNullOrEmpty(Gateway)) args.Add(new DBParameter("@Gateway", DbType.AnsiString, Gateway));
            if (!string.IsNullOrEmpty(SPLLocation)) args.Add(new DBParameter("@SPLLocation", DbType.AnsiString, SPLLocation));
            args.Add(new DBParameter("@AutoSend_UrgentVisits", DbType.Int32, AutoSend_UrgentVisits));
            if (!string.IsNullOrEmpty(NFOAdmin)) args.Add(new DBParameter("@NFOAdmin", DbType.AnsiString, NFOAdmin));
            if (!string.IsNullOrEmpty(NFOBusinessUnit)) args.Add(new DBParameter("@NFOBusinessUnit", DbType.AnsiString, NFOBusinessUnit));
            if (!string.IsNullOrEmpty(SEEP_UserLevel)) args.Add(new DBParameter("@SEEP_UserLevel", DbType.AnsiString, SEEP_UserLevel));

            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }
}
