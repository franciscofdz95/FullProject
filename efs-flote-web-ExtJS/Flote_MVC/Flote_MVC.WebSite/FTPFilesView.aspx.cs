using Renci.SshNet;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Flote.WebSite
{
    public partial class FTPFilesView : System.Web.UI.Page
    {
        #region SFTP Configuration       
        public string selectedFolder { get; set; }
        #endregion
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(Request.QueryString["selectedfolder"]))
            {
                selectedFolder = Request.QueryString["selectedfolder"].ToString();
                selectedFolderLable.Text = selectedFolder.ToUpper();
                ConnectToSFTP(selectedFolder);
            }
        }

        /// <summary>
        /// List of files based on the selected region
        /// </summary>
        /// <param name="selectedFolder"></param>
        private void ConnectToSFTP(string selectedFolder)
        {
            try
            {
                using (SftpClient sftp = new SftpClient(ConfigurationManager.AppSettings["SFTPServerHostName"], Convert.ToInt32(ConfigurationManager.AppSettings["PortNumber"]),
                    ConfigurationManager.AppSettings["SFTPUserName"], ConfigurationManager.AppSettings["SFTPPassword"]))
                {
                    sftp.Connect();
                    var currentFolderName = ConfigurationManager.AppSettings["SFTPFileFolder"] + "\\" + selectedFolder;
                    sftp.ChangeDirectory(currentFolderName);
                    List<string> fileList = (sftp.ListDirectory(sftp.WorkingDirectory).OrderByDescending(s => s.LastWriteTime).Select(s => s.FullName)).ToList();
                    for (int i = 0; i < fileList.Count; i++)
                    {
                        LinkButton linkFtpFile = new LinkButton();
                        var linkText = fileList[i].Split('/')[4];
                        linkFtpFile.Text = linkText;
                        linkFtpFile.ToolTip = linkText;
                        linkFtpFile.Font.Bold = true;
                        linkFtpFile.Style.Add("line-height", "150%");
                        if (linkFtpFile.Text.Length > 2)
                        {
                            linkFtpFile.Click += new System.EventHandler(linkFtpFile_Click);
                            FTPFilesPlaceHolder.Controls.Add(linkFtpFile);
                            FTPFilesPlaceHolder.Controls.Add(new LiteralControl("<br />"));
                        }

                    }

                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
            }
        }

        /// <summary>
        /// Get file name to download the file
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void linkFtpFile_Click(object sender, EventArgs e)
        {
            string fileName = ((LinkButton)sender).Text;
            DownLoadFile(fileName);
        }


        /// <summary>
        /// Download file based on File Name
        /// </summary>
        /// <param name="fileName"></param>
        private void DownLoadFile(string fileName)
        {

            using (SftpClient sftp = new SftpClient(ConfigurationManager.AppSettings["SFTPServerHostName"], Convert.ToInt32(ConfigurationManager.AppSettings["PortNumber"]),
                    ConfigurationManager.AppSettings["SFTPUserName"], ConfigurationManager.AppSettings["SFTPPassword"]))
            {
                using (MemoryStream stream = new MemoryStream())
                {
                    sftp.Connect();
                    var currentFolderName = ConfigurationManager.AppSettings["SFTPFileFolder"] + "\\" + selectedFolder;
                    sftp.ChangeDirectory(currentFolderName);

                    sftp.DownloadFile(fileName, stream, null);

                    //Content response on browser
                    Response.Clear();
                    Response.ContentType = "application/octet-stream";
                    Response.AddHeader("Content-Disposition", "attachment; filename=" + fileName);
                    Response.BinaryWrite(stream.ToArray());
                    Response.End();
                    Response.Close();
                    sftp.Disconnect();
                }
            }
        }

    }
}