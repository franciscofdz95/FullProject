using Keystone.DAL.Model.Params;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Keystone.Services.Services.MBL.OceanMBL
{
    public interface IOceanMBLService
    {
        Task<IEnumerable<Dictionary<string, object>>> GetOceanMBLSummary(OceanMBLParams filters);
    }
}
