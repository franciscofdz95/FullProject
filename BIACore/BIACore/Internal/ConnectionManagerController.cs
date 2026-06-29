using System.Web.Http;

namespace BIACore.Internal
{
    class ConnectionManagerController : ApiController
    {
        [HttpPost]
        [ActionName("RefreshConnections")]
        public void RefreshConnections_Post()
        {
            BIACoreModule.me.RefreshApplicationConnections(true);
        }
    }
}
