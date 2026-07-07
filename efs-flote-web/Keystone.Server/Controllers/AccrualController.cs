using Keystone.DAL.Model.Params;
using Keystone.Services.Services.Accrual;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccrualController : Controller
    {
        private readonly IAccrualService _accrualService;

        // The report models expose columns with their raw stored-procedure casing
        // (e.g. RCVD_AT_DATE, acctg_per_year). Disable the default camelCase
        // policy so the JSON keys match those names exactly.
        private static readonly JsonSerializerOptions _rawJsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = null
        };

        public AccrualController(IAccrualService accrualService)
        {
            _accrualService = accrualService;
        }

        [HttpPost("GetAccrualMonthlyReport")]
        public async Task<IActionResult> GetAccrualMonthlyReport([FromBody] AccrualParams filters)
        {
            try
            {
                var result = await _accrualService.GetAccrualMonthlyReport(filters.ToSPParams());
                return new JsonResult(result, _rawJsonOptions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("GetAccrualMonthlyDetailReport")]
        public async Task<IActionResult> GetAccrualMonthlyDetailReport([FromBody] AccrualParams filters)
        {
            try
            {
                var result = await _accrualService.GetAccrualMonthlyDetailReport(filters.ToSPParams());
                return new JsonResult(result, _rawJsonOptions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("GetAccrualAccuracyReport")]
        public async Task<IActionResult> GetAccrualAccuracyReport([FromBody] AccrualParams filters)
        {
            try
            {
                var result = await _accrualService.GetAccrualAccuracyReport(filters.ToSPParams());
                return new JsonResult(result, _rawJsonOptions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
