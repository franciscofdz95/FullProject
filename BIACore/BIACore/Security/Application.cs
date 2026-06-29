using System;
using System.Collections.Generic;
using System.Web;

namespace BIACore.Security
{
    /// <summary>
    /// This static class is for accessing the current User object.
    /// Internally, it contains an Obj property which is a reference to
    /// the current user object; if none exists, nulls will (usually)
    /// be returned.
    /// There are 2 modes of operation; inside of a web application,
    /// this will automatically be provided assuming you're using the
    /// BIA security system.
    /// If you're in a standalone mode (e.g. running as a window service)
    /// you can manually set the User by calling User.StandAlone(UserId)
    /// - the appropriate user (and their permissions) will be loaded 
    /// automatically.
    /// </summary>
    public static class Application
    {
        private const string APPLICATION = "BIACore.ApplicationBase";
        public static string AppCode { get { return Obj.appCode; } }
        public static string Name { get { return Obj.name; } }
        public static string Description { get { return Obj.description; } }
        public static string Active { get { return Obj.active; } }
        public static string Visible { get { return Obj.visibility; } }
        public static string Requestable { get { return Obj.requestVisible; } }
        public static string InactiveMsg { get { return Obj.activeMsg; } }
        public static int UseSSL { get { return Obj.useSSL; } }
        public static int Timeout { get { return Obj.timeout; } }
        //public static int PollInterval { get { return Obj.pollInterval; } }

        [ThreadStatic]
        private static Model.ApplicationBase _application;
        internal static Model.ApplicationBase Obj
        {
            get
            {
                if (HttpContext.Current != null)
                {
                    if (HttpContext.Current.Items[APPLICATION] == null)
                    {
                        Model.ApplicationBase item = null;
                        try
                        {
                            item = Internal.Request.ApplicationBase();
                            // technically this is an invalid session.
                            if (item == null) item = new Model.ApplicationBase();
                        }
                        catch
                        {
                            item = new Model.ApplicationBase();
                        }
                        HttpContext.Current.Items[APPLICATION] = item;
                    }
                }
                else if (_application == null)
                {
                    _application = new Model.ApplicationBase();
                }
                return (HttpContext.Current != null) ? (Model.ApplicationBase)HttpContext.Current.Items[APPLICATION] : _application;
            }
            set
            {
                if (HttpContext.Current != null)
                    HttpContext.Current.Items[APPLICATION] = value;
                else
                    _application = value;
            }
        }
        public static List<Model.UserApp> UserList(string level = null, string search = null)
        {
            return Internal.Request.UserList(level, search);
        }
    }
}