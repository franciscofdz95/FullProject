using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BIACore.Website.Controller.Security
{
    public partial class AppSecurityController : BIACore.Web.Controller.BaseController
    {
        public override string Connection
        {
            get { return Connections.Security; }
        }
    }
}