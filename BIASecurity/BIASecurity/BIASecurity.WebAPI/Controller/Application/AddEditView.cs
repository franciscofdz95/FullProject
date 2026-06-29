using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Model;

namespace BIASecurity.WebAPI.Controller
{
    public partial class BIASecurityController
    {
        [HttpPost]
        [ActionName("AppBaseInfo")]
        public ClientResult AppBaseInfo([FromBody] dynamic request)
        {
            return LoadClientResult("dynAppObject.GetAppBasic", new DBParameter[] {
                new DBParameter("@appCode",DbType.AnsiString, request.appCode != null ? request.appCode.Value : null),
                new DBParameter("@formType",DbType.AnsiString, request.formType != null ? request.formType.Value : null)
            });
        }

        [HttpPost]
        [ActionName("AppSummary")]
        public ClientResult AppSummary([FromBody] dynamic request)
        {
            return LoadClientResult("dynAppObject.GetAppProfile", new DBParameter[] {
                new DBParameter("@appCode",DbType.AnsiString, request.appCode != null ? request.appCode.Value : null)
            });
        }

        [HttpPost]
        [ActionName("ApplicationSubscriptions")]
        public ClientResult ApplicationSubscriptions([FromBody] dynamic request)
        {
            return LoadClientResult("[dynAppObject].[GetSubscriptions]", new DBParameter[] {
                new DBParameter("@appCode",DbType.AnsiString, request.appCode != null ? request.appCode.Value : null)
            });
        }

        [HttpPost]
        [ActionName("InsertApplicationSubscription")]
        public ClientResult InsertApplicationSubscription([FromBody] dynamic request)
        {
            return LoadClientResult("[appObject].[InsertApplicationSubscription]", new DBParameter[] {
                new DBParameter("@appCode", DbType.AnsiString, request.appCode.Value),
                new DBParameter("@userId", DbType.Int32, request.userId.Value),
                new DBParameter("@subscriptionTypeId", DbType.Int32, request.subscriptionTypeId.Value)
            });
        }

        [HttpPost]
        [ActionName("DeleteApplicationSubscription")]
        public ClientResult DeleteApplicationSubscription([FromBody] dynamic request)
        {
            return LoadClientResult("[appObject].[DeleteApplicationSubscription]", new DBParameter[] {
                new DBParameter("@appCode", DbType.AnsiString, request.appCode.Value),
                new DBParameter("@userId", DbType.Int32, request.userId.Value),
                new DBParameter("@subscriptionTypeId", DbType.Int32, request.subscriptionTypeId.Value)
            });
        }

        [HttpPost]
        [ActionName("AddApplication")]
        public ClientResult AddApplication([FromBody] dynamic request)
        {
            if (!BIACore.Security.User.isSA)
                throw new HttpResponseException(System.Net.HttpStatusCode.Forbidden);

            return LoadClientResult("[appObject].[UpsertApplication]", new DBParameter[] {
                new DBParameter("@appCode", DbType.AnsiString, request.App_AppCode.Value),
                new DBParameter("@userId", DbType.AnsiString, BIACore.Security.Session.userId),
                new DBParameter("@actionType", DbType.AnsiString, "Insert"),
                new DBParameter("@AppName", DbType.AnsiString, request.App_Name.Value),
                new DBParameter("@APRSAppKey", DbType.AnsiString, "N/A"),
                new DBParameter("@APRSAppId", DbType.AnsiString, "N/A")
            });

        }

