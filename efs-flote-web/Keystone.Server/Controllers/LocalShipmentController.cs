using Keystone.DAL.Model.Params;
using Keystone.Services.Services.Locations.LocationShipment;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class LocalShipmentController : Controller
    {
        private readonly ILocationShipmentService _locationShipmentService;
       // private readonly ILogger _log = Log.ForContext<LocalShipmentController>();

        public LocalShipmentController(ILocationShipmentService locationShipmentService)
        {
            _locationShipmentService = locationShipmentService;
        }

        [HttpPost("GetLocalShipmentReport")]
        public async Task<IActionResult> GetLocalShipmentReport([FromBody] SP_Params filters)
        {
            try
            {
               // _log.Information("GetLocalShipmentReport called with LocType: {LocType}", filters.Loctype);
                var result = await _locationShipmentService.GetLocalShipmentReport(filters);
                return Ok(result);
            }
            catch (Exception ex)
            {
                //_log.Error(ex, "Error in GetLocalShipmentReport");
                return BadRequest(ex.Message);
            }
        }
    }
}
