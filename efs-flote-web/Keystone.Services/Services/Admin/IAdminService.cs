using Keystone.DAL.Model;

namespace Keystone.Services.Services.Admin
{
    public interface IAdminService
    {
        Task<EmailConfig> GetAdminEmailConfiguration(int emailConfigurationId);
        Task<(List<EmailConfig> data, int totalCount)> GetTableAdminEmailConfigurations(EmailConfigPagination pagination);
        Task<List<EmailNotificationConfig>> GetNotificationEmailConfig(int emailConfigurationId);
        Task<(bool result, string message)> DeleteNotificationEmailConfig(int emailNotificationId);
        Task<(bool result, string message)> AddNotificationEmailConfig(int emailConfigurationId, int userId, int recipientTypeId, int createdById);
        Task<(bool result, string message)> UpdateNotificationEmailConfig(int notificationConfigurationId, int emailConfigurationId, int userId, int recipientTypeId, int createdById);
    }
}
