/* ====================================================================================================
NAME:			[Common Fields Filter Criteria]
BEHAVIOR:		Returns Common Fields reports data for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {
        
      
        [HttpPost]
        [ActionName("LocCode")]
        public string LocCode(string query, [FromBody] dynamic request)
        {
            return query;
        }

        [HttpPost]
        [ActionName("LocType")]
        public string LocType(string query, [FromBody] dynamic request)
        {
            return query;
        }

        [HttpPost]
        [ActionName("PageName")]
        public string PageName(string query, [FromBody] dynamic request)
        {
            return query;
        }

        [HttpPost]
        [ActionName("ACCNumber")]
        public ClientResult ACCNumber([FromBody] dynamic request)
        {
            var accNo = request["accNo"] != null ? request["accNo"].Value : "";
            if (request["query"] != null && request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.AccName, new DBParameter("@number", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.AccName, new DBParameter("@number", DbType.AnsiString, accNo));
            }
        }




        [HttpPost]
        [ActionName("Vendor")]
        public ClientResult Vendor([FromBody] dynamic request)
        {
            List<DBParameter> argsRm = new List<DBParameter>();
            var vendor = request["vendor"] != null ? request["vendor"].Value : "";
            argsRm.Add(new DBParameter("@Location_Code", DbType.AnsiString, request["loc_code"].Value));
            if (request["query"] != null && request["query"].Value != "")
            {
                argsRm.Add(new DBParameter("@Vendor", DbType.AnsiString, request["query"].Value));
                return LoadClientResult(DBConstants.AutoCompVendor, argsRm.ToArray());
            }
            else
            {
                argsRm.Add(new DBParameter("@Vendor", DbType.AnsiString, vendor));
                return LoadClientResult(DBConstants.AutoCompVendor, argsRm.ToArray());
            }
        }

        [HttpPost]
        [ActionName("BillCurr")]
        public List<object> BillCurr([FromBody] dynamic request)
        {
            List<DBParameter> argsRm = new List<DBParameter>();
            if (request["query"].Value != null)
            {
                string query = request["query"].Value;                
                string[] queryVal = query.Split(',');
                if (queryVal.Length > 0)
                {
                    argsRm.Add(new DBParameter("@location_code", DbType.AnsiString, queryVal[0]));
                    argsRm.Add(new DBParameter("@country_code", DbType.AnsiString, queryVal[1]));
                }
            }
            return LoadResult(DBConstants.GetCurrency_FV2, argsRm.ToArray());
        }

        [HttpPost]
        [ActionName("ShipmentNumber")]
        public string ShipmentNumber(string query, [FromBody] dynamic request)
        {
            return query;
        }


        [HttpPost]
        [ActionName("MBLNumber")]
        public string MBLNumber(string query, [FromBody] dynamic request)
        {
            return query;
        }



    }
}
