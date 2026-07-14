using Keystone.DAL.Model.Params;
using Keystone.DAL.Model.Results;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Cbol
{
    public interface ICbolService
    {
        Task<IEnumerable<CbolSummaryRowModel>> GetCbolSummary(VendorStatementSummaryParams parameters);
        Task<CbolAggregateModel> GetCbolAggregateData(VendorStatementSummaryParams parameters);
        Task<IEnumerable<Dictionary<string, object>>> ProcessExcelDataToFlote(VendorStatementSummaryParams parameters);
    }
}
