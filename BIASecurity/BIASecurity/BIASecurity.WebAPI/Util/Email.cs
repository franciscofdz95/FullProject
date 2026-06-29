using BIACore.Model;
using BIACore.Provider;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace BIASecurity.WebAPI.Util
{
    public static class Email
    {
        public static void sendEmail(string fromAddr, List<string> emails, string subject, string body, string emailType, string emailDesc = null, int? detailId = null)
        {
            bool success;

            try
            {
                sendEmailHelper(fromAddr, emails, subject, body);

                success = true;
            }
            catch (Exception e)
            {
                BIACore.Log.LogFactory.Exception(e);

                success = false;
            }

            logEmail(emailType, String.Join(";", emails), success, emailDesc, detailId);
        }

        public static void sendEmailWithAttachment(string fromAddr, List<string> emails, string subject, string body, MemoryStream stream,
            string fileName, string emailType, string emailDesc = null, int? detailId = null)
        {
            bool success;

            try
            {
                sendEmailWithAttachmentHelper(fromAddr, emails, subject, body, stream, fileName);

                success = true;
            }
            catch (Exception e)
            {
                BIACore.Log.LogFactory.Exception(e);

                success = false;
            }

            logEmail(emailType, String.Join(";", emails), success, emailDesc, detailId);
        }

        public static void sendEmailHelper(string fromAddr, List<string> emails, string subject, string body)
        {
            SmtpClient client = new SmtpClient();
            MailMessage message = new MailMessage();

            client.EnableSsl = true;
            message.From = new MailAddress(fromAddr);
            foreach (string email in emails)
                message.To.Add(new MailAddress(email));

            message.Subject = subject;
            message.IsBodyHtml = true;
            message.Body = body;

            client.Send(message);

            message.Dispose();
            client.Dispose();
        }

        public static void sendEmailWithAttachmentHelper(string fromAddr, List<string> emails, string subject, string body,
            MemoryStream stream, string fileName)
        {
            SmtpClient client = new SmtpClient();
            MailMessage message = new MailMessage();

            client.EnableSsl = true;
            message.From = new MailAddress(fromAddr);
            foreach (string email in emails)
                message.To.Add(new MailAddress(email));

            message.Subject = subject;
            message.IsBodyHtml = true;
            message.Body = body;

            stream.Seek(0, SeekOrigin.Begin);
            Attachment pdf = new Attachment(stream, fileName, MediaTypeNames.Application.Pdf);
            message.Attachments.Add(pdf);

            client.Send(message);

            message.Dispose();
            client.Dispose();
        }

        private static void logEmail(string emailType, string emailAddr, bool successFlag, string emailDesc = null, int? detailId = null)
        {
            //SQL.ExecuteNonQuery(Connections.OCM, "OcmObject.usp_LogEmail",
            //    new DBParameter("@EMAIL_TYPE", DbType.String, emailType),
            //    new DBParameter("@EMAIL_ADDR", DbType.String, emailAddr),
            //    new DBParameter("@SUCCESS_FLAG", DbType.Boolean, successFlag),
            //    new DBParameter("@EMAIL_DESC", DbType.String, emailDesc),
            //    new DBParameter("@DETAIL_ID", DbType.Int32, detailId));
        }
    }
}
