using Keystone.Services.Services.Session;
using Microsoft.AspNetCore.Mvc;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class SessionController : Controller
    {
        private readonly ISessionService _iSessionService;
        public SessionController(ISessionService iSessionService)
        {
            _iSessionService = iSessionService;
        }

        [HttpGet("GetUserIDByUserName")]
        public async Task<IActionResult> GetUserIDByUserName(string userName)
        {
            try
            {
                var result = await _iSessionService.GetActiveADID(userName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns the user's geoCode and geoId from their Flote user profile.
        /// Called once on login so the Angular app can scope Location Code
        /// typeahead searches (matching old ExtJS BIACore.Security.User.permissions).
        /// The response includes a "debug" field with all raw SP columns to help
        /// identify the correct column names during development.
        /// </summary>
        [HttpGet("GetUserGeoContext")]
        public async Task<IActionResult> GetUserGeoContext(string userName)
        {
            try
            {
                var (geoCode, geoId, allColumns) = await _iSessionService.GetUserGeoContext(userName);
                return Ok(new { geoCode, geoId, debug = allColumns });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns ALL geo-permission rows for the user.
        /// Mirrors BIACore.Security.User.permissions[] from the old ExtJS app
        /// (populated by BIACore.WebAPI.dll → api/user/User from the BIASecurity service).
        /// Each entry contains geoCode, geoId, userId, securityLevel, businessUnitId.
        /// The Angular client uses geoIndex (default 0) to select the active context,
        /// exactly as Viewport.cnt.js did with
        ///   geoCode = BIACore.Security.User.permissions[geoIndex].geoCode
        /// The user can switch context via GeoSRSwitchCtrl (index into this array).
        /// </summary>
        [HttpGet("GetUserPermissions")]
        public async Task<IActionResult> GetUserPermissions(string userName)
        {
            try
            {
                var permissions = await _iSessionService.GetUserPermissions(userName);
                return Ok(permissions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
