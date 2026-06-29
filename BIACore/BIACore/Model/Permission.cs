using System;

namespace BIACore.Model
{
    public class Permission
    {
        // not sure what this is.
        [Obsolete("Use geoListingId instead (I think)")]
        public int NodeId { get { return geoListingId; } }
        public int geoListingId { get; set; }

        [Obsolete("Use geoId instead")]
        public string Id { get { return geoId; } }
        public string geoId { get; set; }

        [Obsolete("Use businessUnitId instead")]
        public string BuId { get { return businessUnitId; } }
        public string businessUnitId { get; set; }

        [Obsolete("Use geoGroupCode instead")]
        public string GroupId { get { return geoGroupCode; } }
        public string geoGroupCode { get; set; }

        [Obsolete("Use geoCode instead")]
        public string LevelId { get { return geoCode; } }
        public string geoCode { get; set; }

        [Obsolete("Use securityLevel instead")]
        public string RoleId { get { return securityLevel; } }
        public string securityLevel { get; set; }
        public string appCode { get; set; }
        public int active { get; set; }
        public string userId { get; set; }
        public string inserted { get; set; }

        /// <summary>
        /// Newtonsoft.JSON provides this method automatically.
        /// When using this class locally, the method still needs
        /// to exist for Rules.User() calls.
        /// </summary>
        public T ToObject<T>() where T : Permission
        {
            return this as T;
        }
    }
}
