using System;
using System.Web;
using System.Web.Http;

namespace BIACore.Internal
{
    class LocalhostController : ApiController
    {
        [HttpPost]
        [ActionName("Logout")]

        //TODO: Verify if this code is still needed, looks to be in the BIACoreModule.cs Router method M.Erdmann 1/20/2020
        public void Logout_Post()
        {
            HttpCookie lhTokenCookie = HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE];
            if (lhTokenCookie != null)
            {
                lhTokenCookie.Value = null;
                lhTokenCookie.Expires = DateTime.Now.AddDays(-1);
                //lhTokenCookie.Domain = "localhost";
                HttpContext.Current.Response.SetCookie(lhTokenCookie);
            }
        }
    }
}
