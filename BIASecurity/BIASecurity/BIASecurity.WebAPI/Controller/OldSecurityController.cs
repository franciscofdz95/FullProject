using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;

using BIASecurity.WebAPI;

namespace BIASecurity.WebAPI.Controller
{
    public partial class OldSecurityController : BIACore.Web.Controller.BaseController
    {
        public override string Connection
        {
            get { return Connections.OldSecurity; }
        }
    }
}