using Keystone.DAL.Model;

namespace Keystone.Services.Services.FtpFiles
{
    public interface IFtpFilesService
    {
        Task<List<FtpFolderInfo>> GetRootDirectoriesAsync();
        Task<(List<FtpFileInfo> data, int totalCount)> GetFilesAsync(FtpFilePagination pagination);
        Task<(bool result, string message)> DeleteFileAsync(string folder, string fileName);
        Task<(byte[] content, string fileName)> DownloadFileAsync(string folder, string fileName);
    }
}
