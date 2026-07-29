using Keystone.DAL.Model;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Renci.SshNet;

namespace Keystone.Services.Services.FtpFiles
{
    public class FtpFilesService : IFtpFilesService
    {
        private readonly IMemoryCache _cache;
        private readonly string _hostName;
        private readonly int _port;
        private readonly string _userName;
        private readonly string _password;
        private readonly string _rootFolder;

        private static readonly TimeSpan CacheDuration = TimeSpan.FromSeconds(60);

        public FtpFilesService(IMemoryCache cache, IConfiguration configuration)
        {
            _cache = cache;
            _hostName = configuration["Sftp:HostName"];
            _port = configuration.GetValue<int?>("Sftp:Port") ?? 22;
            _userName = configuration["Sftp:UserName"];
            _password = configuration["Sftp:Password"];
            _rootFolder = configuration["Sftp:RootFolder"] ?? string.Empty;
        }

        private SftpClient CreateClient() => new SftpClient(_hostName, _port, _userName, _password);

        public Task<List<FtpFolderInfo>> GetRootDirectoriesAsync()
        {
            return Task.Run(() =>
            {
                using var sftp = CreateClient();
                sftp.Connect();
                try
                {
                    sftp.ChangeDirectory(_rootFolder);
                    var folders = sftp.ListDirectory(sftp.WorkingDirectory)
                        .Where(f => f.IsDirectory && f.Name != "." && f.Name != "..")
                        .Select(f => new FtpFolderInfo { Name = f.Name })
                        .OrderBy(f => f.Name)
                        .ToList();
                    return folders;
                }
                finally
                {
                    sftp.Disconnect();
                }
            });
        }

        private string CacheKey(string folder) => $"FtpFiles_{folder}";

        private Task<List<FtpFileInfo>?> GetFolderListingAsync(string folder, bool forceRefresh)
        {
            if (forceRefresh)
            {
                _cache.Remove(CacheKey(folder));
            }

            return _cache.GetOrCreateAsync(CacheKey(folder), entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = CacheDuration;

                return Task.Run(() =>
                {
                    using var sftp = CreateClient();
                    sftp.Connect();
                    try
                    {
                        var currentFolderName = string.IsNullOrEmpty(_rootFolder)
                            ? folder
                            : $"{_rootFolder}/{folder}";
                        sftp.ChangeDirectory(currentFolderName);

                        var files = sftp.ListDirectory(sftp.WorkingDirectory)
                            .Where(f => !f.IsDirectory && f.Name.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
                            .OrderByDescending(f => f.LastWriteTime)
                            .Select(f => new FtpFileInfo
                            {
                                FileName = f.Name,
                                LastModified = f.LastWriteTime,
                                Size = f.Length
                            })
                            .ToList();

                        return files;
                    }
                    finally
                    {
                        sftp.Disconnect();
                    }
                });
            });
        }

        public async Task<(List<FtpFileInfo> data, int totalCount)> GetFilesAsync(FtpFilePagination pagination)
        {
            var allFiles = await GetFolderListingAsync(pagination.Folder, pagination.ForceRefresh) ?? new List<FtpFileInfo>();

            var page = allFiles
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToList();

            return (page, allFiles.Count);
        }

        public Task<(byte[] content, string fileName)> DownloadFileAsync(string folder, string fileName)
        {
            return Task.Run(() =>
            {
                using var sftp = CreateClient();
                sftp.Connect();
                try
                {
                    var currentFolderName = string.IsNullOrEmpty(_rootFolder)
                        ? folder
                        : $"{_rootFolder}/{folder}";
                    sftp.ChangeDirectory(currentFolderName);

                    using var stream = new MemoryStream();
                    sftp.DownloadFile(fileName, stream);
                    return (stream.ToArray(), fileName);
                }
                finally
                {
                    sftp.Disconnect();
                }
            });
        }
    }
}
