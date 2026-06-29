using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Microsoft.Web.Administration;

using BIACore.Model;
using BIACore.Provider;

namespace IISMonitor
{
    enum AppPoolStatus
    {
        Unknown= 0,
        Starting=1,
        Started=2,
        Stopping=-1,
        Stopped=-2
    }
    class DataInterface
    {
        private static string GetCurrentServer()
        {
            if (Environment.MachineName.IndexOf("SVRP") == -1) return "LOCALHOST";
            else return Environment.MachineName.ToUpper();
        }
        private static string GetServerEnvironment()
        {
            if (DataInterface.GetCurrentServer().ToLower() == "svrp000346ec") return "DEV";
            else if (DataInterface.GetCurrentServer().ToLower() == "svrp000346ed") return "QA";
            else if ((new List<string>() { "svrp000346c5", "svrp000346e5", "svrp000346e7", "svrp000346ea" }).IndexOf(DataInterface.GetCurrentServer().ToLower()) > -1) return "PROD";
            else return "LOC";
        }
        private static string GetServerAlias()
        {
            if (DataInterface.GetCurrentServer().ToLower() == "svrp000346ec") return "DEV";
            else if (DataInterface.GetCurrentServer().ToLower() == "svrp000346ed") return "QA";
            else if (DataInterface.GetCurrentServer().ToLower() == "svrp000346c5") return "BIA-A";
            else if (DataInterface.GetCurrentServer().ToLower() == "svrp000346e5") return "BIA-B";
            else if (DataInterface.GetCurrentServer().ToLower() == "svrp000346e7") return "BIA-C";
            else if (DataInterface.GetCurrentServer().ToLower() == "svrp000346ea") return "BIA-D";
            else return "LOC";
        }
        
        public static void UpdateApplicationPoolStatus(ApplicationPool appPool, int? appPoolId = null)
        {
            if(appPoolId == null) appPoolId = (int?)GetApplicationPoolId(appPool);            

            SQL.ExecuteNonQuery(Connections.Security, "iis.UpdateAppPoolStatus", new DBParameter[] {
                new DBParameter("@server",DbType.AnsiString,DataInterface.GetCurrentServer().ToUpper()),
                //new DBParameter("@serverAlias",DbType.AnsiString,GetServerAlias()),
                new DBParameter("@env",DbType.AnsiString,GetServerEnvironment()),
                new DBParameter("@name",DbType.AnsiString,appPool.Name),
                new DBParameter("@status",DbType.AnsiString,(int)Enum.Parse(typeof(AppPoolStatus),appPool.State.ToString())),
                new DBParameter("@appPoolId", DbType.Int32, appPoolId),
                new DBParameter("@poll", DbType.Boolean, true)
            });
        }

        public static void UpsertApplicationPoolProperties(ApplicationPool appPool)
        {
            int appPoolId = GetApplicationPoolId(appPool);
            string sp = "iis.UpsertAppPoolProperty";

            String[] properties = new String[] { "ManagedRuntimeVersion", "StartMode" };
            for (int i = 0; i < properties.Length; i++)
            {
                System.Reflection.PropertyInfo pi = appPool.GetType().GetProperty(properties[i]);
                if (pi != null && pi.GetValue(appPool) != null) {                
                    SQL.ExecuteNonQuery(Connections.Security, sp, new DBParameter[]
                    {
                        new DBParameter("@appPoolId",DbType.AnsiString,appPoolId.ToString()),
                        new DBParameter("@propName",DbType.AnsiString,properties[i]),
                        new DBParameter("@propValue",DbType.AnsiString, pi.GetValue(appPool).ToString()),
                        new DBParameter("@poll", DbType.Boolean, true)
                    });
                }
            }

            String[] recycleProperties = new String[] { "Memory", "PrivateMemory", "Requests", "Time" };
            ApplicationPoolPeriodicRestart recycleSettings = appPool.Recycling.PeriodicRestart;

            for (int i = 0; i < recycleProperties.Length; i++)
            {
                SQL.ExecuteNonQuery(Connections.Security, sp, new DBParameter[]
                {
                    new DBParameter("@appPoolId",DbType.AnsiString,appPoolId.ToString()),
                    new DBParameter("@propName",DbType.AnsiString,"RecycleSetting-" + recycleProperties[i]),
                    new DBParameter("@propValue",DbType.AnsiString,recycleSettings.GetType().GetProperty(recycleProperties[i]).GetValue(recycleSettings).ToString()),
                    new DBParameter("@poll", DbType.Boolean, true)
                });
            }

            SQL.ExecuteNonQuery(Connections.Security, sp, new DBParameter[]
            {
                new DBParameter("@appPoolId",DbType.AnsiString,appPoolId.ToString()),
                new DBParameter("@propName",DbType.AnsiString,"WorkerProcessCount"),
                new DBParameter("@propValue",DbType.AnsiString,appPool.WorkerProcesses.Count.ToString()),
                new DBParameter("@poll", DbType.Boolean, true)
            });

            long currentMemory = 0;
            TimeSpan processingTime = new TimeSpan(0);
            //DateTime startTime = new DateTime();
            for (int i = 0; i < appPool.WorkerProcesses.Count; i++)
            {
                System.Diagnostics.Process p = System.Diagnostics.Process.GetProcessById(appPool.WorkerProcesses[i].ProcessId);
                if (p != null)
                {
                    currentMemory += p.WorkingSet64;
                    if (p.TotalProcessorTime > processingTime) processingTime = p.TotalProcessorTime;
                    //if (p.StartTime < startTime && p.StartTime != DateTime.MinValue) startTime = p.StartTime;
                }
            }

            SQL.ExecuteNonQuery(Connections.Security, sp, new DBParameter[]
            {
                new DBParameter("@appPoolId",DbType.AnsiString,appPoolId.ToString()),
                new DBParameter("@propName",DbType.AnsiString,"CurrentMemory"),
                new DBParameter("@propValue",DbType.AnsiString,currentMemory.ToString()),
                new DBParameter("@poll", DbType.Boolean, true)
            });

            SQL.ExecuteNonQuery(Connections.Security, sp, new DBParameter[]
            {
                new DBParameter("@appPoolId",DbType.AnsiString,appPoolId.ToString()),
                new DBParameter("@propName",DbType.AnsiString,"ProcessingTime"),
                new DBParameter("@propValue",DbType.AnsiString,processingTime.Seconds.ToString()),
                new DBParameter("@poll", DbType.Boolean, true)
            });            
        }

