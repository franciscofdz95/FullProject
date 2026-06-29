using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Model;

namespace BIASecurity.WebAPI.Controller
{
    public partial class BIASecurityController
    {
        [HttpPost]
        [ActionName("NewUserSearch")]
        public dynamic NewUserSearch([FromBody] dynamic request)
        {
            if (!BIACore.Security.User.isAdmin || request.query == null)
                return new
                {
                    success = true,
                    status = "InvalidPermissions"
                };

            string adid = (string)request.query.Value;
            dynamic existingUser = getUserByAdid(adid);
            if (existingUser != null)
            {
                return new
                {
                    success = true,
                    status = "Existing",
                    userId = existingUser.UserId,
                    adId = adid
                };
            }
            else
            {
                Ws4idUserProfile.UserProfile2Record rec = getWs4idUser(adid);
                if (rec != null)
                {
                    return new
                    {
                        success = true,
                        status = "Found",
                        user = new
                        {
                            ADID = rec.uuid,
                            EmployeeId = rec.empid,
                            FirstName = rec.firstname,
                            LastName = rec.lastname,
                            Email = rec.upsEmail
                        }
                    };
                }
                else
                {
                    return new
                    {
                        success = true,
                        status = "NotFound"
                    };
                }
            }
        }

        [HttpPost]
        [ActionName("AddUser")]
        public ClientResult AddUser([FromBody] dynamic request)
        {
            if (!BIACore.Security.User.isAdmin || request.query == null)
                return null;

            return addUserByAdid((string)request.query.Value);
        }

        public dynamic getUserByAdid(string adid)
        {
            return LoadSingle("userObject.GetUserProfile", new DBParameter("@adid", DbType.String, adid));
        }
        public dynamic getUserByEmpId(string empId)
        {
            return LoadSingle("userObject.GetUserProfile", new DBParameter("@employeeId", DbType.String, empId));
        }

        public ClientResult addUserByAdid(string adid)
        {

            Ws4idUserProfile.UserProfile2Record rec = getWs4idUser(adid);
            if (rec != null)
            {


                ClientResult UserResponse = LoadClientResult("userObject.UpsertUser", new DBParameter[] {
                    new DBParameter("@adid", DbType.AnsiString, rec.uuid),
                    new DBParameter("@loginId", DbType.AnsiString, rec.uuid),
                    new DBParameter("@EmployeeId", DbType.AnsiString, rec.empid),
                    new DBParameter("@UserFirstName", DbType.AnsiString, rec.firstname),
                    new DBParameter("@UserLastName", DbType.AnsiString, rec.lastname),
                    new DBParameter("@email", DbType.AnsiString, rec.upsEmail),
                    new DBParameter("@department", DbType.AnsiString, rec.department),
                    new DBParameter("@active", DbType.Boolean, true),
                    new DBParameter("@BusinessUnitId", DbType.AnsiString, rec.region+rec.district)
                });

                //  Add Location Save
                LoadClientResult("[userObject].[InsertUserLocation]", new DBParameter[] {
                    new DBParameter("@adid", DbType.AnsiString, rec.uuid),
                    new DBParameter("@Region", DbType.AnsiString, rec.region),
                    new DBParameter("@District", DbType.AnsiString, rec.district),
                    new DBParameter("@Center", DbType.AnsiString, rec.center),
                    new DBParameter("@Country", DbType.AnsiString, rec.country)
                });

                // Contact
                LoadClientResult("[userObject].[InsertUserContact]", new DBParameter[] {
                    new DBParameter("@adid", DbType.AnsiString, rec.uuid),
                    new DBParameter("@phone", DbType.AnsiString, rec.telephone),
                });

                return UserResponse;

            }
            else
            {
                return null;
            }
        }
        public ClientResult addUserByEmpId(string empId)
        {

            Ws4idUserProfile.UserProfile2Record rec = getWs4idUserEmpId(empId);
            if (rec != null)
            {


                ClientResult UserResponse = LoadClientResult("userObject.UpsertUser", new DBParameter[] {
                    new DBParameter("@adid", DbType.AnsiString, rec.uuid),
                    new DBParameter("@loginId", DbType.AnsiString, rec.uuid),
                    new DBParameter("@EmployeeId", DbType.AnsiString, rec.empid),
                    new DBParameter("@UserFirstName", DbType.AnsiString, rec.firstname),
                    new DBParameter("@UserLastName", DbType.AnsiString, rec.lastname),
                    new DBParameter("@email", DbType.AnsiString, rec.upsEmail),
                    new DBParameter("@department", DbType.AnsiString, rec.department),
                    new DBParameter("@active", DbType.Boolean, true),
                    new DBParameter("@BusinessUnitId", DbType.AnsiString, rec.region+rec.district)
                });

                //  Add Location Save
                LoadClientResult("[userObject].[InsertUserLocation]", new DBParameter[] {
                    new DBParameter("@adid", DbType.AnsiString, rec.uuid),
                    new DBParameter("@Region", DbType.AnsiString, rec.region),
                    new DBParameter("@District", DbType.AnsiString, rec.district),
                    new DBParameter("@Center", DbType.AnsiString, rec.center),
                    new DBParameter("@Country", DbType.AnsiString, rec.country)
                });

                // Contact
                LoadClientResult("[userObject].[InsertUserContact]", new DBParameter[] {
                    new DBParameter("@adid", DbType.AnsiString, rec.uuid),
                    new DBParameter("@phone", DbType.AnsiString, rec.telephone),
                });

                return UserResponse;
                //BIACore.Log.LogFactory.Error("Faux Add User");
                //return null;
            }
            else
            {
                return null;
            }
        }

        private Ws4idUserProfile.UserProfile2Record getWs4idUser(string query)
        {
            Ws4idUserProfile.getUserProfile2Request userRequest = new Ws4idUserProfile.getUserProfile2Request();
            userRequest.UserProfile2Request = new Ws4idUserProfile.UserProfile2Request();

            userRequest.UserProfile2Request.UserID = query.Trim();
            userRequest.UserProfile2Request.IDType = "uuid";

            try
            {
                Ws4idUserProfile.UserProfile2Port client = new Ws4idUserProfile.UserProfile2PortClient();
                Ws4idUserProfile.getUserProfile2Response response = client.getUserProfile2(userRequest);

                if (response.result.count > 0)
                    return response.result.record.First();
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }

            return null;
        }

        private Ws4idUserProfile.UserProfile2Record getWs4idUserEmpId(string query)
        {
            Ws4idUserProfile.getUserProfile2Request userRequest = new Ws4idUserProfile.getUserProfile2Request();
            userRequest.UserProfile2Request = new Ws4idUserProfile.UserProfile2Request();

            userRequest.UserProfile2Request.UserID = query.Trim();
            userRequest.UserProfile2Request.IDType = "empid";

            try
            {
                Ws4idUserProfile.UserProfile2Port client = new Ws4idUserProfile.UserProfile2PortClient();
                Ws4idUserProfile.getUserProfile2Response response = client.getUserProfile2(userRequest);

                if (response.result.count > 0)
                    return response.result.record.First();
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }

            return null;
        }
    }
}
