using Keystone.DAL.Model.Params;
using Keystone.DAL.Model.Results;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Keystone.Services.Services.InvoiceProcessing
{
    public interface IInvoiceProcessingService
    {
        Task<IEnumerable<InvoiceProcessingLineModel>> GetInvoiceProcessingReport(InvoiceProcessingParams parameters);
        Task<InvoiceChargesDetailModel> GetInvoiceChargesDetails(InvoiceProcessingParams parameters);
        Task<IEnumerable<Dictionary<string, object>>> GetNonE2kCost(InvoiceProcessingParams parameters);
        Task<IEnumerable<Dictionary<string, object>>> GetTWHCodes(InvoiceProcessingParams parameters);
        Task<bool> GetValidateTWHEntry(InvoiceProcessingParams parameters);
        Task InsertNonE2KCharge(InvoiceProcessingParams parameters);
        Task InsertTaxWithholding(InvoiceProcessingParams parameters);
        Task<IEnumerable<VatCodeModel>> GetVATCodesBP(InvoiceProcessingParams parameters);
        Task<IEnumerable<Dictionary<string, object>>> GetExchangeRateData(InvoiceProcessingParams parameters);
        Task<IEnumerable<Dictionary<string, object>>> PostInvoiceCurrency(InvoiceProcessingParams parameters);
        Task<IEnumerable<Dictionary<string, object>>> PostInvoiceLine(InvoiceProcessingParams parameters);
        Task<bool> CheckValidCurrency(InvoiceProcessingParams parameters);
        Task<int> GetInvoiceChargeCountByVatId(InvoiceProcessingParams parameters);
        Task UpdateInvoiceComment(InvoiceProcessingParams parameters);
        Task VerifyInvoice(InvoiceProcessingParams parameters);
        Task UpdateInvoiceVATId(InvoiceProcessingParams parameters);
        Task<Dictionary<string, object>> GetSplitRemainder(InvoiceProcessingParams parameters);
        Task<Dictionary<string, object>> GetInvoiceLineCurrency(InvoiceProcessingParams parameters);
        Task<Dictionary<string, object>> CheckInvoiceCurrency(InvoiceProcessingParams parameters);
        Task<IEnumerable<Dictionary<string, object>>> LoadPaidDifferentlyReasons();
        Task<IEnumerable<Dictionary<string, object>>> GetSCACCode(InvoiceProcessingParams parameters);
    }
}