        public static void UpsertApplication(Microsoft.Web.Administration.Application app, Site site, ServerManager iis)
        {            
            string appCode = null;
            Configuration webConfig = app.GetWebConfiguration();
            try
            {
                ConfigurationSection biacoreConfig = webConfig.GetSection("biacore");
                if (biacoreConfig != null)
                {
                    ConfigurationElement coreConfig = biacoreConfig.GetChildElement("core");
                    if (coreConfig != null)
                    {
                        appCode = coreConfig.GetAttributeValue("appCode").ToString();
                    }
                }

                List<DBParameter> param = new List<DBParameter>()
                {
                    new DBParameter("@path",DbType.AnsiString,app.Path),
                    new DBParameter("@site",DbType.AnsiString,site.Name),
                    new DBParameter("@appCode",DbType.AnsiString,appCode),
                    new DBParameter("@poll", DbType.Boolean, true)
                };

                List<Dictionary<string, object>> application = SQL.Execute<Dictionary<string, object>>(Connections.Security, "iis.UpsertApplication", param.ToArray());

                UpsertApplicationConnections(webConfig, (int)application[0]["ApplicationId"]);
            }
            catch (Exception ex) { }
        }

        public static void UpsertApplicationConnections(Configuration webConfig, int appId)
        {
            ConfigurationSection connectionConfig = webConfig.GetSection("connections");
            if (connectionConfig != null)
            {
                foreach (ConfigurationElement connection in connectionConfig.ChildElements)
                {
                    List<DBParameter> param = new List<DBParameter>()
                    {
                        new DBParameter("@appId",DbType.AnsiString,appId),
                        new DBParameter("@name",DbType.AnsiString,connection.GetAttributeValue("name")),
                        new DBParameter("@connectionString",DbType.AnsiString,connection.GetAttributeValue("connectionString")),
                        new DBParameter("@poll", DbType.Boolean, true)
                    };
                    SQL.ExecuteNonQuery(Connections.Security, "iis.UpsertApplicationConnection", param.ToArray());
                }
            }
        }

        public static int GetApplicationPoolId(ApplicationPool appPool)
        {
            List<object> ap = SQL.Execute<object>(Connections.Security, "iis.GetAppPool", new DBParameter[] {
                new DBParameter("@server",DbType.AnsiString,DataInterface.GetCurrentServer()),
                //new DBParameter("@serverAlias",DbType.AnsiString,GetServerAlias()),
                new DBParameter("@env",DbType.AnsiString,GetServerEnvironment()),
                new DBParameter("@name",DbType.AnsiString,appPool.Name)
            });
            int appPoolId = 0;

            //if (ap.Count > 0)
            //{
            //    System.Web.Script.Serialization.JavaScriptSerializer jss = new System.Web.Script.Serialization.JavaScriptSerializer();
            //    jss.MaxJsonLength = 2147483647;
            //    BIACore.Log.LogFactory.Message(jss.Serialize(ap[0]) + " " + ap.Count.ToString() + " " + ap[0].GetType().GetProperty("AppPoolId").GetValue(ap[0]).ToString());
            //}

            if (ap.Count > 0 && int.TryParse(ap[0].GetType().GetProperty("AppPoolId").GetValue(ap[0]).ToString(), out appPoolId)) return appPoolId;
            else return 0;
        }

        public static List<dynamic> GetAppPoolInteractions()
        {
            //return SQL.Execute<dynamic>(Connections.Security, "iis.GetAppPoolInteractions", new DBParameter[] {
            //    new DBParameter("@server",DbType.AnsiString,BIACore.Settings.Config.Server),
            //    new DBParameter("@env",DbType.AnsiString,GetServerEnvironment())
            //});
            return new List<dynamic>();
        }
    }
}