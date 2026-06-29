using Keystone.DAL.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace Keystone.Server.Controllers
{ 
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class EnvironmentController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetEnvironment()
        {
            var apiBaseUrl = ConfigurationHelper.GetApiBaseUrl();
            var environment = ConfigurationHelper.GetEnvironment();

            return Ok(new
            {
                environment = environment,
                apiBaseUrl = apiBaseUrl
            });
        }
    }
}
