using System;
using System.Collections.Generic;

namespace BIACore.Model
{
    public class User : UserBase
    {

        public List<dynamic> permissions { get; set; }
        public APRSRoles aprsRoles { get; set; }

        [Obsolete("Attribute will be removed", true)]
        public string authenticatedId { get; set; }
        [Obsolete("Attribute will be removed", true)]
        public string authenticatedFirstName { get; set; }
        [Obsolete("Attribute will be removed", true)]
        public string authenticatedLastName { get; set; }

        public User()
        {
            permissions = new List<dynamic>();
            aprsRoles = new APRSRoles();
        }
    }
}
