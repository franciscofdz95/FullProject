/* ====================================================================================================
NAME:				[Coding Sheet Export]
BEHAVIOR:		Returns Coding Sheet for selected Invoice_id and location code.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System;
using System.Collections.Generic;
using System.Web.Http;
using BIACore.Model;
using System.Data;
using BIACore.Provider;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {

        // Return Bill Report summary.
        /// <summary>
        /// Get the folder name for coding sheet.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetFolderNames")]
        public List<object> GetFolderNames([FromBody] dynamic request)
        {
            try
            {
                List<DBParameter> param = new List<DBParameter>();
                string query = request["query"].Value;
                string[] queryVal = query.Split(',');


                if (queryVal.Length > 0)
                {
                    var locCode = Convert.ToString(queryVal[0]) != "" ? Convert.ToString(queryVal[0]) : "";
                    var cmpCode = Convert.ToString(queryVal[1]) != "" ? Convert.ToString(queryVal[1]) : "";
                    param.Add(new DBParameter("@location_code", DbType.AnsiString, locCode));
                    param.Add(new DBParameter("@company_code", DbType.AnsiString, cmpCode));
                }
                return LoadResult(DBConstants.GetFolderNames, param.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get the sub folder drop down value.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetSubFolderNames")]
        public List<object> GetSubFolderNames([FromBody] dynamic request)
        {
            try
            {
                List<DBParameter> param = new List<DBParameter>();
                string query = request["query"].Value;
                string[] queryVal = query.Split(',');


                if (queryVal.Length > 0)
                {
                    var locCode = Convert.ToString(queryVal[0]) != "" ? Convert.ToString(queryVal[0]) : "";
                    var cmpCode = Convert.ToString(queryVal[1]) != "" ? Convert.ToString(queryVal[1]) : "";
                    var flName = Convert.ToString(queryVal[2]) != null ? Convert.ToString(queryVal[2]) : "";
                    param.Add(new DBParameter("@location_code", DbType.AnsiString, locCode));
                    param.Add(new DBParameter("@company_code", DbType.AnsiString, cmpCode));
                    param.Add(new DBParameter("@foldername", DbType.AnsiString, flName));

                }
                return LoadResult(DBConstants.GetSubfolderNames, param.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Save the folder detail per Invoice.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("SetScanFolder")]
        public object SetScanFolder([FromBody] dynamic request)
        {
            try
            {
                List<DBParameter> param = new List<DBParameter>();
                param.Add(new DBParameter("@invoice_id", DbType.AnsiString, request["InvoiceId"].Value));
                param.Add(new DBParameter("@folder", DbType.AnsiString, request["ScanFolder"].Value));
                DataTable dtImage = SQL.Execute(Connection, DBConstants.SaveScanFolder, param.ToArray());
                return "Saved";

            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// update the coding sheet field values.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("PostCodeSheet")]
        public object PostCodeSheet([FromBody] dynamic request)
        {
            try
            {
                List<DBParameter> param = new List<DBParameter>();
                param.Add(new DBParameter("@field", DbType.AnsiString, request["Field"].Value));
                param.Add(new DBParameter("@value", DbType.AnsiString, request["Value"].Value));
                param.Add(new DBParameter("@coding_id", DbType.AnsiString, request["CodeId"].Value));
                param.Add(new DBParameter("@userId", DbType.AnsiString, request["UserId"].Value));
                SQL.Execute(Connection, DBConstants.PostCodingSheet, param.ToArray());
                return "Updated";
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
    }
}