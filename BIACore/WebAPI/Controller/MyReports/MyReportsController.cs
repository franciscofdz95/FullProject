namespace BIACore.Web.Controller
{
    public abstract partial class MyReportsController : BaseController
    {
        public abstract bool ExportEnabled(dynamic request);
    }
}
