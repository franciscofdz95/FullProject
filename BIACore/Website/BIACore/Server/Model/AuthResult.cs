using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BIACore.Server.Model
{
    internal class AuthResult
    {
        /*
        Success [T/F],Lockout [T/F],Error [string],Timeout [int],Fail [T/F],Unknown [T/F],BadAccount [T/F],LoginAs [1/0],Token [AES256-String],
        LocalHostTOken [AES256-String],AppUrl [string],
        NoAccess [1/0],Pending [1/0],AppCode [string],User [string],FirstName [string],
        LastName [string],Offline [1/0],AppOfflineMsg [string],NewUser [1/0]

        Success, Token, LocalHostToken, AppUrl Error, Lockout, Timeout, LoginAs, NoAccess, FirstName, LastName, User, Pending, Offline, AppOfflineMsg, NewUser, AppCode, Unknown
        */
        public bool Success { get; set; }
        public bool? Lockout { get; set; }
        public string Error { get; set; }
        public int? Timeout { get; set; }
        public bool? Fail { get; set; }
        public bool? Unknown { get; set; }
        public bool? BadAccount { get; set; }
        public int? LoginAs { get; set; }
        public string Token { get; set; }
        public string LocalHostToken { get; set; }
        public string AppUrl { get; set; }
        public int? NoAccess { get; set; }
        public int? Pending { get; set; }
        public string AppCode { get; set; }
        public string User { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Offline { get; set; }
        public string AppOfflineMsg { get; set; }
        public int? NewUser { get; set; }
        public string SessionId { get; set; }
    }
}