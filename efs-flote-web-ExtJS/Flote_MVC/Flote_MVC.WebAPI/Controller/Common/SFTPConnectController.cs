using Renci.SshNet;
using Renci.SshNet.Sftp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {

        /// <summary>
        /// Connect To SFTP Root directory Server
        /// </summary>
        [HttpPost]
        [ActionName("ConnectToSFTPRootDirectory")]
        public object ConnectToSFTPRootDirectory()
        {
            DataTable dtFtpFolder;
            try
            {
                using (SftpClient sftp = new SftpClient(ConfigurationManager.AppSettings["SFTPServerHostName"], Convert.ToInt32(ConfigurationManager.AppSettings["PortNumber"]),
                    ConfigurationManager.AppSettings["SFTPUserName"], ConfigurationManager.AppSettings["SFTPPassword"]))
                {
                    sftp.Connect();
                    sftp.ChangeDirectory(ConfigurationManager.AppSettings["SFTPFileFolder"]);
                    List<string> folderList = sftp.ListDirectory(sftp.WorkingDirectory).Select(s => s.FullName).ToList();
                    dtFtpFolder = new DataTable();
                    if (!dtFtpFolder.Columns.Contains("Key"))
                    {
                        DataColumn standard = new DataColumn("Key", typeof(int));
                        standard.DefaultValue = "0";
                        dtFtpFolder.Columns.Add(standard);
                    }
                    if (!dtFtpFolder.Columns.Contains("Value"))
                    {
                        DataColumn standard = new DataColumn("Value", typeof(string));
                        standard.DefaultValue = "";
                        dtFtpFolder.Columns.Add(standard);
                    }

                    for (int i = 0; i < folderList.Count; i++)
                    {
                        var linkText = folderList[i].Split('/')[3];
                        if (linkText != "" && linkText != "." && linkText != "..")
                        {
                            DataRow drow = dtFtpFolder.NewRow();
                            drow[0] = i;
                            drow[1] = linkText;
                            dtFtpFolder.Rows.Add(drow);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dtFtpFolder;
        }

        /// <summary>
        /// List of files based on the selected region
        /// </summary>
        /// <param name="selectedFolder"></param>
        [HttpPost]
        [ActionName("ConnectToSFTP")]
        public object ConnectToSFTP([FromBody] dynamic info)
        {
            DataTable dtFtpFile;
            try
            {
                if (info != null && info.selectedFolder.ToString() != "")
                {
                    using (SftpClient sftp = new SftpClient(ConfigurationManager.AppSettings["SFTPServerHostName"], Convert.ToInt32(ConfigurationManager.AppSettings["PortNumber"]),
                        ConfigurationManager.AppSettings["SFTPUserName"], ConfigurationManager.AppSettings["SFTPPassword"]))
                    {
                        sftp.Connect();
                        var currentFolderName = ConfigurationManager.AppSettings["SFTPFileFolder"] + "\\" + info.selectedFolder.ToString();
                        sftp.ChangeDirectory(currentFolderName);
                        List<string> fileList = (sftp.ListDirectory(sftp.WorkingDirectory).OrderByDescending(s => s.LastWriteTime).Select(s => s.FullName)).ToList();
                        dtFtpFile = new DataTable();
                        if (!dtFtpFile.Columns.Contains("Key"))
                        {
                            DataColumn standard = new DataColumn("Key", typeof(int));
                            standard.DefaultValue = "0";
                            dtFtpFile.Columns.Add(standard);
                        }
                        if (!dtFtpFile.Columns.Contains("Value"))
                        {
                            DataColumn standard = new DataColumn("Value", typeof(string));
                            standard.DefaultValue = "";
                            dtFtpFile.Columns.Add(standard);
                        }
                        if (!dtFtpFile.Columns.Contains("SelectedFolder"))
                        {
                            DataColumn standard = new DataColumn("SelectedFolder", typeof(string));
                            standard.DefaultValue = "";
                            dtFtpFile.Columns.Add(standard);
                        }
                        for (int i = 0; i < fileList.Count; i++)
                        {
                            var linkText = fileList[i].Split('/')[4];
                            if (linkText != "" && linkText != "." && linkText != "..")
                            {
                                DataRow drow = dtFtpFile.NewRow();
                                drow[0] = i;
                                drow[1] = linkText;
                                drow[2] = info.selectedFolder.ToString();
                                dtFtpFile.Rows.Add(drow);
                            }

                        }

                    }
                }
                else { dtFtpFile = new DataTable(); }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dtFtpFile;
        }

        /// <summary>
        /// Download file based on File Name
        /// </summary>
        /// <param name="fileName"></param>
        [HttpGet]
        [ActionName("DownLoadFile")]
        public HttpResponse DownLoadFile(string fileName, string selectedFolder)
        {
            HttpResponse response = HttpContext.Current.Response;
            try
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
                        response.Clear();
                        response.ContentType = "application/octet-stream";
                        response.AddHeader("Content-Disposition", "attachment; filename=" + fileName);
                        response.BinaryWrite(stream.ToArray());
                        response.End();
                        response.Close();
                        sftp.Disconnect();
                    }

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return response;
        }


    }
}
