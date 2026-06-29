using BIACore.Provider;
using BIACore.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BIACore.Website
{
    public partial class UploadValidationTest : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                // direct connection?
                List<dynamic> extensions = SQL.Execute<dynamic>(BIACore.Server.Connections.NewSecurity, "intObject.usp_GetUploadExtension", null);
                
                foreach(string extension in extensions.Select(x => x.file_extension.ToString()).Distinct())
                {
                    listFileExtension.Items.Add(extension);
                }
            }
        }

        protected void btnUpload_Click(object sender, EventArgs e)
        {
            StringBuilder responseString = new StringBuilder();

            try
            {
                if (uplFileUpload.HasFile)
                {
                    string validExtensions = !string.IsNullOrWhiteSpace(listFileExtension.SelectedValue) ? listFileExtension.SelectedValue : null;
                    int? maxFileBytes = null;
                    if (int.TryParse(txtMaxFileBytes.Text, out int temp))
                        maxFileBytes = temp;

                    UploadValidation.UploadValidationResponse validation = UploadValidation.Validate(uplFileUpload.PostedFile, validExtensions, maxFileBytes);

                    responseString.AppendLine("Success:      " + validation.Success.ToString());
                    responseString.AppendLine("Error Type:  " + ((validation.UploadValidationError != null) ? validation.UploadValidationError.ToString() : ""));
                    responseString.AppendLine("Message:     " + ((validation.Message != null) ? validation.Message.ToString() : ""));
                    responseString.AppendLine();
                    responseString.AppendLine("File type:    " + uplFileUpload.PostedFile.ContentType);
                    responseString.AppendLine("File length: " + uplFileUpload.PostedFile.ContentLength);
                    responseString.AppendLine("File name:  " + uplFileUpload.PostedFile.FileName);
                }
                else
                {
                    responseString.Append("No file received");
                }
            }
            catch (Exception ex)
            {
                responseString.Append("Unknown error:\n" + ex.ToString());
            }

            lblResult.Text = responseString.ToString();
            pnlResult.Visible = true;
        }
    }
}