using Keystone.DAL.Model.Params;
using Keystone.DAL.Provider;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Locations.LocationOceanMBL
{
    public class LocationOceanMBLService : ILocationOceanMBLService
    {
        private readonly IDataProvider _dataProvider;

        public LocationOceanMBLService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetLocationOceanMBLReport(LocationOceanMBLParams filters)
        {
            var spParams = filters.ToSPParams();
            var dbParams = spParams.ToDBParameter();

            return await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.LocationOceanMBL,
                CommandType.StoredProcedure,
                dbParams
            );
        }
    }
}