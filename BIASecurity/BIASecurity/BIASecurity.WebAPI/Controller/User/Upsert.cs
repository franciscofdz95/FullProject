using System.Data;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;

namespace BIASecurity.WebAPI.Controller
{
    /// <summary>
    /// Initialize Controller : BIASecurity
    /// </summary>
    public partial class BIASecurityController
    {
        #region USER
        /// <summary>
        /// API : Upsert User
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertUser")]
        public ClientResult UpsertUser([FromBody] dynamic request)
        {
            return ExecuteUser(request, "user.UpsertUser");
        }

        /// <summary>
        /// API : Upsert User Address
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertUserAddress")]
        public ClientResult UpsertUserAddress([FromBody] dynamic request)
        {
            return ExecuteUserAddress(request, "user.UpsertUserAddress");
        }

        /// <summary>
        /// API : Upsert User Contact
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertUserContact")]
        public ClientResult UpsertUserContact([FromBody] dynamic request)
        {
            return ExecuteUserContact(request, "user.UpsertUserContact");
        }

        /// <summary>
        /// API : Upsert User Delegate
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertUserDelegate")]
        public ClientResult UpsertUserDelegate([FromBody] dynamic request)
        {
            return ExecuteUserDelegate(request, "user.UpsertUserDelegate");
        }

        /// <summary>
        /// API : Upsert User Location
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertUserLocation")]
        public ClientResult UpsertUserLocation([FromBody] dynamic request)
        {
            return ExecuteUserLocation(request, "user.UpsertUserLocation");
        }
        #endregion

        #region Private Methods
        /// <summary>
        /// Common Execute User 
        /// </summary>
        /// <param name="request"></param>
        /// <param name="procedureName"></param>
        /// <returns></returns>
        private ClientResult ExecuteUser(dynamic request, string procedureName)
        {
            return LoadClientResult(procedureName, new DBParameter[] {
                 //new DBParameter("@userId", DbType.Int32, request.UserId != null ? request.UserId.Value : null),
                new DBParameter("@adid", DbType.AnsiString, request.ADID != null ? request.ADID.Value : null),
                new DBParameter("@loginId", DbType.AnsiString, request.LoginId != null ? request.LoginId.Value : null),
                new DBParameter("@EmployeeId", DbType.AnsiString, request.EmployeeId != null ? request.EmployeeId.Value : null),
                new DBParameter("@srId", DbType.AnsiString, request.SRID != null ? request.SRID.Value : null),
                new DBParameter("@preferredName", DbType.AnsiString, request.PreferredName != null ? request.PreferredName.Value : null),
                new DBParameter("@email", DbType.AnsiString, request.Email != null ? request.Email.Value : null),
                new DBParameter("@authenticationString ", DbType.AnsiString, request.AuthencationString != null ? request.AuthencationString.Value : null),
                new DBParameter("@UserFirstName", DbType.AnsiString, request.FirstName != null ? request.UserFirstName.Value : null),
                new DBParameter("@UserLastName", DbType.AnsiString, request.LastName != null ? request.UserLastName.Value : null),
                new DBParameter("@active", DbType.Boolean, request.Active != null ? request.Active.Value : null),
            });
        }
        /// <summary>
        /// Common Execute User Address
        /// </summary>
        /// <param name="request"></param>
        /// <param name="procedureName"></param>
        /// <returns></returns>
        private ClientResult ExecuteUserAddress(dynamic request, string procedureName)
        {
            return LoadClientResult(procedureName, new DBParameter[] {
                 //new DBParameter("@userAddressId", DbType.Int32, request.UserAddressId  != null ? request.UserAddressId .Value : null),
                new DBParameter("@street1", DbType.AnsiString, request.Street1  != null ? request.Street1.Value : null),
                new DBParameter("@street2", DbType.AnsiString, request.Street2  != null ? request.Street2.Value : null),
                new DBParameter("@aptUnit", DbType.AnsiString, request.Apt_Unit  != null ? request.Apt_Unit.Value : null),
                new DBParameter("@city", DbType.AnsiString, request.City   != null ? request.City .Value : null),
                new DBParameter("@stateProvince", DbType.AnsiString, request.StateProvince  != null ? request.StateProvince.Value : null),
                new DBParameter("@country", DbType.AnsiString, request.Country   != null ? request.Country .Value : null),
                new DBParameter("@zip", DbType.AnsiString, request.Zip   != null ? request.Zip.Value : null),
            });
        }

        /// <summary>
        /// Common Execute User Contact
        /// </summary>
        /// <param name="request"></param>
        /// <param name="procedureName"></param>
        /// <returns></returns>
        private ClientResult ExecuteUserContact(dynamic request, string procedureName)
        {
            return LoadClientResult(procedureName, new DBParameter[] {
                 //new DBParameter("@userContactId", DbType.Int32, request.UserContactId  != null ? request.UserContactId .Value : null),
                 new DBParameter("@userId", DbType.Int32, request.UserId != null ? request.UserId.Value : null),
                 new DBParameter("@contactTypeId", DbType.Int32, request.ContactTypeId  != null ? request.ContactTypeId .Value : null),
                new DBParameter("@value", DbType.AnsiString, request.Value  != null ? request.Value .Value : null),
                new DBParameter("@property", DbType.AnsiString, request.Property  != null ? request.Property .Value : null),
            });
        }

        /// <summary>
        /// Commn Execute User Delegate
        /// </summary>
        /// <param name="request"></param>
        /// <param name="procedureName"></param>
        /// <returns></returns>
        private ClientResult ExecuteUserDelegate(dynamic request, string procedureName)
        {
            return LoadClientResult(procedureName, new DBParameter[] {
                 //new DBParameter("@delegateId", DbType.Int32, request.DelegateId != null ? request.DelegateId.Value : null),
                 new DBParameter("@userId", DbType.Int32, request.UserId != null ? request.UserId.Value : null),
                 new DBParameter("@delegateUserId", DbType.Int32, request.DelegateUserId != null ? request.DelegateUserId.Value : null),
            });
        }

        /// <summary>
        /// Common Excute User Location
        /// </summary>
        /// <param name="request"></param>
        /// <param name="procedureName"></param>
        /// <returns></returns>
        private ClientResult ExecuteUserLocation(dynamic request, string procedureName)
        {
            return LoadClientResult(procedureName, new DBParameter[] {
                 //new DBParameter("@userLocationId", DbType.Int64, request.UserLocationId  != null ? request.UserLocationId .Value : null),
                 new DBParameter("@userId", DbType.Int32, request.UserId != null ? request.UserId.Value : null),
                 new DBParameter("@locationTypeId", DbType.Int32, request.LocationTypeId != null ? request.LocationTypeId.Value : null),
                new DBParameter("@country", DbType.AnsiString, request.Country != null ? request.Country.Value : null),
                new DBParameter("@region", DbType.AnsiString, request.Region != null ? request.Region.Value : null),
                new DBParameter("@district", DbType.AnsiString, request.District != null ? request.District.Value : null),
                new DBParameter("@center", DbType.AnsiString, request.Center != null ? request.Center.Value : null),
            });
        }
        #endregion
    }
}
