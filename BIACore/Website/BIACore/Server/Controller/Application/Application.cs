using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;

using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

using BIACore.Model;
using BIACore.Extensions;
using Newtonsoft.Json;

namespace BIACore.Server.Controller
{
    public partial class ApplicationController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("ApplicationBase")]
        public ApplicationBase ApplicationBase_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                return Cached.ApplicationBase(
                    SessionId,
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null);
            }
            catch (Exception e)
            {
                LogFactory.Message(String.Format("SessionId: {0}, AppCode: {1}, Request: {2}", Web.CurrentContext.GetSessionCookieValue(),
                     (request != null && request.AppCode != null) ? request.AppCode.Value : null, Newtonsoft.Json.JsonConvert.SerializeObject(request)));
                LogFactory.Exception(e);
                throw;
            }
            finally { LogFactory.Performance("biacore/api/applicationbase", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("Application")]
        public Application Application_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                return Cached.Application(
                    SessionId,
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null);
            }
            catch (Exception e)
            {
                LogFactory.Message(String.Format("SessionId: {0}, AppCode: {1}, Request: {2}", Web.CurrentContext.GetSessionCookieValue(),
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null), Newtonsoft.Json.JsonConvert.SerializeObject(request));
                LogFactory.Exception(e);
                throw;
            }
            finally { LogFactory.Performance("biacore/api/application", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("ApplicationUserAccess")]
        public object ApplicationUserAccess_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return new
                {
                    userAccess = Cached.ApplicationUserAccess(
                    (request != null && request.UserId != null) ? request.UserId.Value : null,
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null)
                };
            }
            catch (Exception e)
            {
                LogFactory.Message(String.Format("UserId: {0}, AppCode: {1}, Request: {2}", (request != null && request.UserId != null) ? request.UserId.Value : "",
                    (request != null && request.AppCode != null) ? request.AppCode.Value : "", Newtonsoft.Json.JsonConvert.SerializeObject(request)));
                LogFactory.Exception(e);
                throw;
            }
            finally { LogFactory.Performance("biacore/api/applicationuseraccess", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("ApplicationUserList")]
        public object ApplicationUserList_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return new
                {
                    userList = Cached.ApplicationUserList(
                    (request != null && request.UserId != null) ? request.UserId.Value : null)
                };
            }
            catch (Exception e)
            {
                LogFactory.Message(String.Format("UserId: {0}, Request: {1}", (request != null && request.UserId != null) ? request.UserId.Value : "",
                    Newtonsoft.Json.JsonConvert.SerializeObject(request)));
                LogFactory.Exception(e);
                throw;
            }
            finally { LogFactory.Performance("biacore/api/applicationuserlist", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("ApplicationConnections")]
        public object ApplicationConnections_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Uncached.GetApplicationConnections(
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null,
                    (request != null && request.Environment != null) ? request.Environment.Value : null,
                    (request != null && request.LogSQL != null) ? request.LogSQL.Value : false);
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                //LogFactory.Message(String.Format("AppCode: {1}, Environment: {0}, Request: {2}", (request != null && request.Environment != null) ? request.Environment.Value : "",
                //    (request != null && request.AppCode != null) ? request.AppCode.Value : "", Newtonsoft.Json.JsonConvert.SerializeObject(request)));
                throw;
            }
            finally {
                if ((request != null && request.LogSQL != null) ? request.LogSQL.Value : BIACore.Settings.Log.Sql)
                    LogFactory.Performance("biacore/api/applicationconnections", DateTime.UtcNow.Subtract(start).TotalSeconds);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [DisableCors]
        [ActionName("Azure")]
        public object ApplicationAzure_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Uncached.GetApplicationAzure(
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null,
                    (request != null && request.Environment != null) ? request.Environment.Value : null);
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
            finally
            {
                if ((request != null && request.LogSQL != null) ? request.LogSQL.Value : BIACore.Settings.Log.Sql)
                    LogFactory.Performance("biacore/api/applicationazure", DateTime.UtcNow.Subtract(start).TotalSeconds);
            }
        }
    }
}