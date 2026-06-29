using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Keystone.DAL.Model;
using Keystone.DAL.Model.Params;
using Keystone.DAL.Provider;
using System.Data;

namespace Keystone.Services.Services.Locations.LocationShipment
{
    public class LocationShipmentService : ILocationShipmentService
    {
        private readonly IDataProvider _dataProvider;

        public LocationShipmentService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetLocalShipmentReport(SP_Params filters)
        {
            filters.PageName = "LocShipReport";
            var dbParams = filters.ToDBParameter();

            string procedure = filters.Loctype == "TP"
                ? DBConstants.LocationShipmentTP
                : DBConstants.LocationShipmentDEP;

            var results = await _dataProvider.ExecuteAsyncGeneric(
                procedure,
                CommandType.StoredProcedure,
                dbParams
            );

            return results;
        }
    }
}
