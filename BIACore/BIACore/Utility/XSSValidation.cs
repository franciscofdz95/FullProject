using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace BIACore.Utility
{
    public class XSSValidation
    {
        private static List<XssValidationType> xssValidationList {
            get {
                // TODO: replace with cached webservice call
                return new List<XssValidationType>()
                {
                        new XssValidationType() { Id = 2, Name = "JavaScript:", RegEx_Pattern = @"(=|%3d|%3D)[^a-zA-Z0-9]*(j|J|%6A|%6a|%4A|%4a)[^a-zA-Z0-9:]*(a|A|%61|%41)[^a-zA-Z0-9:]*(v|V|%56|%76)[^a-zA-Z0-9:]*(a|A|%61|%41)[^a-zA-Z0-9:]*(s|S|%73|%53)[^a-zA-Z0-9:]*(c|C|%63|%43)[^a-zA-Z0-9:]*(r|R|%72|%52)[^a-zA-Z0-9:]*(i|I|%69|%49)[^a-zA-Z0-9:]*(p|P|%70|%50)[^a-zA-Z0-9:]*(t|T|%54|%74)[^a-zA-Z0-9]*(:|&(colon|COLON)|%3(a|A)|\\(u|U)0{1,5}3(a|A))", Active = true},
                        new XssValidationType() { Id = 3, Name = "HTML JS OnError", RegEx_Pattern = "<.*(o|O)[^a-zA-Z0-9:]*(n|N)*(e|E)[^a-zA-Z0-9:]*(r|R)[^a-zA-Z0-9:]*(r|R).*(o|O)[^a-zA-Z0-9:]*(r|R)[^a-zA-Z0-9:]*=", Active = true},
                        new XssValidationType() { Id = 6, Name = "HTML JS OnFocus", RegEx_Pattern = "<.*(o|O)[^a-zA-Z0-9:]*(n|N)[^a-zA-Z0-9:]*(f|F)[^a-zA-Z0-9:]*(o|O)[^a-zA-Z0-9:]*(c|C)[^a-zA-Z0-9:]*(u|U)[^a-zA-Z0-9:]*(s|S)[^a-zA-Z0-9:]*=", Active = true},
                        new XssValidationType() { Id = 4, Name = "JS & Include", RegEx_Pattern = "&[^a-zA-Z0-9:]*{.*\\w", Active = true},
                        new XssValidationType() { Id = 5, Name = "HTML Script Tag", RegEx_Pattern = @"(\<|%3C|&#60;|\\(u|U)0{1,5}3(c|C)|&lt;|%2(f|F))[^a-zA-Z0-9]*(s|S)[^a-zA-Z0-9]*(c|C)[^a-zA-Z0-9]*(r|R)[^a-zA-Z0-9]*(i|I)[^a-zA-Z0-9]*(p|P)[^a-zA-Z0-9]*(t|T)", Active = true}
                };
            }
        }

        public static XssValidationResult CheckXssSafe(string request)
        {
            foreach (XssValidationType validation in xssValidationList)
            {
                if (validation.Active)
                {
                    Regex regex = new Regex(validation.RegEx_Pattern, RegexOptions.IgnoreCase);

                    if (regex.IsMatch(request))
                    {
                        return new XssValidationResult()
                        {
                            Success = false,
                            FailedValidationType = validation
                        };
                    }
                }
            }

            return new XssValidationResult()
            {
                Success = true
            };
        }

        public class XssValidationType
        {
            public int Id;
            public string Name;
            public string RegEx_Pattern;
            public bool Active;
        }

        public class XssValidationResult
        {
            public bool Success;
            public XssValidationType FailedValidationType;
        }
    }
}
