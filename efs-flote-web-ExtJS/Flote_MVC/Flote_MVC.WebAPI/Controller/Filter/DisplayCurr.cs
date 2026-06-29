/* ====================================================================================================
NAME:				[Display Currency Filter Criteria]
BEHAVIOR:		Returns Display Currency reports data for selected filter criteria.
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

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("DisplayCurrency")]
        public List<object> DisplayCurrency(dynamic request)
        {
            List<DBParameter> array = new List<DBParameter>();
            if (request["query"].Value != null)
            {
                string query = request["query"].Value;
                string[] queryVal = query.Split(',');

                if (queryVal.Length > 0)
                {
                    array.Add(new DBParameter("@location_code", DbType.AnsiString, queryVal[0]));
                    array.Add(new DBParameter("@country_code", DbType.AnsiString, queryVal[1]));

                }

            }

             return LoadResult(DBConstants.GetCurrency, array.ToArray());
        }

    }
}
