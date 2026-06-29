using Renci.SshNet;
using System;
using System.Configuration;
using System.IO;
using System.Web;
using System.Web.Configuration;
using System.Web.Script.Serialization;
using static BIACore.Utility.UploadValidation;

namespace ImportExcel
{
    public partial class Upload : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            HttpContext context = HttpContext.Current;
            MessageOb result = new MessageOb();
            result.success = false;
            string fname = "";
            string zipname = "";
            string targetPath = "";
            try
            {
                if (HttpContext.Current.Request.Files.Count == 0)
                {
                    result.message = "File upload is not successfull.";
                }

                if (context.Request.Files.Count > 0)
                {
                    HttpPostedFile file = HttpContext.Current.Request.Files[0];
                    UploadValidationResponse validation = BIACore.Utility.UploadValidation.Validate(file);
                    if (!validation.Success)
                    {
                        result.message = validation.Message;
                    }

                    //check file was submitted
                    if (file != null && file.ContentLength > 0)
                    {
                        fname = Path.GetFileName(file.FileName);

                        if (fname.Contains(".xls"))
                        {
                            Guid newGuid = Guid.NewGuid();

                            //Save to local folder
                            var localDrivePath = "";
                            string localUploadPath = WebConfigurationManager.AppSettings["UploadBatchFolderDev"].ToString();
                            localDrivePath = localUploadPath + @"\" + fname;
                            file.SaveAs(localDrivePath);

                            //Upload to FTP Network path
                            string networkDrivePath = ConfigurationManager.AppSettings["NetworkDriveName"] + "\\ftp\\FLOTE";
                            string networkDriveFolderPath = Path.Combine(@"\\" + networkDrivePath + "", "data");
                            if (!Directory.Exists(networkDriveFolderPath))
                                Directory.CreateDirectory(networkDriveFolderPath);
                            var newFileName = Path.Combine(newGuid + ".xls");
                            targetPath = Path.Combine(networkDriveFolderPath, newFileName);

                            var networkDriveUploadFolder = "/" + ConfigurationManager.AppSettings["SFTPUserName"] + "/data";

                            using (SftpClient networkDriveFTPDev = new SftpClient(ConfigurationManager.AppSettings["NetworkDriveName"], ConfigurationManager.AppSettings["SFTPUserName"], ConfigurationManager.AppSettings["SFTPPassword"]))
                            {
                                networkDriveFTPDev.Connect();
                                var memoryStream = new MemoryStream(File.ReadAllBytes(localDrivePath));
                                networkDriveFTPDev.ChangeDirectory(networkDriveUploadFolder);
                                networkDriveFTPDev.UploadFile(memoryStream, newFileName);
                            }
                            result.success = true;
                            result.filename = fname;
                            result.zipname = zipname;
                            result.loadname = targetPath;
                            result.message = string.Empty;
                            Literal1.Text = JsonHelper.Serialize<MessageOb>(result);
                        }
                        else
                        {
                            result.success = false;
                            result.filename = fname;
                            result.zipname = zipname;
                            result.loadname = targetPath;
                            result.message = "Invalid File Format, Please select correct excel file.";
                            Literal1.Text = JsonHelper.Serialize<MessageOb>(result);
                        }

                    }

                }
            }
            catch (Exception ex)
            {
                result.success = false;
                result.message = ex.Message;
            }
            Literal1.Text = JsonHelper.Serialize<MessageOb>(result);
        }


    }
    public class MessageOb
    {
        public bool success { get; set; }
        public string filename { get; set; }
        public string zipname { get; set; }
        public string loadname { get; set; }
        public string message { get; set; }

    }
    public static class JsonHelper
    {
        public static string Serialize<T>(T obj)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return serializer.Serialize(obj);
        }

    }

}