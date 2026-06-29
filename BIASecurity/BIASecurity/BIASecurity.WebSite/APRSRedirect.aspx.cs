using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BIACore.Extensions;
using BIACore.Model;
//using System.Configuration;

namespace BIASecurity.WebSite
{

    public partial class APRSRedirect : System.Web.UI.Page
    {

        protected void Page_Load(object sender, EventArgs e)
        {

            String appCode = "";

            //Response.Write("Application ID: [" + Request.QueryString["AppId"] + "]");


            try { 
                Dictionary<string, object> APRSResults = BIACore.Provider.SQL.ExecuteSQLRaw(BIASecurity.WebAPI.Connections.BIASecurity, "appObject.GetAPRSApplicationId", new DBParameter[]
                    { new DBParameter("@APRSAppId", DbType.AnsiString, Request.QueryString["AppId"].Trim()) });

                appCode = APRSResults["AppCode"].ToString();
            }
            catch(Exception)
            {
                //Do Nothing
            }

            //Response.Write(appCode);
            //Response.Flush();

            //Redirect to either BIA User Maint Request Access for the correct AppCode or to the Request App List page.
            if (appCode.IsNullOrEmpty() || String.IsNullOrEmpty(Request.QueryString["AppId"]))
                {
                    Response.Redirect(string.Format("https://bia.inside.ups.com/bia/apps/BIASecurity/index.cfm?action=UserAdmin.ApplicationUserGeoAccess&sysm={0}&fName={1}&lName={2}&modal=false", BIACore.Security.User.userId, BIACore.Security.User.lastName, BIACore.Security.User.firstName));
                }
                else
                {
                    Response.Redirect(string.Format("https://bia.inside.ups.com/bia/apps/BIASecurity/index.cfm?action=UserAdmin.RequestApplicationUserGeoAccess&sysm={0}&fName={1}&lName={2}&modal=false&appCode={3}&appName={3}", BIACore.Security.User.userId, BIACore.Security.User.lastName, BIACore.Security.User.firstName, appCode));
                }

        }
    }
}