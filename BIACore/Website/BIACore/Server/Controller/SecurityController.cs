using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

using BIACore.Web.Controller;
using BIACore.Model;

namespace BIACore.Server.Controller
{
    /// <summary>
    /// This is deprecated - I've moved everything over to individual Controller to "simplify" the support structures.
    /// Update all references; will need a bit of overlap to handle getting updated BIACore.dll's out.
    /// </summary>
    [Obsolete]
    public partial class SecurityController : ApiController
    {
    }
}
