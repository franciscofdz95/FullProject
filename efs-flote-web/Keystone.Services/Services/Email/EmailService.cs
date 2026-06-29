using Keystone.DAL.Model;
using Keystone.DAL.Utility;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Text;

namespace Keystone.Services.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _fromEmail;
        private readonly IEmailConfigService _emailConfigService;
        private readonly int DEFAULT_PROC_ID = 6;
        private readonly string _sfabraUrl;

        public EmailService(
            IConfiguration configuration,
            IEmailConfigService emailConfigService
            )
        {
            _smtpHost = "smtpapps-win.us.ups.com";
            _smtpPort = 25;
            _fromEmail = "bia@ups.com";
            _emailConfigService = emailConfigService;
            _sfabraUrl = ConfigurationHelper.GetFloteUrl();
        }

        public async Task SendEmailAsync(List<string> toEmails, string subject, string message)
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_fromEmail),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };

            foreach (var email in toEmails)
            {
                mailMessage.To.Add(email);
            }

            await SendMailAsync(mailMessage);
        }

        private async Task SendConfiguredEmailAsync(string subjectOverride = null, string bodyOverride = null)
        {
            var config = await _emailConfigService.GetConfigAsync(DEFAULT_PROC_ID);

            var mail = new MailMessage
            {
                From = new MailAddress(config.From_Email),
                Subject = subjectOverride ?? config.Sub,
                Body = bodyOverride ?? config.Body_Content,
                IsBodyHtml = true
            };

            // Add recipients
            AddRecipients(mail.To, config.To_Email);
            AddRecipients(mail.CC, config.CC_Email);
            AddRecipients(mail.Bcc, config.BCC_Email);

            await SendMailAsync(mail);
        }

        private async Task SendMailAsync(MailMessage mailMessage)
        {
            using var client = new SmtpClient(_smtpHost, _smtpPort) { EnableSsl = true };
            try
            {
                await client.SendMailAsync(mailMessage);
                Console.WriteLine($"Email sent successfully to {string.Join(", ", mailMessage.To.Select(t => t.Address))} with subject: {mailMessage.Subject}");
            }
            catch (SmtpException ex)
            {
                Console.WriteLine($"SMTP Error sending email: {ex.StatusCode} - {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General Error sending email: {ex.Message}");
            }
        }

        private void AddRecipients(MailAddressCollection addressCollection, string emails)
        {
            if (string.IsNullOrEmpty(emails)) return;

            foreach (var email in emails.Split(';', StringSplitOptions.RemoveEmptyEntries))
            {
                addressCollection.Add(email.Trim());
            }
        }

      

        public async Task SendDeletedSfabraEmail(string deletedSfabra, string uploaderName, string expirationDate)
        {
            if (string.IsNullOrEmpty(deletedSfabra)) return;

            string subject = "SFABRA - Contract File Expired.";
            string htmlBody = GenerateDeleteEmailContent(deletedSfabra, uploaderName, expirationDate);

            await SendConfiguredEmailAsync(subject, htmlBody);
        }

        public async Task SendFuelRateUpdateEmail(string monthRated, string fuelRate)
        {
            string subject = "SFABRA - Fuel Rate Updated.";
            string htmlBody = GenerateFuelRateUpdateEmailContent(monthRated, fuelRate);

            await SendConfiguredEmailAsync(subject, htmlBody);
        }


        private string GenerateDeleteEmailContent(string deletedSfabra, string uploaderName, string expirationDate)
        {
            var content = new StringBuilder();
            content.Append($@"
                <p>Dear User,</p>
                <p>The following SFABRA has been expired by <strong>{uploaderName}</strong>.</p>
                <div class='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Message</th>
                                <th>Expiration Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>The Sfabra {deletedSfabra} has been expired.</td>
                                <td>{expirationDate}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>");

            return GenerateHtmlTemplate("Contract File Expired", content.ToString(), "red");
        }

        private string GenerateFuelRateUpdateEmailContent(string monthRated, string fuelRate)
        {
            var content = new StringBuilder();
            content.Append($@"
                <p>Dear User,</p>
                <p>This email provides information on the recent fuel rate update.</p>
                <p>Here is the fuel rate that was updated:</p>
                <div class='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Month Updated</th>
                                <th>Fuel Rate</th>
                                <th>Task Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{monthRated}</td>
                                <td>{fuelRate}</td>
                                <td>{DateTime.Now}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>");

            return GenerateHtmlTemplate("Fuel Rate Updated", content.ToString(), "grey");
        }

        private (string CssClass, string Text) GetStatusVisuals(string status) => status switch
        {
            "success" => ("status-success", "SUCCESS"),
            "skipped" => ("status-skipped", "SKIPPED"),
            _ => ("status-error", "ERROR"),
        };

        private string GenerateHtmlTemplate(string title, string content, string headerColor)
        {
            return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; font-size: 14px; color: #333; }}
                    .container {{ max-width: 700px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; }}
                    .header {{ background-color: {headerColor}; color: #ffffff; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; }}
                    .table-container {{ margin-top: 20px; border: 1px solid #eee; border-radius: 5px; overflow: hidden; }}
                    table {{ width: 100%; border-collapse: collapse; }}
                    th, td {{ border: 1px solid #eee; padding: 10px; text-align: left; }}
                    th {{ background-color: #f8f8f8; font-weight: bold; }}
                    .status-success {{ color: green; font-weight: bold; }}
                    .status-error {{ color: red; font-weight: bold; }}
                    .status-skipped {{ color: orange; font-weight: bold; }}
                    .footer {{ background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd;}}
                    .signature {{ margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee; }}
                    .app-link {{ margin-top: 10px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>{title}</h2>
                    </div>
                    <div class='content'>
                        {content}
                        <div class='signature'>
                            <p>Thanks,<br>SFABRA Support Team</p>
                        </div>
                        <div class='app-link'>
                            <p>Access the SFABRA application here: <a href='{_sfabraUrl}'>{_sfabraUrl}</a></p>
                        </div>
                    </div>
                    <div class='footer'>
                        <p>&copy; {DateTime.Now.Year} UPS. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>";
        }

        public Task SendMissedFieldsEmail(List<string> _fields, string _fileName)
        {
            throw new NotImplementedException();
        }
    }
}