using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Server.Model;

namespace BIACore.Server.Controller
{
    public partial class FingerprintValueController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("GetFingerprintById")]
        public object GetFingerprintById_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Cached.FingerprintValueById(request != null && request.FingerprintId != null ? request.FingerprintId.ToString() : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/FingerprintValue/GetFingerprintById_Post", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("GetFingerprintByValue")]
        public object GetFingerprintByValue_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Cached.FingerprintValueByValue(request != null && request.Value != null ? request.Value.ToString() : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/FingerprintValue/GetFingerprintByValue_Post", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("FingerprintUsageLog")]
        public object FingerprintUsageLog_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Uncached.FingerprintUsageLog(
                    request != null && request.FingerprintId != null ? request.FingerprintId.ToString() : null,
                    request != null && request.AppCode != null ? request.AppCode.ToString() : null,
                    request != null && request.UserId != null ? request.UserId.ToString() : null
                );
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/FingerprintValue/FingerprintUsageLog_Post", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
        [AllowAnonymous]
        [HttpPost]
        [ActionName("AddWhiteboardValue")]
        public object AddWhiteboardValue_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Uncached.WhiteboardAddValue(request != null && request.Value != null ? request.Value.ToString() : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/FingerprintValue/GetFingerprintById_Post", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("GetWhiteboardById")]
        public object GetWhiteboardById_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Uncached.WhiteboardGetById(request != null && request.FingerprintId != null ? request.FingerprintId.ToString() : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/FingerprintValue/GetFingerprintByValue_Post", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}