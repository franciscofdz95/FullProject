using Keystone.DAL.Model;
using Keystone.Services.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Keystone.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class AdminController : Controller
    {
        private readonly IAdminService _adminservice;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminservice, ILogger<AdminController> logger)
        {
            _adminservice = adminservice;
            _logger = logger;
        }

        [HttpGet("GetAdminDropDown/{dropdownName}")]
        public async Task<IActionResult> GetAdminDropDown(string dropdownName)
        {
            string screenName = "admin";

            try
            {
                var listingItems = new List<string>();
                return Ok(listingItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving listing numbers for dropdown.");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("GetAdminEmailConfiguration/{emailConfigurationId}")]
        public async Task<IActionResult> GetAdminEmailConfiguration(int emailConfigurationId)
        {
            try
            {
                var result = await _adminservice.GetAdminEmailConfiguration(emailConfigurationId);
                if (result == null)
                {
                    return NotFound($"Email configuration with ID {emailConfigurationId} not found.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving configuration with ID {emailConfigurationId}.", emailConfigurationId);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("GetTableAdminEmailConfigurations")]
        public async Task<IActionResult> GetTableAdminEmailConfigurations([FromQuery] EmailConfigPagination pagination)
        {
            try
            {
                var (data, totalCount) = await _adminservice.GetTableAdminEmailConfigurations(pagination);
                return Ok(new { data, totalCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving email configuration table");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("GetNotificationEmailConfig/{emailConfigurationId}")]
        public async Task<IActionResult> GetNotificationEmailConfig(int emailConfigurationId)
        {
            try
            {
                var result = await _adminservice.GetNotificationEmailConfig(emailConfigurationId);
                if (result == null)
                {
                    return NotFound($"Email configuration with ID {emailConfigurationId} not found.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving configuration with ID {emailConfigurationId}.", emailConfigurationId);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpDelete("DeleteNotificationEmailConfig/{emailNotificationId}")]
        public async Task<IActionResult> DeleteNotificationEmailConfig(int emailNotificationId)
        {
            try
            {
                var (result, message) = await _adminservice.DeleteNotificationEmailConfig(emailNotificationId);
                if (!result)
                {
                    return BadRequest($"Message: {message}");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving email notification configuration with ID {emailNotificationId}.", emailNotificationId);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("AddNotificationEmailConfig")]
        public async Task<IActionResult> AddNotificationEmailConfig([FromBody] NotificationEmailConfigRequest request)
        {
            try
            {
                var createdById = 1; //Admin Todo Users? and HttpContext.User are not related to Dim_user ;

                var (result, message) = await _adminservice.AddNotificationEmailConfig(
                    request.EmailConfigurationId,
                    request.UserId,
                    request.RecipientTypeId,
                    createdById
                );

                if (!result)
                    return BadRequest($"Message: {message}");

                return Ok(new { Success = true, Message = "Notification added successfully." });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "User not authorized to add notification.");
                return Unauthorized("User not authorized.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding email notification configuration.");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPut("UpdateNotificationEmailConfig")]
        public async Task<IActionResult> UpdateNotificationEmailConfig([FromBody] NotificationEmailConfigRequest request)
        {
            try
            {
                var createdById = 1; //Admin Todo Users? and HttpContext.User are not related to Dim_user ;

                var (result, message) = await _adminservice.UpdateNotificationEmailConfig(
                    request.NotificationConfigurationId ?? 0,
                    request.EmailConfigurationId,
                    request.UserId,
                    request.RecipientTypeId,
                    createdById
                );

                if (!result)
                    return BadRequest($"Message: {message}");

                return Ok(new { Success = true, Message = "Notification updated successfully." });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "User not authorized to update notification.");
                return Unauthorized("User not authorized.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating email notification configuration.");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
