using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Data;
using System.Net.Mail;

using BIACore.Agent;
using BIACore.Agent.Task;

using BIACore.Model;
using BIACore.Provider;

namespace BIAService.Task
{
    public class RequestAccess : BaseTask
    {

        public class Emails
        {
            public string sysm { get; set; }
            public string AD_ID { get; set; }
            public string email { get; set; }
        }
        public class Requests
        {
            public string sysm { get; set; }
            public string adId { get; set; }
            public string email { get; set; }
            public string AppCode { get; set; }
            public string AppName { get; set; }

            public int RequestCount { get; set; }
            public int MinAging { get; set; }
            public int MaxAging { get; set; }
        }

        public class Deletes
        {
            public string Email { get; set; }
            public string FirstName { get; set; }
            public string Application_Name { get; set; }
        }

        public override TimeSpan Interval { get { return new TimeSpan(24, 0, 0); } set { } }

        public override bool Daily { get { return true; } set { } }

        public List<Emails> GetContacts()
        {
            return SQL.Execute<Emails>(Connections.NewSecurity, "roleObject.EmailReqSum_GetEmails", null);
        }

        public List<Requests> GetRequests(string adId)
        {
            return SQL.Execute<Requests>(Connections.NewSecurity, "roleObject.EmailReqSum_GetReqCount",
                new DBParameter("@adId", DbType.AnsiString, adId));
        }

        public List<Deletes> GetAccessDeletes()
        {
            return SQL.Execute<Deletes>(Connections.NewSecurity, "roleObject.DeleteAgingUserRequestInfo", null);
        }

        public void DeleteAgingRequest()
        {
            SQL.ExecuteNonQuery(Connections.NewSecurity, "roleObject.DeleteAgingUserRequest", null);
        }

        public override void Run()
        {
            try
            {
                List<Deletes> agingDeletes = GetAccessDeletes();
                foreach (var rec in agingDeletes)
                {
                    try
                    {
                        SendDelete(rec.Email, rec.FirstName, rec.Application_Name);
                    }
                    catch { }
                }

                DeleteAgingRequest();

                List<Emails> adminEmails = GetContacts();
                foreach (var rec in adminEmails)
                {
                    try
                    {
                        Send(rec.email, GetRequests(rec.AD_ID));
                    }
                    catch { }
                }
            }
            catch { }
        }

        public void Send(string email, List<Requests> requests)
        {
            try
            {

                using (MailMessage emailFrom = new MailMessage("bia@ups.com", "bia@ups.com"))
                {
                    emailFrom.To.Clear();
                    emailFrom.To.Add(email);

                    StringBuilder sb = new StringBuilder();
                    sb.AppendLine("<style>");
                    sb.AppendLine("table { border-collapse: collapse; }");
                    sb.AppendLine("table, td, th { font-family: sans-serif; font-size: 10pt; border: 1px solid black; }");
                    sb.AppendLine("th { background-color: #b0c4de }");
                    sb.AppendLine(".detail { background-color: #e6e6e6 }");
                    sb.AppendLine("h2, h3, h4, h5, h6 { font-family: sans-serif;} ");
                    sb.AppendLine(".note {font-weight: bold; color: red;}");
                    sb.AppendLine("</style>");
                    sb.AppendLine("<h2>Pending Requests for AD ID: " + requests[0].adId + " </h2>");
                    sb.AppendLine(string.Format("<h3>Open <a href='{0}'>BIA Security</a> to administer requests.</h3>",
                            "https://biasecurity." + BIACore.Settings.Config.Server
                        ));
                    sb.AppendLine(string.Format("<h5>Pending Request Summary as of {0}</h5>", DateTime.Now.ToString()));
                    sb.AppendLine("<table>");
                    sb.Append("<tr>");
                    sb.Append("<th>App Code</th>");
                    sb.Append("<th>App Name</th>");
                    sb.Append("<th>Pending Requests</th>"); 
                    sb.Append("<th>Oldest (days)</th>");
                    sb.AppendLine("</tr>");

                    for (int i = 0; i < 200 && i < requests.Count; ++i)
                    {
                        sb.AppendLine(MessageToChunk(requests[i]));
                    }

                    sb.AppendLine("</table>");
                    sb.AppendLine("<h4><span class='note'>NOTE:</span>The number of requests you see after logging in may vary. There are usually other administrators who have received similar pending request emails and may possibly administer these requests.</h4>");

                    emailFrom.Subject = string.Format("BIA Security ({0}) - You Have Pending User Requests", BIACore.Settings.Agent.Environment);
                    emailFrom.Body = sb.ToString();
                    emailFrom.IsBodyHtml = true;

                    using (SmtpClient client = new SmtpClient())
                    {
                        client.EnableSsl = true;
                        client.Send(emailFrom);
                    }

                    //MarkSent(appCode, contacts);
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }

        public string MessageToChunk(Requests r)
        {
            StringBuilder sb = new StringBuilder();

            sb.Append("<tr>");
            sb.Append(string.Format("<td>{0}</td>", r.AppCode));
            sb.Append(string.Format("<td>{0}</td>", r.AppName));
            sb.Append(string.Format("<td>{0}</td>", r.RequestCount));
            sb.Append(string.Format("<td>{0}</td>", r.MaxAging));
            sb.Append("</tr>");

            return sb.ToString();
        }

        public void SendDelete(string email, string firstName, string appName)
        {
            try
            {
                using (MailMessage emailFrom = new MailMessage("bia@ups.com", "bia@ups.com"))
                {
                    emailFrom.To.Clear();
                    emailFrom.To.Add(email);

                    StringBuilder sb = new StringBuilder();
                    sb.AppendLine(firstName + ",<br><br>");
                    sb.AppendLine("Your access request for " + appName + " has been pending for >30 days and has been automatically denied. ");
                    sb.AppendLine("Please try again if you need application access. <br><br>");
                    sb.AppendLine("--<br>");
                    sb.AppendLine(string.Format("<a href='{0}'>BIA Support</a>",
                            "https://forms.office.com/pages/responsepage.aspx?id=TQ5S56DVjUien5Sfqufc6FgeeZdemyVGupddyNzvoz9UN1lON1BDRjhLOENLV0tMMVFKU1A1NTJURy4u"
                        ));
                    
                    emailFrom.Subject = string.Format("BIA Request Notification ({0}) - Expired App Access Request", appName);
                    emailFrom.Body = sb.ToString();
                    emailFrom.IsBodyHtml = true;

                    using (SmtpClient client = new SmtpClient())
                    {
                        client.EnableSsl = true;
                        client.Send(emailFrom);
                    }
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }
    }
}