using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BIACore.Website
{
    public partial class RequestAccess : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string testnet = "https://iiq-testnet.inside.ams1907.com/iiqcertification";
            string prod = "https://iiq.inside.ups.com/iiqcertification/";

            iiqLink.HRef = BIACore.Settings.Config.Testnet ? testnet : prod;
            iiqLink.InnerHtml = BIACore.Settings.Config.Testnet ? testnet : prod;

            string appCode = Request.QueryString.Get("AppCode");
            string requestID = Request.QueryString.Get("ID");

            if (!string.IsNullOrWhiteSpace(appCode))
                ApplicationName.InnerHtml = string.Format("You do not have access to <span style='color: red'>{0}</span> in IIQ.", HttpUtility.HtmlEncode(appCode));

            //else
            //    ApplicationName.InnerHtml = "IIQ roles are required for accessing BIA applications.";

            if (!string.IsNullOrWhiteSpace(requestID) && requestID == "BIA")
            {
                requestIIQ.Visible = false;
                instructIIQ.Visible = false;

            }                

            else if (!string.IsNullOrWhiteSpace(requestID) && requestID == "IIQ")
            {
                requestBIA.Visible = false;
                instructBIA.Visible = false;
            }                  
        }
    }
}