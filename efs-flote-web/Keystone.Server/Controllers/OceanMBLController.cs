using Keystone.DAL.Model.Params;
using Keystone.Services.Services.MBL.OceanMBL;
using Microsoft.AspNetCore.Mvc;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OceanMBLController : Controller
    {
        private readonly IOceanMBLService _oceanMBLService;

        public OceanMBLController(IOceanMBLService oceanMBLService)
        {
            _oceanMBLService = oceanMBLService;
        }

        [HttpPost("GetOceanMBLSummary")]
        public async Task<IActionResult> GetOceanMBLSummary([FromBody] OceanMBLParams filters)
        {
            try
            {
                var result = await _oceanMBLService.GetOceanMBLSummary(filters);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
