using BIACore;
using BIACore.Agent.Task;
using BIACore.Model;
using BIACore.Provider;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BIAService.Task
{
    public class AppPing : BaseTask
    {
        public override TimeSpan Interval { get { return new TimeSpan(0, 5, 0); } set { } }

        public AppPing()
        {

        }
        public override void Run()
        {
            try
            {
                var envServerNodeAppList = GetEnvServerNodeAppList();
                //BIACore.Log.LogFactory.Message("Starting App Pool Ping Test");
                if (envServerNodeAppList.Count > 0)
                {
                    // Comment : need to handle multiple threads 
                    Parallel.ForEach(envServerNodeAppList, applog =>
                    {

                        int Status = 0;
                        var ExceptionMessage = "";

                        try
                        {
                            ConfigResponse ConfigResponse = BIACore.Web.Client.Post<ConfigResponse>("https://" + applog.Domain + Path.GetDirectoryName(applog.ReturnPath).Replace(@"\", "/") + "/api/BIACore/Config/Config", null);

                            //BIACore.Log.LogFactory.Message("Response: [" + ConfigResponse.appCode + "] vs [" + applog.appCode + "]");

                            if (ConfigResponse.appCode.ToLowerInvariant() == applog.appCode.ToLowerInvariant())
                            {
                                Status = 1;
                            }
                        }
                        catch (Exception e)
                        {
                            // Do nothing
                            ExceptionMessage = e.Message;

                        }
                        if (!ExceptionMessage.Contains("404"))
                            UpsertEnvServerNodeAppStatus(applog.EnvServerNodeId, applog.appCode, Status);
                    });
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }

        /// <summary>
        /// Upsert EnvServer NodeApp Status
        /// </summary>
        /// <param name="envServerNodeId"></param>
        /// <param name="appCode"></param>
        /// <param name="status"></param>
        private void UpsertEnvServerNodeAppStatus(int envServerNodeId, string appCode, int status)
        {
            try
            {
                SQL.ExecuteNonQuery(Connections.NewSecurity, "iis.UpsertEnvServerNodeAppStatus", new DBParameter[] {
                    new DBParameter("@EnvServerNodeId", DbType.Int32, envServerNodeId),
                    new DBParameter("@appCode", DbType.AnsiString, appCode),
                    new DBParameter("@status", DbType.Int32, status)
                });
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }

        /// <summary>
        /// Get EnvServer Node AppList
        /// </summary>
        /// <returns></returns>
        public List<EnvServerNodeAppLog> GetEnvServerNodeAppList()
        {
            try
            {
                return SQL.Execute<EnvServerNodeAppLog>(Connections.NewSecurity, "iisObject.EnvServerNodeAppList", new DBParameter[0]);
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
            return null;
        }
    }

}