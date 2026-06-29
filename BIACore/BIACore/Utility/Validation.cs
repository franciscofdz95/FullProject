using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace BIACore.Utility
{

    /// <summary>
    /// The Validation classes used for various string validations.
    /// </summary>
    public static class Validation
    {

        /// <summary>
        /// The ValidateString method used to validate standard strings.
        /// </summary>
        public static bool ValidateString(string value)
        {
            if (value.ToLower().Contains("&lt;")
                || value.ToLower().Contains("&gt;")
                || value.ToLower().Contains("src=")
                ) return false;
            //if (value.)

            
            // This regex finds strings that have HTML event JS "on" injections.
            Regex rx = new Regex(@"on\w+\s*(=|&eq;|%3d)\s*\'?""?\s*\w+\s*\(", RegexOptions.Compiled | RegexOptions.IgnoreCase);



            if (rx.IsMatch(value)) return false;

            return true;

        }

    }
}
