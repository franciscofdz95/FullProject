using System.Collections;

namespace BIACore.Web.Model
{
    public abstract class ClientResult //: ContentResult
    {
        public abstract IList GetData();
    }
}
