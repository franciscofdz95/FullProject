using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BIACore.Extensions;
using BIACore.Model;
using BIACore.Provider;
using BIACore.Server.Model;

namespace BIACore.Server.Controller
{
    public partial class SmartFilterController : BIACore.Web.Controller.BaseController
    {
        public override string Connection { get { return Connections.NewSecurity; } }
    }
}
