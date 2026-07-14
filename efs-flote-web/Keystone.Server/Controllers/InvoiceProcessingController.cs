using Keystone.DAL.Model.Params;
using Keystone.Services.Services.InvoiceProcessing;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceProcessingController : Controller
    {
        private readonly IInvoiceProcessingService _invoiceProcessingService;

        // The report models expose columns with their raw stored-procedure casing
        // (e.g. Charges_Logged, invoicevat_id). Disable the default camelCase policy
        // so the JSON keys match those names exactly.
        private static readonly JsonSerializerOptions _rawJsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = null
        };

        public InvoiceProcessingController(IInvoiceProcessingService invoiceProcessingService)
        {
            _invoiceProcessingService = invoiceProcessingService;
        }

        private IActionResult Raw(object result) => new JsonResult(result, _rawJsonOptions);

        [HttpPost("GetInvoiceProcessingReport")]
        public async Task<IActionResult> GetInvoiceProcessingReport([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetInvoiceProcessingReport(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("GetInvoiceChargesDetails")]
        public async Task<IActionResult> GetInvoiceChargesDetails([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetInvoiceChargesDetails(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("GetNonE2kCost")]
        public async Task<IActionResult> GetNonE2kCost([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetNonE2kCost(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("GetTWHCodes")]
        public async Task<IActionResult> GetTWHCodes([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetTWHCodes(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("GetValidateTWHEntry")]
        public async Task<IActionResult> GetValidateTWHEntry([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetValidateTWHEntry(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("InsertNonE2KCharge")]
        public async Task<IActionResult> InsertNonE2KCharge([FromBody] InvoiceProcessingParams filters)
        {
            try { await _invoiceProcessingService.InsertNonE2KCharge(filters); return Raw(new { status = "inserted" }); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("InsertTaxWithholding")]
        public async Task<IActionResult> InsertTaxWithholding([FromBody] InvoiceProcessingParams filters)
        {
            try { await _invoiceProcessingService.InsertTaxWithholding(filters); return Raw(new { status = "inserted" }); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("GetVATCodesBP")]
        public async Task<IActionResult> GetVATCodesBP([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetVATCodesBP(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("GetExchangeRateData")]
        public async Task<IActionResult> GetExchangeRateData([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetExchangeRateData(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("PostInvoiceCurrency")]
        public async Task<IActionResult> PostInvoiceCurrency([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.PostInvoiceCurrency(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("PostInvoiceLine")]
        public async Task<IActionResult> PostInvoiceLine([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.PostInvoiceLine(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("CheckValidCurrency")]
        public async Task<IActionResult> CheckValidCurrency([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.CheckValidCurrency(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("GetInvoiceChargeCountByVatId")]
        public async Task<IActionResult> GetInvoiceChargeCountByVatId([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetInvoiceChargeCountByVatId(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("UpdateInvoiceComment")]
        public async Task<IActionResult> UpdateInvoiceComment([FromBody] InvoiceProcessingParams filters)
        {
            try { await _invoiceProcessingService.UpdateInvoiceComment(filters); return Raw(new { status = "ok" }); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("VerifyInvoice")]
        public async Task<IActionResult> VerifyInvoice([FromBody] InvoiceProcessingParams filters)
        {
            try { await _invoiceProcessingService.VerifyInvoice(filters); return Raw(new { status = "verified" }); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("UpdateInvoiceVATId")]
        public async Task<IActionResult> UpdateInvoiceVATId([FromBody] InvoiceProcessingParams filters)
        {
            try { await _invoiceProcessingService.UpdateInvoiceVATId(filters); return Raw(new { status = "ok" }); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("GetSplitRemainder")]
        public async Task<IActionResult> GetSplitRemainder([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetSplitRemainder(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("GetInvoiceLineCurrency")]
        public async Task<IActionResult> GetInvoiceLineCurrency([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetInvoiceLineCurrency(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("CheckInvoiceCurrency")]
        public async Task<IActionResult> CheckInvoiceCurrency([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.CheckInvoiceCurrency(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("LoadPaidDifferentlyReasons")]
        public async Task<IActionResult> LoadPaidDifferentlyReasons()
        {
            try { return Raw(await _invoiceProcessingService.LoadPaidDifferentlyReasons()); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("GetSCACCode")]
        public async Task<IActionResult> GetSCACCode([FromBody] InvoiceProcessingParams filters)
        {
            try { return Raw(await _invoiceProcessingService.GetSCACCode(filters)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}
