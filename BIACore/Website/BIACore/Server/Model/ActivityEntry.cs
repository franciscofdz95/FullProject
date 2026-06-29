using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Threading;
using System.Net.Http;
using System.Dynamic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BIACore.Model;

namespace BIACore.Server.Model
{
    public class ActivityEntry : Entry
    {
        public string AppCode { get; set; }
        public string UserId { get; set; }

        public string Page { get; set; }
        public string Group { get; set; }
        public string Object { get; set; }

        public string IpAddress { get; set; }
        public string Browser { get; set; }
        public string Params { get; set; }
        public string TokenLocal { get; set; }
        //public Guid? SessionId { get; set; }
        //public string SecHash { get; set; }

        public ActivityEntry() { }

        internal override void Insert_SQL()
        {
            try
            {
                // don't use the provider based calls here - otherwise we get into nasty logging loops.
                // and nobody wants that.
                TransformProperties();

                System.Diagnostics.Debug.WriteLine(String.Format("Activity Log Record: AppCode={0}, UserId={1}, IpAddress={2}, Browser={3}, Page={4}, Group={5}, Object={6}, Params={7}, SessionId={8}{9}", AppCode, UserId, IpAddress, Browser, Page, Group, Object, Params, Web.CurrentContext.GetLocalHostTokenCookieValue(), Web.CurrentContext.GetSessionCookieValue()));

                BIACore.Provider.SQL.ExecuteSQLRaw(Connections.Security, "logObject.LogInsert", CommandType.StoredProcedure, true, new DBParameter[] {
                    new DBParameter("@appCode",DbType.AnsiString,AppCode),
                    new DBParameter("@biaUserID",DbType.AnsiString,UserId),
                    new DBParameter("@ipAddress",DbType.AnsiString,IpAddress),
                    new DBParameter("@browser",DbType.AnsiString,Browser),
                    new DBParameter("@pageName",DbType.AnsiString,Page),
                    new DBParameter("@params",DbType.AnsiString,Params),
                    new DBParameter("@groupName",DbType.AnsiString,Group),
                    new DBParameter("@objectName",DbType.AnsiString,Object)
                });
            }
            catch (Exception e)
            {
                LogEntry log = new LogEntry()
                {
                    TransactionId = Log.LogFactory.TransactionId,
                    UserId = UserId,
                    AppCode = AppCode,
                    Level = Log.LogLevel.Exception,
                    Event = "BIACore.Server.Model.ActivityEntry.Insert_SQL",
                    Detail = string.Format("{0}: {1}{2}{3}",
                        e.GetType().ToString(),
                        e.Message,
                        Environment.NewLine,
                        e.StackTrace
                    )
                };

                log.Insert_SQL();
            }
        }

        internal void TransformProperties()
        {
            if(UserId != null) UserId = UserId.Replace("{unknown}", null);

            try
            {
                try
                {
                    dynamic data = JsonConvert.DeserializeObject(Params);

                    data.Cookies = null;
                    string apiId = GetApiID(Page);
                    if (!string.IsNullOrWhiteSpace(apiId)) data.apiId = apiId;
                    if (data.SessionId != null) data.SessionId = "{SessionId}";

                    try
                    {

                        data.Content = JsonConvert.DeserializeObject(data.Content);
                        if (((object)data.Content).GetType().GetProperties().Select((p) => p.Name == "Pass") != null &&
                            data.Content.Pass != null &&
                            ((object)data.Content).GetType().GetProperties().Select((p) => p.Name == "User") != null &&
                            data.Content.User != null)
                        {
                            data.Content.Pass = "{pass}";
                        }

                        data.Content = JsonConvert.SerializeObject(data.Content);
                    }
                    catch { }

                    Params = JsonConvert.SerializeObject(data);
                }
                catch { }

                Params = new string(Params.Where(c => c != '\u0000').ToArray());

                this.Group = GetRequestGroup(this);
                this.Object = GetRequestObject(this);
                Page = GetRequestPath(this);
            }
            catch (Exception e)
            {
                LogEntry log = new LogEntry()
                {
                    TransactionId = Log.LogFactory.TransactionId,
                    UserId = UserId,
                    AppCode = AppCode,
                    Level = Log.LogLevel.Exception,
                    Event = "BIACore.Server.Model.ActivityEntry.TransformProperties",
                    Detail = string.Format("{0}: {1}{2}{3}",
                        e.GetType().ToString(),
                        e.Message,
                        Environment.NewLine,
                        e.StackTrace
                    )
                };

                log.Insert_SQL();
            }

            Params = Params.TrimEnd('\0');
        }

        internal static string GetApiID(string path)
        {
            string apiID = "";

            try
            {
                if (path.IndexOf("/api/") > -1)
                {
                    string[] pathParts = path.Substring(path.IndexOf("api/") + 4).Split('/');
                    apiID = pathParts[2];
                }
            }
            catch (Exception ex) { }

            return apiID;
        }

        internal static string GetRequestPath(ActivityEntry me)
        {
            string p = me.Page;
            string appCode = GetAppCodeReplacement(me);
            string path = GetPathAfterAppCode(me, appCode);
            string[] pathParts = path.Split('/');

            if (path.IndexOf("api/") > -1 && pathParts.Length > 3)
            {
                p = p.Substring(0, p.LastIndexOf('/'));
            }

            return p;
        }

        internal static string GetRequestGroup(ActivityEntry me)
        {
            string group = "";
            string appCode = GetAppCodeReplacement(me);
            int groupEndIndex = 0;
            string path = GetPathAfterAppCode(me, appCode);
            string[] pathParts = path.Split('/');
            int apiIndex = pathParts.ToList<string>().IndexOf("api");

            if (apiIndex > -1)
            {
                if (pathParts.Length - 1 - apiIndex <= 1) groupEndIndex = apiIndex - 1;
                else groupEndIndex = pathParts.Length - 1;
            }

            if (groupEndIndex > 0)
            {
                group = String.Join("/", 
                            pathParts.Where((part, index) => 
                                (
                                    (apiIndex == -1 && index <= groupEndIndex)
                                ||  (apiIndex > -1 && apiIndex < groupEndIndex && index > apiIndex && index < groupEndIndex)
                                ||  (apiIndex > -1 && apiIndex > groupEndIndex && index <= groupEndIndex)
                                )
                                && part.ToLower().Replace("/", "") != "apps" 
                            ).ToArray()
                        );
            }
            else if (pathParts.Length == 1) group = me.AppCode;
            else group = pathParts[0];

            return group;
        }

        internal static string GetRequestObject(ActivityEntry me)
        {
            string obj = "";
            string appCode = GetAppCodeReplacement(me);
            string path = GetPathAfterAppCode(me, appCode);
            string[] pathParts = path.Split('/');
            int objIndex = pathParts.Length - 1;

            if (path.IndexOf("api/") > -1 && pathParts.Length > 3) objIndex = pathParts.Length - 2;
            else if (pathParts.Length == 1) objIndex = 0;

            obj = pathParts[objIndex];

            return obj;
        }

        internal static string GetPathAfterAppCode(ActivityEntry me, string appCode)
        {
            return me == null ? "" : (me.Page.Substring(me.Page.ToLower().IndexOf(appCode.ToLower() + "/") > -1 ? me.Page.ToLower().IndexOf(appCode.ToLower() + "/") + appCode.Length + 1 : 0));
        }

        internal static string GetAppCodeReplacement(ActivityEntry me)
        {
            return me == null || me.AppCode == null ? "" : (me.AppCode.ToLower() == "biasecurity" ? "biacore/2.0" : me.AppCode);
        }
    }
}
