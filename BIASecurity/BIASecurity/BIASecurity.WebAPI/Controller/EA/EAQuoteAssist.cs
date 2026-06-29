using BIACore.Model;
using BIACore.Provider;
using BIACore.Web.Controller;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Model;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;
using System.Collections.Generic;
using System;
using System.Linq;
using Newtonsoft.Json;

namespace BIASecurity.WebAPI.Controller
{
    public class EAQuoteAssistController : BaseController
    {
        public override string Connection
        {
            get { return Connections.BIASecurity; }
        }

        //[HttpPost]
        //[ActionName("GetUserList")]
        //public object GetUserList([FromBody] dynamic request)
        //{
        //    IList<UserData> userData = new List<UserData>();

        //    DBParameter[] args = new DBParameter[]
        //    {
        //        new DBParameter("@searchParam",DbType.AnsiString, request.searchParam.Value),
        //        new DBParameter("@currentUser", DbType.AnsiString, BIACore.Security.User.userId)
        //    };

        //    DataTable dt = SQL.Execute(Connection, "appObject.BIASecurity_New_UserSearch", args.ToArray());

        //    foreach (DataRow itm in dt.Rows)
        //    {
        //        userData.Add(new UserData
        //        {
        //            ADID = Convert.ToString(itm["AdId"]),
        //            FirstName = Convert.ToString(itm["FirstName"]),
        //            LastName = Convert.ToString(itm["LastName"])
        //        });
        //    }

        //    return userData;
        //}

        [HttpPost]
        [ActionName("GetUserProfileSettings_QuoteAssist")]
        public object GetUserProfileSettings_QuoteAssist([FromBody] dynamic request)
        {
            DBParameter[] args = new DBParameter[]
            {
                new DBParameter("@USRSYSM",DbType.AnsiString,request.UsrSysm.Value)
            };

            DataTable dt = SQL.Execute(Connections.BIASecurity, "appObject.usp_QuoteAssist_GetExtendedAttributes", args);

            EAQuoteAssistUserAccess userAccess = new EAQuoteAssistUserAccess();
            if (dt != null && dt.Rows.Count < 0)
            {
                return userAccess;
            }

