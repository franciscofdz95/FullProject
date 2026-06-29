using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using BIACore.Agent;
using BIACore.Agent.Task;
using BIACore.Model;
using BIACore.Provider;

namespace BIAService.Task
{
    class UserLookup : BaseTask
    {
        public class Users
        {
            public string Sysm { get; set; }
            public string Adid { get; set; }
        }

        public override TimeSpan Interval { get { return new TimeSpan(168, 0, 0); } set { } }

        public List<Users> GetUsers(int flag)
        {
            return SQL.Execute<Users>(Connections.NewSecurity, "secObject.getUserListAll",
                new DBParameter("@flag", DbType.AnsiString, flag));
        }

        public void SetUserDeactive(string sysm)
        {
            SQL.ExecuteNonQuery(Connections.NewSecurity, "secObject.setUserDeactive",
                new DBParameter("@sysm", DbType.AnsiString, sysm));
        }
        public void SetUserReactive(string sysm)
        {
            SQL.ExecuteNonQuery(Connections.NewSecurity, "secObject.setUserReactive",
                new DBParameter("@sysm", DbType.AnsiString, sysm));
        }

        public void RemoveDeactiveUser(string sysm)
        {
            SQL.ExecuteNonQuery(Connections.NewSecurity, "secObject.RemoveDeactivatedUser",
                new DBParameter("@sysm", DbType.AnsiString, sysm));
        }
             
        private static bool CheckWS4byADID(string adid, bool exact = false)
        {
            bool result = true;

            /*
            if (adid != null)
            {
                ITUserExt.getUserProfileRequest request = new ITUserExt.getUserProfileRequest();
                request.UserProfileRequest = new ITUserExt.UserProfileRequest();

                request.UserProfileRequest.UserID = adid + (!exact ? "*" : "");
                request.UserProfileRequest.IDType = "uuid";

                try
                {
                    ITUserExt.UserProfilePort client = new ITUserExt.UserProfilePortClient();
                    ITUserExt.getUserProfileResponse response = client.getUserProfile(request);

                    result = response.result.count > 0;

                }
                catch (Exception ex)
                {
                    BIACore.Log.LogFactory.Exception(ex);
                }
            }
            */

            return result;
        }

        public override void Run()
        {
            try
            {
                List<Users> UserList = GetUsers(0);
                foreach (var rec in UserList)
                {
                    try
                    {
                        if (!CheckWS4byADID(rec.Adid))
                        {
                            //Console.WriteLine(rec.Sysm);
                            SetUserDeactive(rec.Sysm);
                        }
                    }
                    catch (Exception ex)
                    {
                        BIACore.Log.LogFactory.Exception(ex);
                    }
                }

                List<Users> RemoveUserList = GetUsers(1);
                foreach (var rec in RemoveUserList)
                {
                    try
                    {
                        if (CheckWS4byADID(rec.Adid))
                        {
                            SetUserReactive(rec.Sysm);
                        }
                        else
                        {
                            RemoveDeactiveUser(rec.Sysm);
                        }   
                    }
                    catch (Exception ex)
                    {
                        BIACore.Log.LogFactory.Exception(ex);
                    }
                }
            }
            catch { throw; }
        }
    }
}
