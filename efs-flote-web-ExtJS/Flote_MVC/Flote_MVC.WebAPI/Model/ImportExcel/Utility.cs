using Renci.SshNet;
using System;
using System.Configuration;
using System.IO;
using System.Net;

namespace Flote.WebAPI.WebAPI.Model
{
    public static class Utility
    {
        public static void ExpireExcelFiles(string sPath)
        {
            string[] aFile = Directory.GetFiles(sPath, "*.xls");
            foreach (string sFile in aFile)
            {
                FileInfo fi = new FileInfo(sFile);
                if ((DateTime.Now - fi.CreationTime).TotalHours > 12)
                {
                    
                    using (SftpClient sftpClient = new SftpClient(ConfigurationManager.AppSettings["NetworkDriveName"], Properties.Settings.Default.FTPUserIdDev, Properties.Settings.Default.FTPUserPSWDev))
                    {
                        sftpClient.Connect();
                        var networkDriveDeleteFolder = "/" + ConfigurationManager.AppSettings["SFTPUserName"] + "/data";
                        sftpClient.ChangeDirectory(networkDriveDeleteFolder);
                        sftpClient.DeleteFile(fi.Name);
                        sftpClient.Disconnect();
                    }                    
                }
            }
        }
    }
}