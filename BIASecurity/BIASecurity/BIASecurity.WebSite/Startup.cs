using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(BIASecurity.WebSite.Startup))]

namespace BIASecurity.WebSite
{
    public class Startup
    {

        public void Configuration(IAppBuilder app)
        {

            BIACore.BIACoreOwin.InitOwin(app);

        }

    }
}
