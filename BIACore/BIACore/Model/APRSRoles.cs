using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIACore.Model
{
    public class APRSRoles
    {
        public bool isSecured { get; set; }
        public List<string> roles { get; set; }

        public APRSRoles()
        {
            roles = new List<string>();
        }
    }
}
