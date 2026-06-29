using Keystone.DAL.Model;

namespace Keystone.Services.Services.Email
{
    public interface IEmailNotificationConfigService
    {
        Task<List<EmailNotificationConfig>> GetNotificationConfigByConfigIdAsync(int emailConfigurationId);

        Task<(bool result, string message)> AddNotificationEmailConfig(int emailConfigurationId, int userId, int recipientTypeId, int createdById);

        Task<(bool result, string message)> UpdateNotificationEmailConfig(int emailNotificationId, int emailConfigurationId, int userId, int recipientTypeId, int createdById);

        Task<(bool result, string message)> DeleteNotificationEmailConfig(int emailNotificationId);
    }
}
