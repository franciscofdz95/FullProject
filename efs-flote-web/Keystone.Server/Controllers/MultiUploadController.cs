using Keystone.Services.Services.MultiUpload;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class MultiUploadController : ControllerBase
    {
        private readonly IMultiUploadService _multiUploadService;
        public MultiUploadController(IMultiUploadService multiUploadService) => _multiUploadService = multiUploadService;

        [HttpGet("UploadTypes")]
        public IActionResult GetUploadTypes() => Ok(_multiUploadService.GetUploadTypeDefinitions());

    }
}