using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Keystone.DAL.Model.Params;

namespace Keystone.Services.Services.Locations.LocationShipment
{
    public interface ILocationShipmentService
    {
        Task<IEnumerable<Dictionary<string, object>>> GetLocalShipmentReport(SP_Params filters);
    }
}
