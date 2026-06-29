using System.Web;

namespace BIACore.Web
{
    /// <summary>
    /// The basis for BIACoreModule. 
    /// Handles determining the difference between application startup and request startup.
    /// </summary>
    public abstract class BIAHttpModule : IHttpModule
    {
        private static volatile bool applicationStarted = false;
        private static readonly object _lock = new object();

        public virtual void Dispose() { }

        public void Init(HttpApplication application)
        {
            if (!applicationStarted)
            {
                lock (_lock)
                {
                    if (!applicationStarted)
                    {
                        onStart(application);
                        applicationStarted = true;
                    }
                }
            }
            onInit(application);
        }

        // this is the equivalent to global.asax's Application_Start
        public virtual void onStart(HttpApplication application)
        {
        }

        // this gives us an opportunity to add request handlers
        public virtual void onInit(HttpApplication application)
        {
        }
    }
}
