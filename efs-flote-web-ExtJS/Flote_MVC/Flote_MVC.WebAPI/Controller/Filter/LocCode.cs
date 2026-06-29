/* ====================================================================================================
NAME:				[Location Code Filter Criteria]
BEHAVIOR:		Returns Location Code reports data for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;
using biafilter = Flote.WebAPI.WebAPI.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("LocationCode")]
        public ClientResult LocationCode([FromBody] dynamic request)
        {
            List<DBParameter> array = new List<DBParameter>();
            string query = request["query"].Value;
            string[] queryVal = query.Split(',');

            if (request["query"].Value != "")
            {
                var geoCode = Convert.ToString(queryVal[0]) != "" ? Convert.ToString(queryVal[0]) : "";
                var geoId = Convert.ToString(queryVal[1]) != "" ? Convert.ToString(queryVal[1]) : "";
                var locCode = Convert.ToString(queryVal[2]) != null ? Convert.ToString(queryVal[2]) : "";               

                array.Add(new DBParameter("@geoid", DbType.AnsiString, geoId));
                array.Add(new DBParameter("@geocode", DbType.AnsiString, geoCode));
                array.Add(new DBParameter("@location_code", DbType.AnsiString, locCode));
            }
            else
            {
                array.Add(new DBParameter("@country_code", DbType.AnsiString, ""));
            }

            return LoadClientResult(DBConstants.AutoCompLocation, array.ToArray());
        }
    }
}
