using BIACore.Log;
using BIACore.Web;
using System;
using System.Collections.Generic;

namespace BIACore.Internal
{
    internal static partial class Request
    {
        private static object applicationLock = new object();
        private static object userListLock = new object();
        private static object applicationBaseLock = new object();
        // Not actually used anywhere, but added for completeness sake.
        internal static Model.Application Application(string TokenLocal)
        {
            string key = string.Format("Application_S{0}{2}_A{1}", CurrentContext.GetLocalHostTokenCookieValue(), Settings.Config.AppCode, CurrentContext.GetSessionCookieValue());
            Model.Application application = null;
            lock (applicationLock)
            {
                if ((application = (Model.Application)Cache.Get(key)) == null)
                {
                    DateTime start = DateTime.UtcNow;
                    try
                    {
                        // this isn't something we should ever really cache.
                        application = Web.Client.Post<Model.Application>(API.URL(API.APPLICATION),
                        new { TokenLocal = TokenLocal, AppCode = Settings.Config.AppCode });

                        if (null != application)
                            Cache.Set(key, application, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION)); // cache the user for the same duration as the session?
                    }
                    catch { }
                    finally
                    {
                        LogFactory.Performance("Request Application", DateTime.UtcNow.Subtract(start).TotalSeconds);
                    }
                }
            }
            return application;
        }

        internal static List<Model.UserApp> UserList(string level, string search)
        {
            string key = string.Format("S{0}{2}_A{1}_L{3}_SE{4}", CurrentContext.GetLocalHostTokenCookieValue(), Settings.Config.AppCode, CurrentContext.GetSessionCookieValue(), level, search);
            List<Model.UserApp> userList = null;
            lock (userListLock)
            {
                if ((userList = (List<Model.UserApp>)Cache.Get(key)) == null)
                {
                    DateTime start = DateTime.UtcNow;
                    try
                    {
#if LocalTest
                        userList = LocalRequest.Userlist(Settings.Config.AppCode, level, search);
#else
                        userList = Web.Client.Post<List<Model.UserApp>>(API.URL(API.USER_LIST),
                            new { Level = level, Search = search, AppCode = Settings.Config.AppCode });
#endif
                        if (null != userList)
                            Cache.Set(key, userList, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION)); // cache the user for the same duration as the session?
                    }
                    catch { }
                    finally
                    {
                        LogFactory.Performance("Request UserList", DateTime.UtcNow.Subtract(start).TotalSeconds);
                    }
                }
            }
            return userList;
        }
        internal static Model.ApplicationBase ApplicationBase()
        {
            string key = string.Format("S{0}{2}_AB{1}", CurrentContext.GetLocalHostTokenCookieValue(), Settings.Config.AppCode, CurrentContext.GetSessionCookieValue());
            Model.ApplicationBase applicationBase = null;
            lock (applicationBaseLock)
            {
                if ((applicationBase = (Model.ApplicationBase)Cache.Get(key)) == null)
                {
                    DateTime start = DateTime.UtcNow;
                    try
                    {
#if LocalTest
                        applicationBase = LocalRequest.ApplicationBase(null, Settings.Config.AppCode);
#else
                        applicationBase = Web.Client.Post<Model.ApplicationBase>(API.URL(API.APPLICATIONBASE), new { AppCode = Settings.Config.AppCode });
#endif

                        if (null != applicationBase)
                            Cache.Set(key, applicationBase, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION)); // cache the user for the same duration as the session?
                    }
                    catch { }
                    finally
                    {
                        LogFactory.Performance("Request ApplicationBase", DateTime.UtcNow.Subtract(start).TotalSeconds);
                    }
                }
            }
            return applicationBase;
        }
        internal static dynamic ApplicationAzure()
        {
            dynamic applicationAzure = null;

            DateTime start = DateTime.UtcNow;
            try
            {
                applicationAzure = Web.Client.Post<dynamic>(API.URL(API.APPLICATIONAZURE), new {
                    AppCode = Settings.Config.AppCode,
                    Environment = Settings.Config.IsLocalHost ? "localhost" : Settings.Config.BIAEnvironment
                });
            }
            catch (Exception e){
                LogFactory.Exception(e);
            }
            finally
            {
                LogFactory.Performance("Request ApplicationAzure", DateTime.UtcNow.Subtract(start).TotalSeconds);
            }

            return applicationAzure;
        }
    }
}