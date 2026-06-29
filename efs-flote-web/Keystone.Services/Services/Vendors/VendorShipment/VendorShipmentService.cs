using Keystone.DAL.Model;
using Keystone.DAL.Model.Params;
using Keystone.DAL.Model.Results;
using Keystone.DAL.Provider;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Vendors.VendorShipment
{
    public class VendorShipmentService
    {
        private readonly IDataProvider _dataProvider;
        public VendorShipmentService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<IEnumerable<VendorShipmentRptModel>> GetVendorShipmentReport(SP_Params _parameters)
        {
            _parameters.PageName = "VendorShipmentRpt";
            var param = _parameters.ToDBParameter();
            return await _dataProvider.ExecuteAsync<VendorShipmentRptModel>(DBConstants.VendorShipmentReport, CommandType.StoredProcedure, param);

        }
    }
}
