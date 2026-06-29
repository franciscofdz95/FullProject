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
    public class Notifications : BaseTask
    {
        public override TimeSpan Interval { get { return new TimeSpan(0, Properties.Settings.Default.NotificationPollMinutes, 0); } set { } }

        public List<dynamic> GetMessageListForProcessing()
        {
            return SQL.Execute<dynamic>(Connections.NewSecurity, "msgObject.GetUnsentMessage", null);
        }

        public void MarkSent(long MessageQueueId,bool Sent = false)
        {
            SQL.ExecuteNonQuery(Connections.NewSecurity, "msgObject.ProcessMessageQueue", new DBParameter[] {
                new DBParameter("@messageQueueId", DbType.AnsiString, MessageQueueId),
                new DBParameter("@sent", DbType.AnsiString, Sent)
            });
        }

        public override void Run()
        {
            try
            {
                List<dynamic> messages = GetMessageListForProcessing();
                foreach (dynamic message in messages)
                {
                    try
                    {
                        Send(message);
                    }
                    catch (Exception ex2)
                    {

                    }
                }
            }
            catch (Exception ex)
            {

            }
        }

        public void Send(dynamic Message)
        {
            try
            {
                string from = Message.AppCode.ToString().Replace(" ", "") + "@ups.com";
                bool okToSend = Message.OptOut == false;
                using (MailMessage email = new MailMessage(from, Message.Destination))
                {
                    if (Message.SendType == "Email") email.Subject = Message.EmailSubject.ToString();

                    email.Body = Message.Text.ToString();
                    if (Message.SendType == "Email") email.IsBodyHtml = true;
                    else email.IsBodyHtml = false;

                    //Move SMTPClient Address to app.config for easy updates
                    using (SmtpClient client = new SmtpClient(Properties.Settings.Default.NotificationSMTPServer))
                    {
                        client.EnableSsl = true;
                        if (okToSend) client.Send(email);
                    }

                    MarkSent((long)Message.MessageQueueId, okToSend);
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }
    }
}