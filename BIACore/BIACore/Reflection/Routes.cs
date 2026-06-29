using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace BIACore.Reflection
{
    internal class Routes
    {
        private static Type ControllerType
        {
            get
            {
                Type t = null;
                foreach (Assembly a in AppDomain.CurrentDomain.GetAssemblies())
                {
                    t = a.GetType("System.Web.Http.Controllers.IHttpController");
                    if (t != null)
                        break;
                }
                return t;
            }
        }

        //private List<Type> _controllers = null;
        private static IEnumerable<Type> Controllers
        {
            get
            {
                List<Type> _controllers = new List<Type>();

                Type controller = ControllerType;
                if (controller != null)
                {
                    foreach (Assembly a in AppDomain.CurrentDomain.GetAssemblies())
                    {
                        _controllers.AddRange(a.GetTypes().Where(t => controller.IsAssignableFrom(t)));
                    }
                }
                return _controllers;
            }
        }

        internal static string Thing()
        {
            StringBuilder sb = new StringBuilder();

            //foreach (Route r in RouteTable.Routes)
            //{
            //}
            foreach (Type controller in Controllers)
            {
                if (controller.FullName.StartsWith("System")) continue;

                sb.AppendFormat("Controller {0}", controller.FullName);
                sb.AppendLine();
                foreach (MethodInfo method in controller.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly))
                {
                    sb.AppendFormat("* Method {0}", method.Name);
                    sb.AppendLine();
                }
            }
            return sb.ToString();
        }
    }
}
