
using Keystone.DAL.Model.Params;
using Keystone.DAL.Model.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Vendors.VendorShipment
{
    public interface IVendorShipmentService
    {
        Task<IEnumerable<VendorShipmentRptModel>> GetVendorShipmentReport(SP_Params _parameters);
    }
}
