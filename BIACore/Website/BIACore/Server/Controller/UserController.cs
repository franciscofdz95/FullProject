using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Script.Serialization;
using BIACore.Model;
using BIACore.Log;
//using ITUser = BIACore.Website.ITUser;
using ITUserByEmail = BIACore.Website.ITUserByEmail;
using ITUserExt = BIACore.Website.ITUserExt;
using ITUserList = BIACore.Website.ITUserById;

namespace BIACore.Server.Controller
{
    public partial class UserController : ApiController
    {
        private const int RECORD_LIMIT = 25;
        private const int SEARCH_MIN_LENGTH = 3;

        private object BuildUserList(string adid = null, string empid = null, string firstname = null, string lastname = null, string fullname = null, bool? exactNullable = false)
        {
            bool exact = exactNullable == true;            
            Log.LogFactory.API("WS4ID", "Input Params:{0}adid = {1},{0}empid = {2},{0}firstname = {3},{0}lastname = {4},{0}fullname = {5},{0}exact = {6}", 
                new object[] { Environment.NewLine, adid, empid, firstname, lastname, fullname, exact.ToString() }
            );
            //ADID, EmpId, FirstName, LastName, FullName (LastName, FirstName)
            string key = String.Format("UserList~{0}~{1}~{2}~{3}~{4}~{5}", 
                adid == null ? "null" : adid, 
                empid == null ? "null" : empid, 
                firstname == null ? "null" : firstname, 
                lastname == null ? "null" : lastname, 
                fullname == null ? "null" : fullname, 
                exact == true ? "true" : "false");
            List <Dictionary<string, object>> userlist = Cached.WS4IDUserList(key);

            if ((adid == null || (adid != null && adid.Length >= SEARCH_MIN_LENGTH)) &&
                (empid == null || (empid != null && empid.Length >= SEARCH_MIN_LENGTH)) &&
                (firstname == null || (firstname != null && firstname.Length >= SEARCH_MIN_LENGTH)) &&
                (lastname == null || (lastname != null && lastname.Length >= SEARCH_MIN_LENGTH)) &&
                (fullname == null || (fullname != null && fullname.Length >= SEARCH_MIN_LENGTH)) &&
                (adid != null || empid != null || firstname != null || lastname != null || fullname != null))
            {
                if (userlist == null)
                {
                    userlist = new List<Dictionary<string, object>>();
                    List<Dictionary<string, object>> userlistADID = new List<Dictionary<string, object>>();
                    List<Dictionary<string, object>> userlistEmpId = new List<Dictionary<string, object>>();
                    List<Dictionary<string, object>> userlistFirstName = new List<Dictionary<string, object>>();
                    List<Dictionary<string, object>> userlistLastName = new List<Dictionary<string, object>>();
                    List<Dictionary<string, object>> userlistFullName = new List<Dictionary<string, object>>();

                    if (adid != null) { userlistADID = GetUserListByADID(adid, exact); }
                    if (empid != null) { userlistEmpId = GetUserListByEmpId(empid, exact); }
                    if (firstname != null) { userlistFirstName = GetUserListByName(firstname: firstname, firstnameExact: exact); }
                    if (lastname != null) { userlistLastName = GetUserListByName(lastname: lastname, lastnameExact: exact); }
                    if (fullname != null)
                    {
                        string fname = fullname.Split(new char[] { ',' })[1];
                        string lname = fullname.Split(new char[] { ',' })[0];

                        userlistFullName = GetUserListByName(firstname: fname, firstnameExact: exact, lastname: lname, lastnameExact: exact);
                    }

                    Log.LogFactory.API("WS4ID", "Results:{0}adid = {1},{0}empid = {2},{0}firstname = {3},{0}lastname = {4},{0}fullname = {5}",
                        new object[] {
                            Environment.NewLine,
                            userlistADID.Count.ToString(),
                            userlistEmpId.Count.ToString(),
                            userlistFirstName.Count.ToString(),
                            userlistLastName.Count.ToString(),
                            userlistFullName.Count.ToString()
                        }
                    );

                    //Merge all results lists with only
                    if (userlistADID.Count > 0) { userlist = userlist.Union(userlistADID).ToList(); }
                    if (userlistEmpId.Count > 0) { userlist = userlist.Union(userlistEmpId).ToList(); }
                    if (userlistFirstName.Count > 0) { userlist = userlist.Union(userlistFirstName).ToList(); }
                    if (userlistLastName.Count > 0) { userlist = userlist.Union(userlistLastName).ToList(); }
                    if (userlistFullName.Count > 0) { userlist = userlist.Union(userlistFullName).ToList(); }

                    //Sort results based on passed search params
                    if (adid != null) { userlist = userlist.OrderBy(i => i["adid"]).ToList(); }
                    else if (empid != null) { userlist = userlist.OrderBy(i => i["empid"]).ToList(); }
                    else if (firstname != null) { userlist = userlist.OrderBy(i => i["firstname"]).ToList(); }
                    else if (lastname != null) { userlist = userlist.OrderBy(i => i["lastname"]).ToList(); }
                    else if (fullname != null) { userlist = userlist.OrderBy(i => i["lastname"]).ThenBy(i => i["firstname"]).ToList(); }

                    //if (userlist.Count >= RECORD_LIMIT) userlist = userlist.GetRange(0, RECORD_LIMIT);
                }

                Cache.Set(key, userlist);

                return new { userlist = userlist };
            }
            else {
                return userlist;
            }
        }

