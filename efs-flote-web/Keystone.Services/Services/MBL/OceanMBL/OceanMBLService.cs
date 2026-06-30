using Keystone.DAL.Model.Params;
using Keystone.DAL.Provider;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Keystone.Services.Services.MBL.OceanMBL
{
    public class OceanMBLService : IOceanMBLService
    {
        private readonly IDataProvider _dataProvider;

        public OceanMBLService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetOceanMBLSummary(OceanMBLParams filters)
        {
            var spParams = filters.ToSPParams();
            var dbParams = spParams.ToDBParameter();

            return await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetOceanMBL,
                CommandType.StoredProcedure,
                dbParams
            );
        }
    }
}
