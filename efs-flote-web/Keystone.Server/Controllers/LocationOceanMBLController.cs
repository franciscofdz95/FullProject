using Keystone.DAL.Model.Params;
using Keystone.Services.Services.Locations.LocationOceanMBL;
using Microsoft.AspNetCore.Mvc;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationOceanMBLController : Controller
    {
        private readonly ILocationOceanMBLService _locationOceanMBLService;

        public LocationOceanMBLController(ILocationOceanMBLService locationOceanMBLService)
        {
            _locationOceanMBLService = locationOceanMBLService;
        }

        [HttpPost("GetLocationOceanMBLReport")]
        public async Task<IActionResult> GetLocationOceanMBLReport([FromBody] LocationOceanMBLParams filters)
        {
            try
            {
                var result = await _locationOceanMBLService.GetLocationOceanMBLReport(filters);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}