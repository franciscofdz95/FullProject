using BIACore.Model;
using System;
using System.Collections.Generic;
using System.Data;

using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class EAACIP : extjs.Parameter
    {
        //public int DBNullValue = DBNull.Value;
        public string BIA_ID { get; set; }
        //public string CSC_Access { get; set; }
       //// public string CSC_Type_Country_Code { get; set; }

        /// <summary>
        /// ///
        
        public string Region_Coordinator { get; set; }
        public string District_Coordinator { get; set; }
        public string Add_Address { get; set; }
        public int Read_Only_Access { get; set; }
        public int View_AddrKey { get; set; }
        public int Change_ActiveFlag { get; set; }
        public int Unclassified_Des { get; set; }
        public int Edit_Reasons { get; set; }
        public string CSC_Access { get; set; }
        public int CSC_Supervisor_Access { get; set; }
        public int Customer_Contact_Export { get; set; }
        public int View_Repeater_Rpt { get; set; }
        public int EA_ACIP_View_Usage_Rpt { get; set; }
        public int Escalation_Export { get; set; }
        public int EA_UseMultiTrackingNumLookup { get; set; }
        public int EA_Weekly_Designation_Summary_Report { get; set; }
        public string EA_ACIP_Online_Research_Agent { get; set; }
        public string EA_ACIP_Online_Research_Agent_Reports { get; set; }
        public string EA_ACIP_ORA_Level { get; set; }
        public int EA_ACIP_Can_Process_Multi_Tenant { get; set; } 
        public int EA_ACIP_Can_Designate { get; set; }
        public int EA_ACIP_Can_View_AMS_30Day_Audit { get; set; }

        /// </summary>
        /// <returns></returns>
        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();
            if (!string.IsNullOrEmpty(BIA_ID)) args.Add(new DBParameter("@BIA_ID", DbType.AnsiString, BIA_ID));
            //if (!string.IsNullOrEmpty(CSC_Access)) args.Add(new DBParameter("@CSC_Type", DbType.AnsiString, CSC_Access));
            //if (!string.IsNullOrEmpty(CSC_Type_Country_Code)) args.Add(new DBParameter("@CSC_Type_Country_Code", DbType.AnsiString, CSC_Type_Country_Code));

            if (!string.IsNullOrEmpty(Region_Coordinator)) args.Add(new DBParameter("@Region_Coordinator", DbType.AnsiString, Region_Coordinator));
            if (!string.IsNullOrEmpty(District_Coordinator)) args.Add(new DBParameter("@District_Coordinator", DbType.AnsiString, District_Coordinator));
            if (!string.IsNullOrEmpty(Add_Address)) args.Add(new DBParameter("@Add_Address", DbType.AnsiString, Add_Address));
                args.Add(new DBParameter("@Read_Only_Access", DbType.Int32, Read_Only_Access));
            //if (!string.IsNullOrEmpty(Read_Only_Access)) args.Add(new DBParameter("@Read_Only_Access", DbType.Int32, Read_Only_Access));
              //  else args.Add(new DBParameter("@Read_Only_Access", DbType.AnsiString, DBNullValue));
                args.Add(new DBParameter("@View_AddrKey", DbType.Int32, View_AddrKey));
                args.Add(new DBParameter("@Change_ActiveFlag", DbType.Int32, Change_ActiveFlag));
                args.Add(new DBParameter("@Unclassified_Des", DbType.Int32, Unclassified_Des));
                //else args.Add(new DBParameter("@Unclassified_Des", DbType.AnsiString, DBNullValue));
                args.Add(new DBParameter("@Edit_Reasons", DbType.Int32, Edit_Reasons));
            if (!string.IsNullOrEmpty(CSC_Access)) args.Add(new DBParameter("@CSC_Access", DbType.AnsiString, CSC_Access));
                else args.Add(new DBParameter("@Edit_Reasons", DbType.AnsiString, DBNull.Value));
                args.Add(new DBParameter("@CSC_Supervisor_Access", DbType.Int32, CSC_Supervisor_Access));
                //else args.Add(new DBParameter("@CSC_Supervisor_Access", DbType.AnsiString, DBNullValue));
                args.Add(new DBParameter("@Customer_Contact_Export", DbType.Int32, Customer_Contact_Export));
               // else args.Add(new DBParameter("@Customer_Contact_Export", DbType.AnsiString, DBNullValue));
                args.Add(new DBParameter("@View_Repeater_Rpt", DbType.Int32, View_Repeater_Rpt));
                //else args.Add(new DBParameter("@View_Repeater_Rpt", DbType.AnsiString, DBNullValue));
                args.Add(new DBParameter("@EA_ACIP_View_Usage_Rpt", DbType.Int32, EA_ACIP_View_Usage_Rpt));
               // else args.Add(new DBParameter("@EA_ACIP_View_Usage_Rpt", DbType.AnsiString, DBNullValue));
                args.Add(new DBParameter("@Escalation_Export", DbType.Int32, Escalation_Export));
                //else args.Add(new DBParameter("@Escalation_Export", DbType.AnsiString, DBNullValue));
                args.Add(new DBParameter("@EA_UseMultiTrackingNumLookup", DbType.Int32, EA_UseMultiTrackingNumLookup));
                //else args.Add(new DBParameter("@EA_UseMultiTrackingNumLookup", DbType.AnsiString, DBNullValue));
                args.Add(new DBParameter("@EA_Weekly_Designation_Summary_Report", DbType.Int32, EA_Weekly_Designation_Summary_Report));
                //else args.Add(new DBParameter("@EA_Weekly_Designation_Summary_Report", DbType.AnsiString, DBNullValue));             
            if (!string.IsNullOrEmpty(EA_ACIP_Online_Research_Agent)) args.Add(new DBParameter("@EA_ACIP_Online_Research_Agent", DbType.AnsiString, EA_ACIP_Online_Research_Agent));
                else args.Add(new DBParameter("@EA_ACIP_Online_Research_Agent", DbType.AnsiString, DBNull.Value));
            if (!string.IsNullOrEmpty(EA_ACIP_Online_Research_Agent_Reports)) args.Add(new DBParameter("@EA_ACIP_Online_Research_Agent_Reports", DbType.AnsiString, EA_ACIP_Online_Research_Agent_Reports));
                else args.Add(new DBParameter("@EA_ACIP_Online_Research_Agent_Reports", DbType.AnsiString, DBNull.Value));
            if (!string.IsNullOrEmpty(EA_ACIP_ORA_Level)) args.Add(new DBParameter("@EA_ACIP_ORA_Level", DbType.AnsiString, EA_ACIP_ORA_Level));
                else args.Add(new DBParameter("@EA_ACIP_ORA_Level", DbType.AnsiString, DBNull.Value));
                args.Add(new DBParameter("@EA_ACIP_Can_Process_Multi_Tenant", DbType.Int32, EA_ACIP_Can_Process_Multi_Tenant));
                //else args.Add(new DBParameter("@EA_ACIP_Can_Process_Multi_Tenant", DbType.AnsiString, DBNullValue));
                args.Add(new DBParameter("@EA_ACIP_Can_Designate", DbType.Int32, EA_ACIP_Can_Designate));
                //else args.Add(new DBParameter("@EA_ACIP_Can_Designate", DbType.AnsiString, DBNullValue));
                args.Add(new DBParameter("@EA_ACIP_Can_View_AMS_30Day_Audit", DbType.Int32, EA_ACIP_Can_View_AMS_30Day_Audit));
               // else args.Add(new DBParameter("@EA_ACIP_Can_View_AMS_30Day_Audit", DbType.AnsiString, DBNullValue));



            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }
}