        [HttpPost]
        [ActionName("AddEditApplication")]
        public ClientResult AddEditApplication([FromBody] dynamic request)
        {

            if (BIACore.Security.User.isSA)
            {

                List<DBParameter> args = new List<DBParameter>();

                if (!string.IsNullOrEmpty(request.App_AppCode.Value)) args.Add(new DBParameter("@appCode", DbType.AnsiString, request.App_AppCode.Value));
                args.Add(new DBParameter("@userId", DbType.AnsiString, BIACore.Security.Session.userId));
                args.Add(new DBParameter("@actionType", DbType.AnsiString, "Update"));

                if (request.App_APRSAppKey != null && !string.IsNullOrEmpty(request.App_APRSAppKey.Value)) args.Add(new DBParameter("@APRSAppKey", DbType.AnsiString, request.App_APRSAppKey.Value));
                if (request.App_APRSAppId != null && !string.IsNullOrEmpty(request.App_APRSAppId.Value)) args.Add(new DBParameter("@APRSAppId", DbType.AnsiString, request.App_APRSAppId.Value));
                if (request.App_Name != null && !string.IsNullOrEmpty(request.App_Name.Value)) args.Add(new DBParameter("@AppName", DbType.AnsiString, request.App_Name.Value));
                if (request.App_Description != null && !string.IsNullOrEmpty(request.App_Description.Value)) args.Add(new DBParameter("@Description", DbType.AnsiString, request.App_Description.Value));
                
                if (request.App_Active != null) args.Add(new DBParameter("@Active", DbType.AnsiString, request.App_Active.Value ? "Y" : "N"));
                if (request.App_Active_Msg != null && !string.IsNullOrEmpty(request.App_Active_Msg.Value)) args.Add(new DBParameter("@Active_Msg", DbType.AnsiString, request.App_Active_Msg.Value));
                if (request.App_ReturnPath != null && !string.IsNullOrEmpty(request.App_ReturnPath.Value)) args.Add(new DBParameter("@ReturnPath", DbType.AnsiString, request.App_ReturnPath.Value));
                if (request.App_Icon != null && !string.IsNullOrEmpty(request.App_Icon.Value)) args.Add(new DBParameter("@AppLogo", DbType.AnsiString, request.App_Icon.Value));
                if (request.App_FAQ != null) args.Add(new DBParameter("@FAQ", DbType.AnsiString, request.App_FAQ.Value));

                if (request.App_ExtendedAttrib != null) args.Add(new DBParameter("@ExtendedAttrib", DbType.AnsiString, request.App_ExtendedAttrib.Value ? "Y" : "N"));
                if (request.App_ExtendedAttribTable != null && !string.IsNullOrEmpty(request.App_ExtendedAttribTable.Value)) args.Add(new DBParameter("@ExtendedAttribTable", DbType.AnsiString, request.App_ExtendedAttribTable.Value));
                if (request.App_ExtendedAttribPath != null && !string.IsNullOrEmpty(request.App_ExtendedAttribPath.Value)) args.Add(new DBParameter("@ExtendedAttribPath", DbType.AnsiString, request.App_ExtendedAttribPath.Value));
                if (request.App_ExtendedAttribAccess != null) args.Add(new DBParameter("@ExtendedAttribAccess", DbType.AnsiString, string.Join(",", request.App_ExtendedAttribAccess)));

                if (request.App_ProjectMgr != null && !string.IsNullOrEmpty(request.App_ProjectMgr.Value)) args.Add(new DBParameter("@ProjectMgr", DbType.AnsiString, request.App_ProjectMgr.Value));
                if (request.App_ProjectMgr_Email != null && !string.IsNullOrEmpty(request.App_ProjectMgr_Email.Value)) args.Add(new DBParameter("@ProjectMgr_Email", DbType.AnsiString, request.App_ProjectMgr_Email.Value));
                if (request.App_contactEmail != null && !string.IsNullOrEmpty(request.App_contactEmail.Value)) args.Add(new DBParameter("@contactEmail", DbType.AnsiString, request.App_contactEmail.Value));
                if (request.App_HexColor != null && !string.IsNullOrEmpty(request.App_HexColor.Value)) args.Add(new DBParameter("@HexColor", DbType.AnsiString, request.App_HexColor.Value));
                if (request.App_multiLevelAccess != null) args.Add(new DBParameter("@multiLevelAccess", DbType.Int32, request.App_multiLevelAccess.Value ? 1 : 0));
                if (request.App_Visibility != null) args.Add(new DBParameter("@Visibility", DbType.AnsiString, request.App_Visibility.Value ? "Y" : "N"));
                if (request.App_showOnRequestPage != null) args.Add(new DBParameter("@showOnRequestPage", DbType.Int32, request.App_showOnRequestPage.Value ? 1 : 0));
                if (request.App_Req_App_Visible != null) args.Add(new DBParameter("@Req_App_Visible", DbType.AnsiString, request.App_Req_App_Visible.Value ? "Y" : "N"));
                if (request.App_TrapErrors != null) args.Add(new DBParameter("@TrapErrors", DbType.AnsiString, request.App_TrapErrors.Value ? "Y" : "N"));
                if (request.App_Secured != null) args.Add(new DBParameter("@SecuredApp", DbType.AnsiString, request.App_Visibility.Value ? "Y" : "N"));

                if (request.App_isSecured != null) args.Add(new DBParameter("@isSecured", DbType.Int32, request.App_isSecured.Value ? 1 : 0));
                if (request.App_APRSEnabled != null) args.Add(new DBParameter("@APRSEnabled", DbType.Int16, request.App_APRSEnabled.Value ? 1 : 0));
                if (request.App_ShowToolBar != null) args.Add(new DBParameter("@ShowToolBar", DbType.AnsiString, request.App_ShowToolBar.Value ? "Y" : "N"));
                if (request.App_ShowLocation != null) args.Add(new DBParameter("@ShowLocation", DbType.AnsiString, request.App_ShowLocation.Value ? "Y" : "N"));
                if (request.App_DefaultGeoAccess != null) args.Add(new DBParameter("@DefaultGeoAccess", DbType.Int32, request.App_DefaultGeoAccess.Value));

                return LoadClientResult("[appObject].[UpsertApplication]", args.ToArray());

            }
            else throw new HttpResponseException(System.Net.HttpStatusCode.Forbidden);

        }

        [HttpPost]
        [ActionName("GetAppGeos")]
        public ClientResult GetAppGeos([FromBody] dynamic request)
        {
            return LoadClientResult("[appObject].[GetAppGeos]", new DBParameter[] {
                new DBParameter("@appCode", DbType.AnsiString, request.appCode.Value)
            });
        }

        [HttpPost]
        [ActionName("DelsertAppGeos")]
        public ClientResult DelsertAppGeos([FromBody] dynamic request)
        {

            if (BIACore.Security.User.isSA)
            {
                return LoadClientResult("[appObject].[DelsertAppGeos]", new DBParameter[] {
                new DBParameter("@appCode", DbType.AnsiString, request.appCode.Value),
                new DBParameter("@businessUnitId", DbType.AnsiString, request.businessUnitId.Value),
                new DBParameter("@geoGroupCode", DbType.AnsiString, request.geoGroupCode.Value),
                new DBParameter("@geoCode", DbType.AnsiString, request.geoCode.Value),
                new DBParameter("@userId", DbType.AnsiString, BIACore.Security.Session.ad_id),
                new DBParameter("@action", DbType.AnsiString, request.action.Value)
                });
            }
            else throw new HttpResponseException(System.Net.HttpStatusCode.Forbidden);

        }

    }
}
