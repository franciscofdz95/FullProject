using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;
using System.Linq;

using BIACore.Model;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Util;
using BIASecurity.WebAPI.Model;

namespace BIASecurity.WebAPI.Controller
{
    public partial class BIASecurityController
    {
        [HttpPost]
        [ActionName("GeoSearch")]
        public ClientResult GeoSearch([FromBody] dynamic request)
        {
            return LoadClientResult("roleObject.GeoSearch", new DBParameter[] {
                new DBParameter("@search",DbType.AnsiString, request.query != null ? request.query.Value : null),
                new DBParameter("@appCode",DbType.AnsiString, request.appCode.Value)
            });
        }

        [HttpPost]
        [ActionName("NewAccessRequest")]
        public ClientResult NewAccessRequest([FromBody] dynamic request)
        {
            // Get the Requester Email

            //string host = string.Empty;
            //if (BIACore.Settings.Config.BIAEnvironment == "DEV")
            //    host = "biadev";
            //else if (BIACore.Settings.Config.BIAEnvironment == "QA")
            //    host = "biaqa";
            //else if (BIACore.Settings.Config.BIAEnvironment == "ALPHA")
            //    host = "biaalpha";
            //else if (BIACore.Settings.Config.BIAEnvironment == "PROD")
            //    host = "bia";

            //string baseUrl = string.Empty;
            //baseUrl = "https://biasecurity." + host + ".inside.ups.com/";

            //List<dynamic> requestorIsAdmin = getRequestorIsAdmin(BIACore.Security.Session.userId, request.appCode.Value);
            //dynamic adminTest = requestorIsAdmin.FirstOrDefault();

            //if (adminTest == null || string.IsNullOrWhiteSpace(adminTest.ADID))
            //{

            //    List<dynamic> requestorEmail = getGetUserEmail(request.requestUserId.Value); // 5/18/2021 MME - This is really the users AD ID!

            //    dynamic requestor = requestorEmail.FirstOrDefault();

            //    string subject = string.Empty;
            //    string body = string.Empty;
            //    subject += "BIASecurity Access Request Submitted - Application: " + request.appCode.Value;
            //    body += "An Access Request has been submitted for you by " + requestor.FirstName + " " + requestor.LastName + "(" + request.requestUserId.Value + ") for the " + request.appCode.Value + " application.</BR>";
            //    body += "You will receive a confirmation email when the request is approved or denied.<BR>";
            //    body += "You can check on the status of this request in the <A HREF='" + baseUrl + "' target = '_blank' > BIA Security Application </A>.</BR>";
            //    body += "<i>Please do not respond to this email.</i>";

            //    Email.sendEmail("bia@ups.com", new List<string>() { requestor.Email }, subject, body, "Text", "Requestor Email");

            //    // Get the Approver Emails
            //    List<dynamic> approverEmail = getApproverEmail(request.appCode.Value);


            //    subject = "BIASecurity Access Request Pending Approval - Application: " + request.appCode.Value;
            //    body = "An Access Request has been submitted for " + requestor.FirstName + " " + requestor.LastName + "(" + request.requestUserId.Value + ")</BR>";
            //    body += "<P>Please log into BIASecurity to approve the request.";
            //    body += "<A HREF='" + baseUrl + "' target='_blank'>BIA Security Application</A>";
            //    body += "<P><b>Why am I receiving this email?</b> You are assigned as an Admin or SA for the " + request.appCode.Value + " application in BIA Security. If this is no longer valid, you can remove your Admin access to this application within the BIASecurity application.";



            //    foreach (dynamic approver in approverEmail)
            //    {
            //        Email.sendEmail("bia@ups.com", new List<string>() { approver.Email }, subject, body, "Text", "Approver Email");
            //    }

            //}

            return LoadClientResult("roleObject.AccessRequest", new DBParameter[] {
                new DBParameter("@requestUserId",DbType.AnsiString, request.requestUserId.Value),
                new DBParameter("@appCode",DbType.AnsiString, request.appCode.Value),
                new DBParameter("@geoListingID",DbType.AnsiString, request.geoListingID.Value),
                new DBParameter("@securityLevel",DbType.AnsiString, request.securityLevel.Value),
                new DBParameter("@userId",DbType.AnsiString, BIACore.Security.User.adId),
                new DBParameter("@requestReason",DbType.AnsiString, request.requestReason.Value)
            });

        }

