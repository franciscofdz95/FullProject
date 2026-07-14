using Keystone.DAL.Model.Params;
using Keystone.DAL.Model.Results;
using Keystone.DAL.Provider;
using Keystone.Services.Services.Invoices.InvoiceVAT;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Keystone.Services.Services.InvoiceProcessing
{
    public class InvoiceProcessingService : IInvoiceProcessingService
    {
        private readonly IDataProvider _dataProvider;
        private readonly IInvoiceVATService _invoiceVATService;

        public InvoiceProcessingService(IDataProvider dataProvider, IInvoiceVATService invoiceVATService)
        {
            _dataProvider = dataProvider;
            _invoiceVATService = invoiceVATService;
        }

        public async Task<IEnumerable<InvoiceProcessingLineModel>> GetInvoiceProcessingReport(InvoiceProcessingParams parameters)
        {
            var storedProcedure = parameters.RadioSelection == "Selected"
                ? DBConstants.BPSSelectedCharges
                : DBConstants.BPSUnSelectedCharges;

            return await _dataProvider.ExecuteAsync<InvoiceProcessingLineModel>(storedProcedure, CommandType.StoredProcedure, parameters.ToReportParams());
        }

        public async Task<InvoiceChargesDetailModel> GetInvoiceChargesDetails(InvoiceProcessingParams parameters)
        {
            var result = await _dataProvider.ExecuteAsync<InvoiceChargesDetailModel>(DBConstants.InvoiceChargesDetails, CommandType.StoredProcedure, parameters.ToChargeDetailsParams());
            return result.FirstOrDefault() ?? new InvoiceChargesDetailModel();
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetNonE2kCost(InvoiceProcessingParams parameters)
        {
            var tariffRows = await _dataProvider.ExecuteAsyncGeneric(DBConstants.GetTarriffPointType, CommandType.StoredProcedure, parameters.ToTariffPointTypeParams());
            var tariffPointType = tariffRows.FirstOrDefault()?.GetValueOrDefault("tariff_point_type")?.ToString() ?? "";
            return await _dataProvider.ExecuteAsyncGeneric(DBConstants.GetCustomChargeCodeOptions, CommandType.StoredProcedure, parameters.ToNonE2kCostParams(tariffPointType));
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetTWHCodes(InvoiceProcessingParams parameters)
        {
            return await _dataProvider.ExecuteAsyncGeneric(DBConstants.GetTWHCodes, CommandType.StoredProcedure, parameters.ToTWHCodesParams());
        }

        public async Task<bool> GetValidateTWHEntry(InvoiceProcessingParams parameters)
        {
            var rows = await _dataProvider.ExecuteAsyncGeneric(DBConstants.ValidateTWHEntry, CommandType.StoredProcedure, parameters.ToValidateTWHEntryParams());
            return rows.Any();
        }

        public async Task InsertNonE2KCharge(InvoiceProcessingParams parameters)
        {
            await _dataProvider.ExecuteNonQueryAsync(DBConstants.AddNonE2KCostEntry, CommandType.StoredProcedure, parameters.ToInsertNonE2KChargeParams());
        }

        public async Task InsertTaxWithholding(InvoiceProcessingParams parameters)
        {
            await _dataProvider.ExecuteNonQueryAsync(DBConstants.AddTaxWithholdingEntry, CommandType.StoredProcedure, parameters.ToInsertTaxWithholdingParams());
        }

        public async Task<IEnumerable<VatCodeModel>> GetVATCodesBP(InvoiceProcessingParams parameters)
        {
            var args = parameters.ToVatCodesParams(out var byInvoiceVatId);
            var storedProcedure = byInvoiceVatId ? DBConstants.VATSubQuery : DBConstants.GetVATCodesCF;
            return await _dataProvider.ExecuteAsync<VatCodeModel>(storedProcedure, CommandType.StoredProcedure, args);
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetExchangeRateData(InvoiceProcessingParams parameters)
        {
            return await _dataProvider.ExecuteAsyncGeneric(DBConstants.GetExistingCurrencyDetails, CommandType.StoredProcedure, parameters.ToExchangeRateParams());
        }

        public async Task<IEnumerable<Dictionary<string, object>>> PostInvoiceCurrency(InvoiceProcessingParams parameters)
        {
            return await _dataProvider.ExecuteAsyncGeneric(DBConstants.PostInvoiceCurrency, CommandType.StoredProcedure, parameters.ToPostInvoiceCurrencyParams());
        }

        public async Task<IEnumerable<Dictionary<string, object>>> PostInvoiceLine(InvoiceProcessingParams parameters)
        {
            var result = await _dataProvider.ExecuteAsyncGeneric(DBConstants.PostInvoiceLine, CommandType.StoredProcedure, parameters.ToPostInvoiceLineParams());
            await _invoiceVATService.UpdateInvoiceVATIds(parameters.InvoiceId);
            return result;
        }

        public async Task<bool> CheckValidCurrency(InvoiceProcessingParams parameters)
        {
            var rows = await _dataProvider.ExecuteAsyncGeneric(DBConstants.CheckValidCurrency, CommandType.StoredProcedure, parameters.ToCheckValidCurrencyParams());
            return rows.Any();
        }

        public async Task<int> GetInvoiceChargeCountByVatId(InvoiceProcessingParams parameters)
        {
            return await _invoiceVATService.GetInvoiceChargeCountByVatId(parameters.InvoiceId, parameters.LocCode);
        }

        public async Task UpdateInvoiceComment(InvoiceProcessingParams parameters)
        {
            await _dataProvider.ExecuteNonQueryAsync(DBConstants.UpdateInvoiceComment, CommandType.StoredProcedure, parameters.ToUpdateCommentParams());
        }

        public async Task VerifyInvoice(InvoiceProcessingParams parameters)
        {
            await _invoiceVATService.UpdateInvoiceVATIds(parameters.InvoiceId);
            await _dataProvider.ExecuteNonQueryAsync(DBConstants.VerifyInvoiceForSelCharges, CommandType.StoredProcedure, parameters.ToVerifyInvoiceParams());
        }

        public async Task UpdateInvoiceVATId(InvoiceProcessingParams parameters)
        {
            await _invoiceVATService.UpdateInvoiceVATIds(parameters.InvoiceId);
        }

        public async Task<Dictionary<string, object>> GetSplitRemainder(InvoiceProcessingParams parameters)
        {
            var rows = await _dataProvider.ExecuteAsyncGeneric(DBConstants.GetSplitRemainder, CommandType.StoredProcedure, parameters.ToSplitRemainderParams());
            return rows.FirstOrDefault() ?? new Dictionary<string, object>();
        }

        public async Task<Dictionary<string, object>> GetInvoiceLineCurrency(InvoiceProcessingParams parameters)
        {
            var rows = await _dataProvider.ExecuteAsyncGeneric(DBConstants.GetInvoiceLineCurrency, CommandType.StoredProcedure, parameters.ToInvoiceLineCurrencyParams());
            return rows.FirstOrDefault() ?? new Dictionary<string, object>();
        }

        public async Task<Dictionary<string, object>> CheckInvoiceCurrency(InvoiceProcessingParams parameters)
        {
            var rows = await _dataProvider.ExecuteAsyncGeneric(DBConstants.IsInvoiceCurrencyExist, CommandType.StoredProcedure, parameters.ToCheckInvoiceCurrencyParams());
            return rows.FirstOrDefault() ?? new Dictionary<string, object>();
        }

        public async Task<IEnumerable<Dictionary<string, object>>> LoadPaidDifferentlyReasons()
        {
            return await _dataProvider.ExecuteAsyncGeneric(DBConstants.GetfilterPaidDifferrentlyReason, CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetSCACCode(InvoiceProcessingParams parameters)
        {
            return await _dataProvider.ExecuteAsyncGeneric(DBConstants.GetSCACCode, CommandType.StoredProcedure, parameters.ToSCACParams());
        }
    }
}
