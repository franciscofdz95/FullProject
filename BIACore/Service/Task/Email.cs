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
    public class Email : BaseTask
    {
        public class Error
        {
            public Int64 LogId { get; set; }
            public Guid TransactionId { get; set; }
            public string AppCode { get; set; }
            public string UserId { get; set; }
            public DateTime Date { get; set; }
            public string Server { get; set; }
            public string Level { get; set; }
            public string Event { get; set; }
            public string Detail { get; set; }
        }

        public override TimeSpan Interval { get { return new TimeSpan(0, 5, 0); } set { } }

        public List<string> GetContacts(string AppCode)
        {
            return SQL.ExecuteToString(Connections.Security, "secObject.getAppEmails", new DBParameter("@AppCode", DbType.AnsiString, AppCode));
        }

        public List<string> GetAppCodes()
        {
            return SQL.ExecuteToString(Connections.Security, "appObject.Email_AppCodes", null);
        }

        public List<Error> GetErrors(string appCode)
        {
            return SQL.Execute<Error>(Connections.Security, "appObject.Email_Digest",
                new DBParameter("@AppCode", DbType.AnsiString, appCode));
        }

        public void MarkSent(string appCode, List<string> recipients)
        {
            SQL.ExecuteNonQuery(Connections.Security, "appObject.Email_Mark",
                new DBParameter("@AppCode", DbType.AnsiString, appCode),
                new DBParameter("@Recipients", DbType.AnsiString, string.Join(";", recipients)));
        }

        public override void Run()
        {
            try
            {
                List<string> appCodes = GetAppCodes();
                foreach (string appCode in appCodes)
                {
                    try
                    {
                        Send(appCode, GetErrors(appCode));
                    }
                    catch { }
                }
            }
            catch { throw; }
        }

        public void Send(string appCode, List<Error> errors)
        {
            try
            {
                List<string> contacts = GetContacts(appCode);

                if (contacts == null || contacts.Count == 0)
                {
                    MarkSent(appCode, contacts);
                    return;
                }

                using (MailMessage email = new MailMessage("bia@ups.com", "bia@ups.com"))
                {
                    email.To.Clear();
                    email.To.Add(string.Join(",", contacts));

                    StringBuilder sb = new StringBuilder();
                    sb.AppendLine("<style>");
                    sb.AppendLine("table { border-collapse: collapse; }");
                    sb.AppendLine("table, td, th { font-family: sans-serif; font-size: 8pt; border: 1px solid black; }");
                    sb.AppendLine("th { background-color: #b0c4de }");
                    sb.AppendLine(".detail { background-color: #e6e6e6 }");
                    sb.AppendLine("</style>");
                    sb.AppendLine("<table>");
                    sb.Append("<tr>");
                    sb.Append("<th>Link</th>");
                    sb.Append("<th>Date</th>");
                    sb.Append("<th>User</th>");
                    sb.Append("<th>Server</th>");
                    sb.Append("<th>Event</th>");
                    sb.AppendLine("</tr>");

                    for (int i = 0; i < 100 && i < errors.Count; ++i)
                    {
                        sb.AppendLine(MessageToChunk(errors[i]));
                    }

                    sb.AppendLine("</table>");
                    sb.AppendLine("<br>");
                    sb.AppendLine("* Order of messages is not guaranteed<br>");
                    sb.AppendLine("* All times are in UTC and server-generated and so may be several seconds off the actual error time<br>");
                    if (errors.Count > 100)
                    {
                        //sb.AppendLine(string.Format("* Only displaying 100 errors; for a complete list go to <a href=\"{0}{1}#!log\">{2}</a><br>",
                        //    BIACore.Settings.Config.Server,
                        //    BIACore.Settings.Config.BaseURL));
                        sb.Append(string.Format("<td><a href='{0}{1}default.aspx?historyToken=gotoNewContent~{{xtype:\"App-View-Admin-Logs-Container\",noChangeIfSameXtype: true,deeplinkData: {{currentPage: 1,filterParams: {{ AppCode: [\"{2}\"] }}}}}}'></a></td>",
                                "https://biasecurity." + BIACore.Settings.Config.Server,
                                BIACore.Settings.Config.LogURL,
                                appCode.ToUpper()
                            ));
                    }

                    email.Subject = string.Format("ERROR: BIA {1} - {0} [ExtJS/.Net] ", appCode, BIACore.Settings.Agent.Environment);
                    email.Body = sb.ToString();
                    email.IsBodyHtml = true;

                    using (SmtpClient client = new SmtpClient())
                    {
                        client.EnableSsl = true;
                        client.Send(email);
                    }

                    MarkSent(appCode, contacts);
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }

        public string MessageToChunk(Error e)
        {
            StringBuilder sb = new StringBuilder();

            sb.Append("<tr>");
            //string linkCell = string.Format("<td><a href=\"{0}{1}#!detail/LogId={2}\">{2}</a></td>",
            //    BIACore.Settings.Config.Server,
            //    BIACore.Settings.Config.BaseURL,
            //    e.LogId);
            DateTime utc = DateTime.SpecifyKind(e.Date, DateTimeKind.Utc);
            string linkCell = string.Format("<td><a href='{0}{1}default.aspx?historyToken=gotoNewContent~{2}|{3}'>{2}</a></td>",
                "https://biasecurity." + BIACore.Settings.Config.Server
                , BIACore.Settings.Config.LogURL
                , e.LogId
                , e.AppCode.ToUpper()
            );
            sb.Append(linkCell);
            sb.Append(string.Format("<td>{0}</td>", utc.ToString("u")));
            sb.Append(string.Format("<td>{0}</td>", e.UserId));
            sb.Append(string.Format("<td>{0}</td>", e.Server));
            sb.Append(string.Format("<td>{0}</td>", e.Event));
            sb.Append("</tr>");
            sb.Append("<tr>");
            sb.Append(string.Format("<td colspan=\"5\" class=\"detail\">{0}</td>", e.Detail));
            sb.Append("</tr>");

            return sb.ToString();
        }
    }
}