using System;

namespace Keystone.DAL.Model
{
    public class FtpFolderInfo
    {
        public string Name { get; set; }
    }

    public class FtpFileInfo
    {
        public string FileName { get; set; }
        public DateTime LastModified { get; set; }
        public long Size { get; set; }
    }

    public class FtpFilePagination
    {
        public string Folder { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public bool ForceRefresh { get; set; }
    }
}
