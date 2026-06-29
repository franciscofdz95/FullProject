using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BIACore.Server.Controller
{
    public partial class UtilityController
    {

        [AllowAnonymous]
        [HttpPost]
        [DisableCors]
        [ActionName("Encrypt")]
        public object UtilityEncrypt_Post([FromBody] dynamic request)
        {

            DateTime start = DateTime.UtcNow;

            try
            {

                return BIACore.Utility.Encryption.Hashicorp.EncryptInternal(request != null && request.AuthKey != null ? request.AuthKey.Value.ToString() : null).Result;

            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
            finally
            {
                LogFactory.Performance("biacore/api/utility/encrypt", DateTime.UtcNow.Subtract(start).TotalSeconds);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [DisableCors]
        [ActionName("Decrypt")]
        public object UtilityDecrypt_Post([FromBody] dynamic request)
        {

            //DateTime start = DateTime.UtcNow;

            try
            {
                //return request.EncryptString.ToString();
                return BIACore.Utility.Encryption.Hashicorp.DecryptInternal(request != null && request.EncryptString != null ? request.EncryptString.ToString() : null).Result;

            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
            //finally
            //{
            //    LogFactory.Performance("biacore/api/utility/Decrypt", DateTime.UtcNow.Subtract(start).TotalSeconds);
            //}
        }


    }

}
