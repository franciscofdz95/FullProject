using Keystone.DAL.Model;

namespace Keystone.Services.Services.Email
{
    public interface IEmailService
    {
        // This method will be responsible for sending the actual email
        Task SendEmailAsync(List<string> toEmails, string subject, string message);

        // This method will prepare the specific upload completion email
        Task SendDeletedSfabraEmail(string _deletedSfabras, string uploaderName, string expirationDate);
        //ESE-0925-2
        //Notification sent when a new fuel rate was added.
        Task SendFuelRateUpdateEmail(string _monthRated, string _fuelRate);
        //ESE-1025-1
        //Notification sent when missed fields were found.
        Task SendMissedFieldsEmail(List<string> _fields, string _fileName);
    }
}
