using Keystone.DAL.Model;
using Keystone.Services.Services.FtpFiles;
using Microsoft.AspNetCore.Mvc;

namespace Keystone.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FtpFilesController : Controller
    {
        private readonly IFtpFilesService _ftpFilesService;
        private readonly ILogger<FtpFilesController> _logger;

        public FtpFilesController(IFtpFilesService ftpFilesService, ILogger<FtpFilesController> logger)
        {
            _ftpFilesService = ftpFilesService;
            _logger = logger;
        }

        [HttpGet("GetRootDirectories")]
        public async Task<IActionResult> GetRootDirectories()
        {
            try
            {
                var result = await _ftpFilesService.GetRootDirectoriesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving APUT FTP root directories.");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("GetFiles")]
        public async Task<IActionResult> GetFiles([FromQuery] FtpFilePagination pagination)
        {
            try
            {
                var (data, totalCount) = await _ftpFilesService.GetFilesAsync(pagination);
                return Ok(new { data, totalCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving APUT FTP files for folder {Folder}.", pagination.Folder);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpDelete("DeleteFile")]
        public async Task<IActionResult> DeleteFile(string folder, string fileName)
        {
            try
            {
                var (result, message) = await _ftpFilesService.DeleteFileAsync(folder, fileName);
                if (!result)
                {
                    return BadRequest($"Message: {message}");
                }
                return Ok(new { success = true, message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting APUT FTP file {FileName} in folder {Folder}.", fileName, folder);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("DownloadFile")]
        public async Task<IActionResult> DownloadFile(string folder, string fileName)
        {
            try
            {
                var (content, downloadFileName) = await _ftpFilesService.DownloadFileAsync(folder, fileName);
                return File(content, "application/octet-stream", downloadFileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading APUT FTP file {FileName} in folder {Folder}.", fileName, folder);
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
