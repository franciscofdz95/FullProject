using Renci.SshNet;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Flote.WebSite
{
    public partial class FTPFilesFolder : System.Web.UI.Page
    {
     
        protected void Page_Load(object sender, EventArgs e)
        {
            ConnectToSFTPRootDirectory();
        }

        /// <summary>
        /// Connect To SFTP Root directory Server
        /// </summary>
        private void ConnectToSFTPRootDirectory()
        {
            try
            {
                using (SftpClient sftp = new SftpClient(ConfigurationManager.AppSettings["SFTPServerHostName"], Convert.ToInt32(ConfigurationManager.AppSettings["PortNumber"]),
                    ConfigurationManager.AppSettings["SFTPUserName"], ConfigurationManager.AppSettings["SFTPPassword"]))
                {
                    sftp.Connect();
                    sftp.ChangeDirectory(ConfigurationManager.AppSettings["SFTPFileFolder"]);

                    List<string> fileList = sftp.ListDirectory(sftp.WorkingDirectory).Select(s => s.FullName).ToList();
                    for (int i = 0; i < fileList.Count; i++)
                    {
                        LinkButton linkFtpFileFolder = new LinkButton();
                        var linkText = fileList[i].Split('/')[3];
                        linkFtpFileFolder.Text = linkText;
                        linkFtpFileFolder.ToolTip = linkText;
                        linkFtpFileFolder.Font.Bold = true;
                        linkFtpFileFolder.Style.Add("line-height", "150%");
                        if (linkFtpFileFolder.Text.Length > 2)
                        {
                            linkFtpFileFolder.Click += new System.EventHandler(linkFtpFileFolder_Click);
                            FTPFolderPlaceHolder.Controls.Add(linkFtpFileFolder);
                            FTPFolderPlaceHolder.Controls.Add(new LiteralControl("<br />"));
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
        /// Get all the filed based on the region
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void linkFtpFileFolder_Click(object sender, EventArgs e)
        {
            string selectedfolder = ((LinkButton)sender).Text; 
            //Open in new window
            Response.Write("<script>window.open ('FTPFilesView.aspx?selectedfolder=" + selectedfolder + "','_blank');</script>");
        }


    }
}