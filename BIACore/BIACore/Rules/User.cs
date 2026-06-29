using System;
using System.Linq;

using model = BIACore.Model;

namespace BIACore.Rules
{
    public static class User
    {
        public static bool isSA(model.User user)
        {
            if (null != user && null != user.permissions && user.permissions.Count > 0)
            {
                return user.permissions
                    .Select(item => (model.Permission)(item.ToObject<model.Permission>()))
                    .Any(x => string.Equals(x.securityLevel, "SA", StringComparison.InvariantCultureIgnoreCase));
            }
            return false;
        }

        public static bool isAdmin(model.User user)
        {
            if (null != user && null != user.permissions && user.permissions.Count > 0)
            {
                return user.permissions
                    .Select(item => (model.Permission)(item.ToObject<model.Permission>()))
                    .Any(x => string.Equals(x.securityLevel, "Admin", StringComparison.InvariantCultureIgnoreCase)) 
                    || isSA(user);
            }
            return false;
        }

        public static bool isCorporate(model.User user)
        {
            if (null != user && null != user.permissions && user.permissions.Count > 0)
            {
                return user.permissions
                    .Select(item => (model.Permission)(item.ToObject<model.Permission>()))
                    .Any(x => string.Equals(x.geoCode, "CO", StringComparison.InvariantCultureIgnoreCase));
            }
            return false;
        }
    }
}
