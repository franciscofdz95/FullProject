using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using BIACore.Model;

namespace BIACore.Server.Controller
{
    public partial class ExtJSValController : ApiController
    {
        private object ValidateClassNameToFileStructure(string distinctClassNames = "", string SessionId = "", string AppCode = "")
        {
            Application app = Cached.Application(SessionId, AppCode);

            if (app != null)
            {
                string filePath = 
                    (app.returnPath.ToLower().StartsWith("apps") || app.returnPath.ToLower().StartsWith("/apps")
                        ? AppDomain.CurrentDomain.BaseDirectory.Substring(0, AppDomain.CurrentDomain.BaseDirectory.IndexOf("\\Common"))
                        : AppDomain.CurrentDomain.BaseDirectory.Substring(0, AppDomain.CurrentDomain.BaseDirectory.IndexOf(":\\") + 2))
                    + (app.returnPath.StartsWith("/") ? "" : "\\")
                    + (app.returnPath.LastIndexOf(".") > app.returnPath.LastIndexOf("/")
                        ? app.returnPath.Substring(0, app.returnPath.LastIndexOf("/") + 1).Replace("/", "\\")
                        : app.returnPath)
                    + (app.returnPath.LastIndexOf("/") < app.returnPath.Length - 1 ? "/" : "");

                // This code needs to check to see if the path ends in the application folder, without an ending /

                filePath = filePath.Replace("apps", "Apps").Replace(app.appCode.ToLower(), app.appCode);

                LogFactory.Message("Filepath: {1}{0}SessionId: {2}{0}AppCode: {3}{0}AppDomain.BaseDirectory: {4}", new string[] {
                    Environment.NewLine, filePath, SessionId, AppCode, AppDomain.CurrentDomain.BaseDirectory.ToString()
                });

                dynamic ret = new ExpandoObject();

                List<string> classNames = distinctClassNames.Split(',').ToList<string>();
                List<object> returnClassNames = new List<object>();

                foreach (string className in classNames)
                {
                    dynamic classObj = new ExpandoObject();
                    classObj.ClassName = className;
                    classObj.FilePath = filePath + className.Replace(".", "\\") + ".js";
                    try
                    {
                        classObj.FileFound = File.Exists(classObj.FilePath);
                        //if (!classObj.FileFound) {
                        //    classObj.FileFound = File.Exists(classObj.FilePath.Replace("app\\", "App\\").Replace("view\\", "View\\"));
                        //    if (classObj.FileFound) classObj.FilePath = classObj.FilePath.Replace("app\\", "App\\").Replace("view\\", "View\\");
                        //}
                        //
                        //if (!classObj.FileFound)
                        //{
                        //    classObj.FileFound = File.Exists(classObj.FilePath.Replace("App\\", "app\\").Replace("View\\", "view\\"));
                        //    if(classObj.FileFound) classObj.FilePath = classObj.FilePath.Replace("App\\", "app\\").Replace("View\\", "view\\");
                        //}

                        //TODO: Future = Do a file search from App\View for potential matching files based on end of className js file

                    }
                    catch (Exception ex)
                    {
                        classObj.FileFound = false;
                        classObj.ErrorMessage = ex.Message;
                    }
                    returnClassNames.Add(classObj);
                }

                ret.ClassNames = returnClassNames.ToArray();

                return ret;
            }
            else
            {
                dynamic ret = new ExpandoObject();
                ret.ErrorMessage = "Could not find root directory for application";
                return ret;
            }
        }
    }
}
