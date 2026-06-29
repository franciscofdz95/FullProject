

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController : BIACore.Web.Controller.BaseController
    {

        public override string Connection
        {
            get { return Connections.Flote; }
        }

    }
}
