using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Model
{
    public class ApplicationBase
    {
        public string name { get; set; }
        public string appCode { get; set; }
        public string visibility { get; set; }
        public string description { get; set; }
        public string active { get; set; }
        public string activeMsg { get; set; }
        public string requestVisible { get; set; }
        public int timeout { get; set; }
        //public int pollInterval { get; }
        public int useSSL { get; set; }
        //public string returnPath { get; set; }
        //public string logoPath { get; set; }
        //public string projectMgr { get; set; }
        //public string projectMgrEmail { get; set; }
        //public string isSecured { get; set; }
        //public DateTime? lastUpdated { get; set; }
        //public string faqURI { get; set; }
        //public string showToolBar { get; set; }
        //public string showLocation { get; set; }
        //public string extendedAttrib { get; set; }
        //public string extendedAttribTable { get; set; }
        //public string extendedAttribPath { get; set; }
        //public string extendedAttribAccess { get; set; }
        //public string trapErrors { get; set; }
        //public string releastNotesURI { get; set; }
        //public string dsn { get; set; }
        //public string lastUpdatedBy { get; set; }
        //public int timeoutDays { get; set; }
        //public int timeoutHours { get; set; }
        //public int timeoutMinutes { get; set; }
        //public int multiLevelAccess { get; set; }
        //public int showOnRequestPage { get; set; }
        //public int enforceTimeoutNotifation { get; set; }
        //public string everyoneHasDefaultAccessAsGeoListingId { get; set; }
        public ApplicationBase()
        {
            //pollInterval = Cache.DEFAULT_CACHE_DURATION;
            useSSL = 1;
        }
    }
}
