using Renci.SshNet;
using System.IO;

namespace BIACore.Utility
{
    public class FTP
    {
        private static string FTPSITE
        {
            //get { return "ftp3bia.ups.com"; }
            get { return Settings.Agent.FtpPath; }
            set { FTPSITE = value; }
        }
        //{ get { return BIACore.Settings.Agent.FtpPath; } }

        private static string USERNAME
        {
            //get { return "BIA_FTP_TEP"; }
            get { return Settings.Agent.FtpUser; }
            set { USERNAME = value; }
        }
        //{ get { return BIACore.Settings.Agent.FtpUser; } }

        private static string PASSWORD
        {
            //get { return "imhotep12"; }
            get { return Settings.Agent.FtpPass; }
            set { PASSWORD = value; }
        }
        //{ get { return BIACore.Settings.Agent.FtpPass; } }

        public static void UploadFile(Stream stream, string fileName)
        {
            stream.Position = 0;

            using (SftpClient client = new SftpClient(FTPSITE, USERNAME, PASSWORD))
            {
                client.Connect();

                client.UploadFile(stream, fileName);
            }
        }

        public static MemoryStream GetFile(string fileName)
        {
            MemoryStream stream = new MemoryStream();

            using (SftpClient client = new SftpClient(FTPSITE, USERNAME, PASSWORD))
            {
                client.Connect();

                if (client.Exists(fileName))
                {
                    client.DownloadFile(fileName, stream);
                }
                else
                {
                    return null;
                }
            }

            stream.Position = 0;

            return stream;
        }

        public static bool DeleteFile(string fileName)
        {
            using (SftpClient client = new SftpClient(FTPSITE, USERNAME, PASSWORD))
            {
                client.Connect();

                if (client.Exists(fileName))
                {
                    client.DeleteFile(fileName);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

    }
}