            foreach (DataRow row in dt.Rows)
            {
                userAccess.BILLING_VIEW = row["BILLING_VIEW"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["BILLING_VIEW"])) : "0";
                userAccess.CARRIER_CONTRACT_AUDIT = row["CARRIER_CONTRACT_AUDIT"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["CARRIER_CONTRACT_AUDIT"])) : "0";
                userAccess.COST_VIEW = row["COST_VIEW"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["COST_VIEW"])) : "0";
                userAccess.CPD = row["CPD"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["CPD"])) : "0";
                userAccess.CPD_ADMIN = row["CPD_ADMIN"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["CPD_ADMIN"])) : "0";
                userAccess.CUSTOM_RATE = row["CUSTOM_RATE"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["CUSTOM_RATE"])) : "0";
                userAccess.EDIT_ADDITIONAL_CHARGES = row["EDIT_ADDITIONAL_CHARGES"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["EDIT_ADDITIONAL_CHARGES"])) : "0";
                userAccess.EDIT_XSURCHARGE = row["EDIT_XSURCHARGE"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["EDIT_XSURCHARGE"])) : "0";
                userAccess.EXTRACT_RATES = row["EXTRACT_RATES"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["EXTRACT_RATES"])) : "0";
                userAccess.EZQUOTE = row["EZQUOTE"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["EZQUOTE"])) : "0";
                userAccess.GRI_EXEMPT_ADMIN = row["GRI_EXEMPT_ADMIN"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["GRI_EXEMPT_ADMIN"])) : "0";
                userAccess.IS_E2K_USER = row["IS_E2K_USER"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["IS_E2K_USER"])) : "0";
                userAccess.IS_TDO = row["IS_TDO"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["IS_TDO"])) : "0";
                userAccess.LCL_CALC_USER = row["LCL_CALC_USER"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["LCL_CALC_USER"])) : "0";
                userAccess.MARGIN_FLOOR_USER = row["MARGIN_FLOOR_USER"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["MARGIN_FLOOR_USER"])) : "0";
                userAccess.QA_INSIGHT = row["QA_INSIGHT"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["QA_INSIGHT"])) : "0";
                userAccess.QA_INSIGHT_AUTORATEVIEW = row["QA_INSIGHT_AUTORATEVIEW"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["QA_INSIGHT_AUTORATEVIEW"])) : "0";
                userAccess.QA_INSIGHT_GRANTOR = row["QA_INSIGHT_GRANTOR"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["QA_INSIGHT_GRANTOR"])) : "0";
                userAccess.QA_INSIGHT_LCL = row["QA_INSIGHT_LCL"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["QA_INSIGHT_LCL"])) : "0";
                userAccess.QA_INSIGHT_USERVIEW = row["QA_INSIGHT_USERVIEW"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["QA_INSIGHT_USERVIEW"])) : "0";
                userAccess.REQUOTE_ADMIN_REG = row["REQUOTE_ADMIN_REG"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["REQUOTE_ADMIN_REG"])) : "0";
                userAccess.REQUOTE_APPROVER_NONREG = row["REQUOTE_APPROVER_NONREG"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["REQUOTE_APPROVER_NONREG"])) : "0";
                userAccess.REQUOTE_APPROVER_REG = row["REQUOTE_APPROVER_REG"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["REQUOTE_APPROVER_REG"])) : "0";
                userAccess.REQUOTE_REQUESTOR_REG = row["REQUOTE_REQUESTOR_REG"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["REQUOTE_REQUESTOR_REG"])) : "0";
                userAccess.SUPER_USER = row["SUPER_USER"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["SUPER_USER"])) : "0";
                userAccess.TLI_ADJUSTER = row["TLI_ADJUSTER"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["TLI_ADJUSTER"])) : "0";
                userAccess.TLI_ADMIN = row["TLI_ADMIN"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["TLI_ADMIN"])) : "0";
                userAccess.TLI_SA = row["TLI_SA"] != DBNull.Value ? Convert.ToString(Convert.ToInt32(row["TLI_SA"])) : "0";
                userAccess.USRSYSM = Convert.ToString(row["USRSYSM"]);
            }

            return userAccess;
        }

        [HttpPost]
        [ActionName("SaveUserProfileSettings_QuoteAssist")]
        public ResponseText SaveUserProfileSettings_QuoteAssist([FromBody] dynamic request)
        {
            string requestJSONString = request.userProfileSettings.Value;
            string selectedLocationCsvData = request.selectedLocationData.Value;
            string selectedTradeLaneAccessCsvData = request.selectedTradeLaneAccessData.Value;
            EAQuoteAssistUserAccess getSaveUserAccessObject = JsonConvert.DeserializeObject<EAQuoteAssistUserAccess>(requestJSONString);

            try
            {
                DBParameter[] args = new DBParameter[]
                {
                    new DBParameter("@BILLING_VIEW",DbType.Int32,getSaveUserAccessObject.BILLING_VIEW),
                    new DBParameter("@CARRIER_CONTRACT_AUDIT",DbType.Boolean,getSaveUserAccessObject.CARRIER_CONTRACT_AUDIT),
                    new DBParameter("@COST_VIEW",DbType.Int32,getSaveUserAccessObject.COST_VIEW),
                    new DBParameter("@CPD",DbType.Int32,getSaveUserAccessObject.CPD),
                    new DBParameter("@CPD_ADMIN",DbType.Int32,getSaveUserAccessObject.CPD_ADMIN),
                    new DBParameter("@CUSTOM_RATE",DbType.Int16,getSaveUserAccessObject.CUSTOM_RATE),
                    new DBParameter("@EDIT_ADDITIONAL_CHARGES",DbType.Boolean,getSaveUserAccessObject.EDIT_ADDITIONAL_CHARGES),
                    new DBParameter("@EDIT_XSURCHARGE",DbType.Boolean,getSaveUserAccessObject.EDIT_XSURCHARGE),
                    new DBParameter("@EXTRACT_RATES",DbType.Boolean,getSaveUserAccessObject.EXTRACT_RATES),
                    new DBParameter("@EZQUOTE",DbType.Int32,getSaveUserAccessObject.EZQUOTE),
                    new DBParameter("@GRI_EXEMPT_ADMIN",DbType.Boolean,getSaveUserAccessObject.GRI_EXEMPT_ADMIN),
                    new DBParameter("@IS_E2K_USER",DbType.Boolean,getSaveUserAccessObject.IS_E2K_USER),
                    new DBParameter("@IS_TDO",DbType.Boolean,getSaveUserAccessObject.IS_TDO),
                    new DBParameter("@LCL_CALC_USER",DbType.Boolean,getSaveUserAccessObject.LCL_CALC_USER),
                    new DBParameter("@MARGIN_FLOOR_USER",DbType.Boolean,getSaveUserAccessObject.MARGIN_FLOOR_USER),
                    new DBParameter("@QA_INSIGHT",DbType.Boolean,getSaveUserAccessObject.QA_INSIGHT),
                    new DBParameter("@QA_INSIGHT_AUTORATEVIEW",DbType.Boolean,getSaveUserAccessObject.QA_INSIGHT_AUTORATEVIEW),
                    new DBParameter("@QA_INSIGHT_GRANTOR",DbType.Boolean,getSaveUserAccessObject.QA_INSIGHT_GRANTOR),
                    new DBParameter("@QA_INSIGHT_USERVIEW",DbType.Boolean,getSaveUserAccessObject.QA_INSIGHT_USERVIEW),
                    new DBParameter("@REQUOTE_ADMIN_REG",DbType.Boolean,getSaveUserAccessObject.REQUOTE_ADMIN_REG),
                    new DBParameter("@REQUOTE_APPROVER_NONREG",DbType.Boolean,getSaveUserAccessObject.REQUOTE_APPROVER_NONREG),
                    new DBParameter("@REQUOTE_APPROVER_REG",DbType.Boolean,getSaveUserAccessObject.REQUOTE_APPROVER_REG),
                    new DBParameter("@REQUOTE_REQUESTOR_REG",DbType.Boolean,getSaveUserAccessObject.REQUOTE_REQUESTOR_REG),
                    new DBParameter("@SUPER_USER",DbType.UInt32,getSaveUserAccessObject.SUPER_USER),
                    new DBParameter("@TLI_ADJUSTER",DbType.Boolean,getSaveUserAccessObject.TLI_ADJUSTER),
                    new DBParameter("@TLI_ADMIN",DbType.Boolean,getSaveUserAccessObject.TLI_ADMIN),
                    new DBParameter("@TLI_SA",DbType.Boolean,getSaveUserAccessObject.TLI_SA),
                    new DBParameter("@QA_INSIGHT_LCL",DbType.Boolean,getSaveUserAccessObject.QA_INSIGHT_LCL),
                    new DBParameter("@USRSYSM",DbType.AnsiString,getSaveUserAccessObject.USRSYSM)
                };

                SQL.ExecuteNonQuery(Connection, "appObject.usp_QuoteAssist_SaveExtendedAttributes", args);

                args = new DBParameter[]
                {
                    new DBParameter("@SYSM", DbType.AnsiString, getSaveUserAccessObject.USRSYSM)
                };

                SQL.ExecuteNonQuery(Connections.QuoteAssist, "GFFAppObject.usp_NEW_EA_DELETEOLDVALUES", args);

                if (string.IsNullOrEmpty(selectedLocationCsvData) && string.IsNullOrEmpty(selectedTradeLaneAccessCsvData))
                {
                    return new ResponseText
                    {
                        ResponseType = true,
                        Response = "Data saved successfully. All location and trade lane access revoked."
                    };
                }
                else if (string.IsNullOrEmpty(selectedLocationCsvData))
                {
                    return new ResponseText
                    {
                        ResponseType = true,
                        Response = "Data saved successfully. All location access revoked."
                    };
                }

                bool isUnderscore = false;
                string isUnderscoreFreeString = string.Empty;
                foreach (var itm in selectedLocationCsvData.Split('|'))
                {
                    if (!(string.IsNullOrEmpty(itm) || itm.Equals("null")))
                    {
                        if (itm.Contains('_'))
                        {
                            isUnderscoreFreeString = itm.Split('_')[0];
                            isUnderscore = true;
                        }

                        if (!isUnderscore)
                        {
                            args = new DBParameter[]
                            {
                                new DBParameter("@SYSM", DbType.AnsiString, getSaveUserAccessObject.USRSYSM),
                                new DBParameter("@LOCATIONINFO", DbType.AnsiString, itm),
                                new DBParameter("@ISDIST", DbType.Boolean, false),
                                new DBParameter("@AdminSysm", DbType.AnsiString, BIACore.Security.User.adId)
                            };
                        }
                        else
                        {
                            args = new DBParameter[]
                            {
                                new DBParameter("@SYSM", DbType.AnsiString, getSaveUserAccessObject.USRSYSM),
                                new DBParameter("@LOCATIONINFO", DbType.AnsiString, isUnderscoreFreeString),
                                new DBParameter("@ISDIST", DbType.Boolean, true),
                                new DBParameter("@AdminSysm", DbType.AnsiString, BIACore.Security.User.adId)
                            };
                        }

                        SQL.ExecuteNonQuery(Connections.QuoteAssist, "GFFAppObject.usp_NEW_EA_SETLOCATIONACCESS", args);

                        if (isUnderscore)
                            isUnderscore = false;
                    }
                }

                if (string.IsNullOrEmpty(selectedTradeLaneAccessCsvData))
                {
                    return new ResponseText
                    {
                        ResponseType = true,
                        Response = "Data saved successfully. All trade lane accesses revoked."
                    };
                }

                foreach (var itm in selectedTradeLaneAccessCsvData.Split('|'))
                {
                    if (!string.IsNullOrEmpty(itm))
                    {
                        args = new DBParameter[]
                        {
                            new DBParameter("@SYSM", DbType.AnsiString, getSaveUserAccessObject.USRSYSM),
                            new DBParameter("@TRADELANEINFO", DbType.AnsiString, itm),
                            new DBParameter("@AdminSysm", DbType.AnsiString, BIACore.Security.User.adId)
                        };

                        SQL.ExecuteNonQuery(Connections.QuoteAssist, "GFFAppObject.usp_NEW_EA_SETTRADELANEACCESS", args);
                    }
                }

                return new ResponseText
                {
                    ResponseType = true,
                    Response = "Data saved successfully."
                };
            }
            catch
            {
                return new ResponseText
                {
                    ResponseType = false,
                    Response = "Error occurred while saving data!"
                };
            }
        }
    }
}
