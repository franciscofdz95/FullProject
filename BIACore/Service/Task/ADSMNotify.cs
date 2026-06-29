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
    public class ADSMNotify : BaseTask
    {
        public override TimeSpan Interval { get { return new TimeSpan(0, 15, 0); } set { } }

        public List<dynamic> GetProcessListForEmail()
        {
            return SQL.Execute<dynamic>(Connections.NewSecurity, "evt.GetPastSLAProcessForEmail", null);
        }

        public void MarkSent(int ProcessId)
        {
            SQL.ExecuteNonQuery(Connections.NewSecurity, "evt.UpsertEmailHistory", new DBParameter("@ProcessId", DbType.AnsiString, ProcessId));
        }

        public void UpdateEmailReminder(bool EODProcessed, bool BODProcessed)
        {
            SQL.ExecuteNonQuery(Connections.NewSecurity, "evt.UpsertEmailReminder", new DBParameter[] {
                new DBParameter("@EOD", DbType.AnsiString, EODProcessed ? 1 : 0),
                new DBParameter("@BOD", DbType.AnsiString, BODProcessed ? 1 : 0)
                }
            );
        }

        public override void Run()
        {
            bool EODProcessed = false;
            bool BODProcessed = false;
            try
            {
                List<dynamic> processes = GetProcessListForEmail();
                foreach (dynamic process in processes)
                {
                    try
                    {
                        Send(process);
                        if (process.ReminderType == "EOD") EODProcessed = true;
                        if (process.ReminderType == "BOD") BODProcessed = true;
                    }
                    catch (Exception ex2) {

                    }
                }
                UpdateEmailReminder(EODProcessed, BODProcessed);
            }
            catch(Exception ex) {

            }
        }

        public void Send(dynamic Process)
        {
            try
            {
                using (MailMessage email = new MailMessage("bia@ups.com", "bia@ups.com"))
                {
                    email.To.Clear();
                    if (Process.MgrEmailAddress == null)
                    {
                        email.To.Add(Process.CCEmailAddress);
                    }
                    else {
                        email.To.Add(Process.MgrEmailAddress);
                        email.CC.Add(Process.CCEmailAddress);
                    }

                    if (Process.AppCode == "BIASecurity") email.CC.Add("shogan@ups.com");

                    email.Subject = string.Format("ADSM: {0} - {1} Process is Past the SLA window (Late)", 
                        Process.AppCode, Process.Name);

                    if (Process.ReminderType == "BOD") email.Subject += " [Beginning of Day Reminder]";
                    if (Process.ReminderType == "EOD") email.Subject += " [End of Day Reminder]";

                    String ExpectedRunDate = ((DateTime)Process.NextDate).ToString("MM/dd/yyyy hh:mm tt 'EST'");
                    String LateDate = ((DateTime)Process.LateDate).ToString("MM/dd/yyyy hh:mm tt 'EST'");
                    StringBuilder sb = new StringBuilder();
                    sb.AppendLine("<style>");
                    sb.AppendLine("body, div, a { font-size: 14px; font-family: arial, sans-serif; }");
                    sb.AppendLine(".Section { margin-bottom: 14px }");
                    sb.AppendLine(".Emphasis { font-weight: bold }");
                    sb.AppendLine("</style>");
                    sb.AppendLine("<div class='body'>");
                    sb.AppendLine("<div class='Section'></div>");
                    sb.AppendLine(String.Format("<div class='Section'>The ADSM (Application Data Set Monitor) has found the {0} - {1} process as late, this includes a {2} hour SLA window.</div>",
                        Process.AppCode, Process.Name, Math.Round((decimal)Process.SLAWindowMins / 60,1)));
                    sb.AppendLine("<div class='Section'>");
                    sb.AppendLine(String.Format("<div class='Emphasis'>Expected Run Date: {0}</div>",ExpectedRunDate));
                    sb.AppendLine(String.Format("<div>Missed SLA Date: {0}</div>", LateDate));
                    sb.AppendLine(String.Format("<div>Current Data Date: {0}</div>", Process.CurrentDataDate));
                    sb.AppendLine(String.Format("<div>Average Frequency: {0}</div>", MinsToLargestTimeInterval((double)Process.AvgMinSinceLastProcessedDT)));
                    sb.AppendLine("</div>");
                    sb.AppendLine("<div class='Section'>");
                    sb.AppendLine(String.Format("<div>Process Detail: <a href='{0}'>View Process In ADSM</a></div>", GetADSMProcessItemLink(Process)));
                    sb.AppendLine(String.Format("<div>ADSM Late List: <a href='{0}'>View List of Problem Processes in ADSM</a></div>", GetADSMProblemListLink(Process)));
                    sb.AppendLine("</div>");
                    sb.AppendLine("<div class='Section'>");
                    sb.AppendLine("<div class='Emphasis'>Flag as in Remediation</div>");
                    sb.AppendLine("<div>If this is a known issue and remediation is underway, please flag this process by clicking on the blue plus icon and adding a note. This can be found on the process in the ADSM process list or on the detail page of your process, near the Next Expected Run date.</div>");
                    sb.AppendLine("</div>");
                    sb.AppendLine("<div class='Section'>If this process is reported incorrectly, please contact Matthew Erdmann @7692.</div>");
                    sb.AppendLine("<div class='Section'>");
                    sb.AppendLine("<div>Thanks,</div>");
                    sb.AppendLine("<div>BIA Infrastructure and Security Team</div>");
                    sb.AppendLine("</div>");
                    sb.AppendLine("</div>");

                    email.Body = sb.ToString();
                    email.IsBodyHtml = true;

                    using (SmtpClient client = new SmtpClient())
                    {
                        client.Send(email);
                    }

                    MarkSent(Process.ProcessId);
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }

        private string GetADSMProcessItemLink(dynamic Process)
        {
            return String.Format("{0}{1}?historyToken=gotoNewContent~{{xtype:\"App-View-Admin-ADSM-Process-Container\",flex: 1,processId:{2},processName:\"{3} - {4}\"}}",
                BIACore.Settings.Config.Server,
                BIACore.Settings.Config.LogURL,
                Process.ProcessId,
                Process.GroupName,
                Process.Name
            );
        }

        private string GetADSMProblemListLink(dynamic Process)
        {
            return String.Format("{0}{1}?historyToken=gotoNewContent~{{xtype:\"App-View-Admin-ADSM-List\",deeplinkData:{{statusFilter:1,currentPage: 1}}}}",
                BIACore.Settings.Config.Server,
                BIACore.Settings.Config.LogURL,
                Process.ProcessId,
                Process.GroupName,
                Process.Name
            );
        }

        private string MinsToLargestTimeInterval(double mins)
        {
            string valueLabel = "min";
            string smValueLabel = null;
            double value = mins;
            double? smValue = null;
            double valueDiv = 1;
            double? smValueDiv = null;
            if (mins / 525600.0 > 1.0)
            {
                valueLabel = "yr";
                smValueLabel = "mon";
                valueDiv = 525600;
                smValueDiv = 43800;
            }
            else if (mins / 131400 > 1.0)
            {
                valueLabel = "qtr";
                smValueLabel = "mon";
                valueDiv = 131400;
                smValueDiv = 43800;
            }
            else if (mins / 43800 > 1.0)
            {
                valueLabel = "mon";
                smValueLabel = "day";
                valueDiv = 43800;
                smValueDiv = 1440;
            }
            else if (mins / 10080 > 1.0)
            {
                valueLabel = "wk";
                smValueLabel = "day";
                valueDiv = 10080;
                smValueDiv = 1440;
            }
            else if (mins / 1440 > 1.0)
            {
                valueLabel = "day";
                smValueLabel = "hr";
                valueDiv = 1440;
                smValueDiv = 60;
            }
            else if (mins / 60 > 1.0)
            {
                valueLabel = "hr";
                smValueLabel = "min";
                valueDiv = 60;
                smValueDiv = 1;
            }

            value = (mins / valueDiv);
            smValue = smValueDiv != null ? ((value - Math.Floor(value)) * valueDiv) / smValueDiv : null;
            return mins == 0 
                ? mins.ToString() 
                : Math.Floor(value).ToString() + " " + valueLabel + 
                    (smValue != null && Math.Floor((decimal)smValue) > 0 ? " " + Math.Floor((decimal)smValue).ToString() + " " + smValueLabel : "");
        }
    }
}