        [HttpPost]
        [HttpGet]
        [ActionName("AccessAction")]
        public ClientResult AccessAction([FromBody] dynamic request)
        {

            if (request.action != null)
            {

                List<dynamic> requestResult = getRequestInfo((int)request.accessId.Value, request.action.Value);
                dynamic requestInfo = requestResult.FirstOrDefault();

                List<dynamic> approverIsAdmin = getRequestorIsAdmin(BIACore.Security.Session.userId, requestInfo.application_code);
                dynamic adminInfo = approverIsAdmin.FirstOrDefault();

                if ((BIACore.Security.User.isSA || BIACore.Security.User.isAdmin) && (adminInfo != null && !string.IsNullOrWhiteSpace(adminInfo.ADID)))
                {

                    List<dynamic> requestorEmail = getGetRequestUserEmail((int)request.accessId.Value);
                    List<dynamic> approverInfo = getGetUserEmail(BIACore.Security.User.adId);

                    //if ()
                        dynamic requestor = requestorEmail.FirstOrDefault();
                        dynamic approver = approverInfo.FirstOrDefault();

                        string subject = string.Empty;
                        string body = string.Empty;

                        string action = request.action.Value;
                        string actionAdj = string.Empty;

                        if (action == "Approve") actionAdj = "Approved";
                        if (action == "Deny") actionAdj = "Denied";
                        if (action == "Remove") actionAdj = "Removed";

                        subject += "BIASecurity Access Request - " + actionAdj;
                        body += "Your request for access to  - " + requestor.AppCode + " has been <B>" + actionAdj + "</B> for the following reason: </BR>";
                        body += "<B>" + request.reason.Value + "</B></BR>";
                        body += "The request was " + actionAdj + " by " + approver.FirstName + " " + approver.LastName + "(" + BIACore.Security.User.adId + ")</BR>";
                        body += "</P><i>Please do not respond to this email, you can contact the approver via email or skype if you have any questions.</i>";

                        Email.sendEmail("bia@ups.com", new List<string>() { requestor.Email }, subject, body, "Text", "Requestor Status Email");

                    if (action == "Approve")
                        return LoadClientResult("roleObject.ApproveUserAccess",
                            new DBParameter("@applicationUserGeoRequestID", DbType.Int32, request.accessId.Value),
                            new DBParameter("@adminsysm", DbType.String, BIACore.Security.User.userId));
                    else if (action == "Deny")
                        return LoadClientResult("roleObject.DenyUserAccess",
                            new DBParameter("@applicationUserGeoRequestID", DbType.Int32, request.accessId.Value),
                            new DBParameter("@reason", DbType.String, request.reason.Value),
                            new DBParameter("@adminsysm", DbType.String, BIACore.Security.User.userId));
                    else if (action == "Remove")
                        return LoadClientResult("roleObject.RemoveUserAccess",
                            new DBParameter("@applicationUserGeoID", DbType.Int32, request.accessId.Value),
                            new DBParameter("@adminsysm", DbType.String, BIACore.Security.User.userId));
                }
            }

            return null;
        }

        private List<dynamic> getRequestorIsAdmin(string userId, string appCode)
        {
            return LoadResult("userObject.GetRequestorIsAdmin", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, userId),
                new DBParameter("@appCode",DbType.AnsiString, appCode)

            });
        }

        private List<dynamic> getRequestInfo(int requestId, string action)
        {
            return LoadResult("roleObject.GetRequestInfo", new DBParameter[] {
                new DBParameter("@requestId",DbType.Int32, requestId),
                new DBParameter("@action",DbType.AnsiString, action)
            });
        }

        private List<dynamic> getGetUserEmail(string userId)
        {
            return LoadResult("userObject.GetUserEmail", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, userId)
            });
        }

        private List<dynamic> getGetRequestUserEmail(int requestId)
        {
        return LoadResult("userObject.GetRequestUserEmail", new DBParameter[] {
                new DBParameter("@requestId",DbType.Int32, requestId)
            });
        }

        private List<dynamic> getApproverEmail(string appCode)
        {
        return LoadResult("userObject.[GetApproverEmail]", new DBParameter[] {
                new DBParameter("@appCode",DbType.AnsiString, appCode)
            });
        }

        [HttpPost]
        [ActionName("AccessSummary")]
        public ClientResult AccessSummary([FromBody] dynamic request)
        {
            return LoadClientResult("[roleObject].[GetAccessSummary]", new DBParameter[] {
                new DBParameter("@accessId",DbType.AnsiString, request.accessId != null ? request.accessId.Value : null)
            });
        }        
    }
}
