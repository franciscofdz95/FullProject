using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Data;
using System.Net.Mail;

using BIACore.Agent;
using BIACore.Agent.Task;

using BIACore.Model;
using BIACore.Provider;
using System.Xml.Linq;
using System.IO;

namespace BIAService.Task
{
    public class WebConfigScan : BaseTask
    {
        public override TimeSpan Interval { get { return new TimeSpan(0, 30, 0); } set { } }

        public override void Run()
        {
            try
            {
                string[] directoryList = {
                    @"\\biamirror.inside.ups.com\mir_root\Apps\",
                    @"\\biamirror.inside.ups.com\mir_root\",
                    @"\\biamirror.inside.ups.com\mir_root\bia\apps\"
                };

                foreach (string directory in directoryList)
                {
                    ScanDirectory(directory);
                }
            }
            catch (Exception e)
            {
                BIACore.Log.LogFactory.Exception(e);
            }
        }

        private void ScanDirectory(string directory)
        {
            if (Directory.Exists(directory))
            {
                string[] appDirectories = Directory.GetDirectories(directory);

                foreach (string appDirectory in appDirectories)
                {
                    string webConfigPath = appDirectory + "\\web.config";

                    if (File.Exists(webConfigPath))
                    {
                        XElement webConfigXML = XElement.Load(webConfigPath);

                        dynamic appCodeInfo = GetAppCode(webConfigXML);
                        string appCode = appCodeInfo != null ? appCodeInfo.appCode : null;
                        string appCodeSource = appCodeInfo != null ? appCodeInfo.appCodeSource : null;
                        string biaCoreServer = GetBIACoreServer(webConfigXML);
                        bool compilationDebugEnabled = CheckCompilationDebug(webConfigXML);
                        bool customErrorsEnabled = CheckCustomErrors(webConfigXML);
                        bool biaCoreDebugEnabled = CheckBIACoreDebug(webConfigXML);

                        LogResult(webConfigPath, appCode, appCodeSource, biaCoreServer,
                            compilationDebugEnabled, customErrorsEnabled, biaCoreDebugEnabled);
                    }
                }
            }
        }

        private dynamic GetAppCode(XElement webConfigXML)
        {
            XElement biaCoreElement = webConfigXML.Descendants(XName.Get("biacore")).FirstOrDefault();
            if (biaCoreElement != null)
            {
                XElement coreElement = biaCoreElement.Descendants(XName.Get("core")).FirstOrDefault();
                if (coreElement != null)
                {
                    XAttribute appCodeAttribute = coreElement.Attribute(XName.Get("appCode"));
                    if (appCodeAttribute != null)
                    {
                        return new
                        {
                            appCode = appCodeAttribute.Value.ToString(),
                            appCodeSource = "BIACore Element"
                        };
                    }
                }
            }

            XElement appSettingsElement = webConfigXML.Descendants(XName.Get("appSettings")).FirstOrDefault();
            if (appSettingsElement != null)
            {
                foreach (XElement settingElement in appSettingsElement.Elements())
                {
                    XAttribute keyAttribute = settingElement.Attribute(XName.Get("key"));
                    XAttribute valueAttribute = settingElement.Attribute(XName.Get("value"));

                    // eg \\biamirror.inside.ups.com\mir_root\ClaimsReporting\web.config 
                    if (keyAttribute != null && valueAttribute != null
                        && string.Equals(keyAttribute.Value, "BIA_AppCode", StringComparison.InvariantCultureIgnoreCase))
                    {
                        return new
                        {
                            appCode = valueAttribute.Value.ToString(),
                            appCodeSource = "AppSettings BIA_AppCode"
                        };
                    }

                    // eg \\biamirror.inside.ups.com\mir_root\GPRS\web.config
                    if (keyAttribute != null && valueAttribute != null
                        && string.Equals(keyAttribute.Value, "BIAAppCode", StringComparison.InvariantCultureIgnoreCase))
                    {
                        return new
                        {
                            appCode = valueAttribute.Value.ToString(),
                            appCodeSource = "AppSettings BIAAppCode"
                        };
                    }

                    // eg \\biamirror.inside.ups.com\mir_root\DRS\web.config
                    if (keyAttribute != null && valueAttribute != null
                        && string.Equals(keyAttribute.Value, "AppName", StringComparison.InvariantCultureIgnoreCase))
                    {
                        return new
                        {
                            appCode = valueAttribute.Value.ToString(),
                            appCodeSource = "AppSettings AppName"
                        };
                    }
                }
            }

            // eg \\biamirror.inside.ups.com\mir_root\Apps\WCPM\web.config
            XElement baseCoreElement = webConfigXML.Descendants(XName.Get("core")).FirstOrDefault();
            if (baseCoreElement != null)
            {
                XAttribute appCodeAttribute = baseCoreElement.Attribute(XName.Get("appCode"));
                if (appCodeAttribute != null)
                {
                    return new
                    {
                        appCode = appCodeAttribute.Value.ToString(),
                        appCodeSource = "Core Element"
                    };
                }
            }

            return null;
        }

