using Keystone.DAL.Model.Params;
using Keystone.DAL.Model.Results;
using Keystone.DAL.Provider;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Cbol
{
    public class CbolService : ICbolService
    {
        private readonly IDataProvider _dataProvider;

        public CbolService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<IEnumerable<CbolSummaryRowModel>> GetCbolSummary(VendorStatementSummaryParams parameters)
        {
            var storedProcedure = parameters.HasDrillDownFilter()
                ? DBConstants.GetChargeCodeSummaryByCCNCBOL
                : DBConstants.GetCarrierBolSummaryByInvoiceId;

            return await _dataProvider.ExecuteAsync<CbolSummaryRowModel>(storedProcedure, CommandType.StoredProcedure, parameters.ToSummaryParams());
        }

        public async Task<CbolAggregateModel> GetCbolAggregateData(VendorStatementSummaryParams parameters)
        {
            var result = await _dataProvider.ExecuteAsync<CbolAggregateModel>(DBConstants.GetCbolAggregateData, CommandType.StoredProcedure, parameters.ToAggregateParams());
            return result.FirstOrDefault() ?? new CbolAggregateModel();
        }

        public async Task<IEnumerable<Dictionary<string, object>>> ProcessExcelDataToFlote(VendorStatementSummaryParams parameters)
        {
            return await _dataProvider.ExecuteAsyncGeneric(DBConstants.ProcessExcelDataToFlote, CommandType.StoredProcedure, parameters.ToMatchParams());
        }
    }
}
