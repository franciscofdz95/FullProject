using BIACore.Internal;
using System;
using System.Collections.Generic;

namespace BIACore.Extensions
{
    public static class ExceptionExtensions
    {
        private const string DEFAULT_ERROR_CODE = "Mighty-Bronco";
        private const int CACHE_HOURS = 3;

        public static string GetBIAErrorCode(this Exception ex)
        {
            string sourceString = ex.GetType().ToString();
            string key = string.Format("ErrorCode_{0}", sourceString);
            string errorCode;

            if ((errorCode = (string)Cache.Get(key)) == null)
            {
                try
                {
                    dynamic codeName = Web.Client.Post<dynamic>(API.URL(API.CODE_NAME), new { SourceString = sourceString });

                    if (codeName != null && codeName.CodeName != null)
                    {
                        errorCode = (string)codeName.CodeName;
                        Cache.Set(key, errorCode, DateTime.UtcNow.AddHours(CACHE_HOURS));
                    }
                }
                catch (Exception codeNameException)
                {
                    // don't log again to prevent looping
                }
            }

            return errorCode ?? DEFAULT_ERROR_CODE;
        }
    }
}