        private string GetBIACoreServer(XElement webConfigXML)
        {
            XElement biaCoreElement = webConfigXML.Descendants(XName.Get("biacore")).FirstOrDefault();
            if (biaCoreElement != null)
            {
                XElement coreElement = biaCoreElement.Descendants(XName.Get("core")).FirstOrDefault();
                if (coreElement != null)
                {
                    XAttribute serverAttribute = coreElement.Attribute(XName.Get("server"));
                    if (serverAttribute != null)
                    {
                        return serverAttribute.Value.ToString();
                    }
                }
            }

            return null;
        }

        private bool CheckCustomErrors(XElement webConfigXML)
        {
            XElement systemWebElement = webConfigXML.Descendants(XName.Get("system.web")).FirstOrDefault();
            if (systemWebElement != null)
            {
                XElement customErrorsElement = systemWebElement.Descendants(XName.Get("customErrors")).FirstOrDefault();
                if (customErrorsElement != null)
                {
                    XAttribute modeAttribute = customErrorsElement.Attribute(XName.Get("mode"));
                    if (modeAttribute != null && !string.Equals(modeAttribute.Value.ToString(), "off", StringComparison.InvariantCultureIgnoreCase))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private bool CheckCompilationDebug(XElement webConfigXML)
        {
            XElement systemWebElement = webConfigXML.Descendants(XName.Get("system.web")).FirstOrDefault();
            if (systemWebElement != null)
            {
                XElement compilationElement = systemWebElement.Descendants(XName.Get("compilation")).FirstOrDefault();
                if (compilationElement != null)
                {
                    XAttribute debugAttribute = compilationElement.Attribute(XName.Get("debug"));
                    if (debugAttribute != null && bool.Parse(debugAttribute.Value.ToString()))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private bool CheckBIACoreDebug(XElement webConfigXML)
        {
            XElement biaCoreElement = webConfigXML.Descendants(XName.Get("biacore")).FirstOrDefault();
            if (biaCoreElement != null)
            {
                XElement coreElement = biaCoreElement.Descendants(XName.Get("core")).FirstOrDefault();
                if (coreElement != null)
                {
                    XAttribute debugAttribute = coreElement.Attribute(XName.Get("debug"));
                    if (debugAttribute != null && bool.Parse(debugAttribute.Value.ToString()))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private void LogResult(string webConfigPath, string appCode, string appCodeSource, string biaCoreServer, bool compilationDebugEnabled, bool customErrorsEnabled, bool biaCoreDebugEnabled)
        {
            SQL.ExecuteNonQuery(Connections.NewSecurity, "intObject.UpsertWebConfigScan",
                new DBParameter("@FilePath", DbType.String, webConfigPath),
                new DBParameter("@AppCode", DbType.String, appCode),
                new DBParameter("@AppCodeSource", DbType.String, appCodeSource),
                new DBParameter("@BIACoreServer", DbType.String, biaCoreServer),
                new DBParameter("@CompilationDebugEnabled", DbType.Boolean, compilationDebugEnabled),
                new DBParameter("@CustomErrorsEnabled", DbType.Boolean, customErrorsEnabled),
                new DBParameter("@BIACoreDebugEnabled", DbType.Boolean, biaCoreDebugEnabled)
            );
        }
    }
}