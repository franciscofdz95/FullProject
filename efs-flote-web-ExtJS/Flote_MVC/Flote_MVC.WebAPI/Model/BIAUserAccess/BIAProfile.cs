using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;
using Newtonsoft.Json;

namespace Flote.WebAPI.Model.BIAUserAccess
{
    public class BIAProfile : extjs.Parameter
    {
        public string BIA_ID { get; set; }
        public string EA_ProfileId { get; set; }
        public int EA_E2K_UserID { get; set; }
    }

}


