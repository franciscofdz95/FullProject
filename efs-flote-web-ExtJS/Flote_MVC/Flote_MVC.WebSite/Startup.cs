using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Flote.WebSite.Startup))]

namespace Flote.WebSite
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            BIACore.BIACoreOwin.InitOwin(app);
            // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888
        }
    }
}
