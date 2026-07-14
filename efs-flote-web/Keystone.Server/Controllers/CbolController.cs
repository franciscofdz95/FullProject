using Keystone.DAL.Model.Params;
using Keystone.Services.Services.Cbol;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CbolController : Controller
    {
        private readonly ICbolService _cbolService;

        // The report models expose columns with their raw stored-procedure casing
        // (e.g. Carrier_BOL, E2K_Buy_Amt). Disable the default camelCase policy so
        // the JSON keys match those names exactly.
        private static readonly JsonSerializerOptions _rawJsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = null
        };

        public CbolController(ICbolService cbolService)
        {
            _cbolService = cbolService;
        }

        [HttpPost("GetCbolSummary")]
        public async Task<IActionResult> GetCbolSummary([FromBody] VendorStatementSummaryParams filters)
        {
            try
            {
                var result = await _cbolService.GetCbolSummary(filters);
                return new JsonResult(result, _rawJsonOptions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("GetCbolAggregateData")]
        public async Task<IActionResult> GetCbolAggregateData([FromBody] VendorStatementSummaryParams filters)
        {
            try
            {
                var result = await _cbolService.GetCbolAggregateData(filters);
                return new JsonResult(result, _rawJsonOptions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("ProcessExcelDataToFlote")]
        public async Task<IActionResult> ProcessExcelDataToFlote([FromBody] VendorStatementSummaryParams filters)
        {
            try
            {
                var result = await _cbolService.ProcessExcelDataToFlote(filters);
                return new JsonResult(result, _rawJsonOptions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
