using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIACore.Internal
{
    internal static partial class Request
    {

        internal static string Encrypt(string authKey)
        {
#if LocalTest
            return LocalRequest.FingerprintValueById(FingerprintId);
#else
            dynamic result = Web.Client.Post<dynamic>(API.URL(API.HASHICORP_ENCRYPT), new { AuthKey = authKey }, false);
            return result;
#endif
        }

        internal static string Decrypt(string encryptString)
        {
#if LocalTest
            return LocalRequest.FingerprintValueById(FingerprintId);
#else
            dynamic result = Web.Client.Post<dynamic>(API.URL(API.HASHICORP_DECRYPT), new { EncryptString = encryptString }, false);
            return result;
#endif
        }
    }
}
