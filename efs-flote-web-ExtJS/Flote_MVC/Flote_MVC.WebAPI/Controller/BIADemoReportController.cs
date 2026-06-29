


namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController : BIACore.Web.Controller.BaseController
    {

        public override string Connection
        {
            get { return Connections.Flote; }
        }

    }
}
