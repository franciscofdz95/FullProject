using Keystone.DAL.Model.Params;

namespace Keystone.Services.Services.Locations.LocationOceanMBL
{
    public interface ILocationOceanMBLService
    {
        Task<IEnumerable<Dictionary<string, object>>> GetLocationOceanMBLReport(LocationOceanMBLParams filters);
    }
}