using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BIASecurity.WebSite
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string eamUser = HttpContext.Current.Request.Headers["NW_USER"]; //API.EAM_HEADER = AD ID (ex. 'adm1mme')

            if (!string.IsNullOrWhiteSpace(eamUser))
            {
                WebAPI.Controller.BIASecurityController controller = new WebAPI.Controller.BIASecurityController();

                //Check for existing user
                dynamic user = controller.getUserByEmpId(eamUser);
                if (user == null)
                {
                    //Call the internal method passing the ADID
                    object result = controller.addUserByEmpId(eamUser);

                    //on success redirect to BIASecurity
                    if (result != null)
                    {
                        Response.Redirect("~", true);
                    }
                    else
                    {
                        main.InnerText = "Failed to insert user (" + eamUser + ")";
                    }
                }
                else
                {
                    Response.Redirect("~", true);
                }
            }
            else
            {
                main.InnerText = "Could not find user id from EAM/BIACore";
            }
        }
    }
}