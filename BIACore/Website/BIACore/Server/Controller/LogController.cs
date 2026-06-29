using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using BIACore.Model;

namespace BIACore.Server.Controller
{
    public partial class LogController : BIACore.Web.Controller.BaseController
    {
        public override string Connection { get { return Connections.Log; } }
    }
}
