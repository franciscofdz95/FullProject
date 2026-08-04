using Keystone.DAL.Model;
using Keystone.Services.Services.ValuePay;
using Microsoft.AspNetCore.Mvc;

namespace Keystone.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuePayLocationsController : Controller
    {
        private readonly IValuePayLocationService _valuePayLocationService;
        private readonly ILogger<ValuePayLocationsController> _logger;

        public ValuePayLocationsController(IValuePayLocationService valuePayLocationService, ILogger<ValuePayLocationsController> logger)
        {
            _valuePayLocationService = valuePayLocationService;
            _logger = logger;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll([FromQuery] string reqLoc)
        {
            if (string.IsNullOrWhiteSpace(reqLoc))
            {
                return BadRequest("reqLoc is required.");
            }

            try
            {
                var result = await _valuePayLocationService.GetAllAsync(reqLoc);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving Value Pay Locations for {ReqLoc}.", reqLoc);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update([FromBody] ValuePayLocationUpdateRequest request)
        {
            try
            {
                var (result, message) = await _valuePayLocationService.UpdateLocationAsync(request);
                if (!result)
                {
                    return BadRequest($"Message: {message}");
                }
                return Ok(new { success = true, message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating Value Pay Location for {ReqLocation}.", request?.ReqLocation);
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