        private List<Dictionary<string, object>> AddProfileToUserList(List<Dictionary<string, object>> userlist)
        {
            List<Dictionary<string, object>> ulist = new List<Dictionary<string, object>>();

            foreach (Dictionary<string, object> user in userlist)
            {
                List<Dictionary<string, object>> userProfileList = GetUserListByEmpId(user["empid"].ToString(), true);

                if (userProfileList.Count == 1)
                {
                    ulist.Add(userProfileList[0]);
                }
                else if (userProfileList.Count > 1)
                {
                    bool matchFound = false;
                    foreach (Dictionary<string, object> userprofile in userProfileList)
                    {
                        if (userprofile["adid"].ToString() == user["adid"].ToString())
                        {
                            ulist.Add(userprofile);
                            matchFound = true;
                            break;
                        }
                    }

                    if (!matchFound)
                    {
                        ulist.Add(user);
                    }
                }
            }
            return ulist;
        }

        //UserList
        private List<Dictionary<string, object>> GetUserListByName(string firstname = null, string lastname = null, bool firstnameExact = false, bool lastnameExact = false)
        {
            List<Dictionary<string, object>> userlist = new List<Dictionary<string, object>>();

            if (firstname != null || lastname != null)
            {
                ITUserList.getUserListRequest request = new ITUserList.getUserListRequest();
                request.UserListRequest = new ITUserList.UserListRequest();

                if (firstname != null) request.UserListRequest.FirstName = firstname + (!firstnameExact ? "*" : "");
                if (lastname != null) request.UserListRequest.LastName = lastname + (!lastnameExact ? "*" : "");
                if(firstname != null && lastname == null) request.UserListRequest.LastName = "*";

                request.UserListRequest.IDType = "uuid";
                
                var jss = new JavaScriptSerializer();
                //LogFactory.Message("WS4ID BIACore API GetUserListByName Request = {0}", new object[] { Newtonsoft.Json.JsonConvert.SerializeObject(request) });

                try
                {
                    ITUserList.UserListPort client = new ITUserList.UserListPortClient();
                    ITUserList.getUserListResponse response = client.getUserList(request);
                    
                    //LogFactory.Message("WS4ID BIACore API GetUserListByName Resposne = {0}", new object[] { Newtonsoft.Json.JsonConvert.SerializeObject(response) });

                    if (response.result.count > 0)
                    {
                        List<ITUserList.UserListRecord> responseRecords = response.result.record.ToList();

                        foreach (ITUserList.UserListRecord record in responseRecords) {
                            Dictionary<string, object> userlistItem = record.GetType()
                                .GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public)
                                    .ToDictionary(prop => prop.Name, prop => prop.GetValue(record, null));

                            userlistItem["adid"] = record.uuid;
                            userlist.Add(userlistItem);
                            if (responseRecords.IndexOf(record) > RECORD_LIMIT - 1) break;
                        }
                    }
                }
                catch (Exception ex)
                {

                }

                //LogFactory.Message("WS4ID BIACore API GetUserListByName Matches Found = {0}", new object[] { userlist.Count.ToString() });

                userlist = AddProfileToUserList(userlist);
            }

            return userlist;
        }

        //UserProfile2
        private List<Dictionary<string, object>> GetUserListByADID(string adid, bool exact = false)
        {
            List<Dictionary<string, object>> userlist = new List<Dictionary<string, object>>();

            if (adid != null )
            {
                ITUserExt.getUserProfile2Request request = new ITUserExt.getUserProfile2Request();
                request.UserProfile2Request = new ITUserExt.UserProfile2Request();

                request.UserProfile2Request.UserID = adid + (!exact ? "*" : "");
                request.UserProfile2Request.IDType = "uuid";


                try
                {
                    ITUserExt.UserProfile2Port client = new ITUserExt.UserProfile2PortClient();
                    ITUserExt.getUserProfile2Response response = client.getUserProfile2(request);

                    if (response.result.count > 0)
                    {
                        List<ITUserExt.UserProfile2Record> responseRecords = response.result.record.ToList();

                        foreach (ITUserExt.UserProfile2Record record in responseRecords)
                        {
                            Dictionary<string, object> userlistItem = record.GetType()
                                .GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public)
                                    .ToDictionary(prop => prop.Name, prop => prop.GetValue(record, null));

                            userlistItem["adid"] = record.uuid;

                            userlist.Add(userlistItem);
                            if (responseRecords.IndexOf(record) > RECORD_LIMIT - 1) break;
                        }

                    }
                }
                catch (Exception ex)
                {

                }
            }

            return userlist;
        }

        //UserProfile2
        private List<Dictionary<string, object>> GetUserListByEmpId(string empid, bool exact = false)
        {
            List<Dictionary<string, object>> userlist = new List<Dictionary<string, object>>();

            if (empid != null)
            {
                ITUserExt.getUserProfile2Request request = new ITUserExt.getUserProfile2Request();
                request.UserProfile2Request = new ITUserExt.UserProfile2Request();

                request.UserProfile2Request.UserID = empid + (!exact ? "*" : "");
                request.UserProfile2Request.IDType = "empid";


                try
                {
                    ITUserExt.UserProfile2Port client = new ITUserExt.UserProfile2PortClient();
                    ITUserExt.getUserProfile2Response response = client.getUserProfile2(request);

                    if (response.result.count > 0)
                    {
                        List<ITUserExt.UserProfile2Record> responseRecords = response.result.record.ToList();

                        foreach (ITUserExt.UserProfile2Record record in responseRecords)
                        {
                            Dictionary<string, object> userlistItem = record.GetType()
                                .GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public)
                                    .ToDictionary(prop => prop.Name, prop => prop.GetValue(record, null));

                            userlistItem["adid"] = record.uuid;

                            userlist.Add(userlistItem);
                            if (responseRecords.IndexOf(record) > RECORD_LIMIT - 1) break;
                        }

                    }
                }
                catch (Exception ex)
                {

                }
            }

            return userlist;
        }
    }
}
