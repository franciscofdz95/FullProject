using Keystone.DAL.Model;
using Keystone.DAL.Provider;
using Keystone.Services.Services.Email;
using System.Data;

namespace Keystone.Services.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly IDataProvider _dataProvider;
        private readonly IDataWrapper _idataWrapper;
        private readonly IEmailConfigService _emailConfigService;
        private readonly IEmailNotificationConfigService _emailNotificationConfigService;

        //private readonly ILogger _log = Log.ForContext<Service>();
        public AdminService(
            IDataProvider dataProvider, 
            IDataWrapper idataWrapper,
            IEmailConfigService emailConfigService,
            IEmailNotificationConfigService emailNotificationConfigService)
        {
            _dataProvider = dataProvider;
            _idataWrapper = idataWrapper;
            _emailConfigService = emailConfigService;
            _emailNotificationConfigService = emailNotificationConfigService;
        }

        public async Task<EmailConfig> GetAdminEmailConfiguration(int emailConfigurationId)
        {
            return await _emailConfigService.GetConfigByIdAsync(emailConfigurationId);
        }

        public async Task<(List<EmailConfig> data, int totalCount)> GetTableAdminEmailConfigurations(EmailConfigPagination pagination) =>        
            await _emailConfigService.GetTableConfigAsync(pagination);       

        public async Task<List<EmailNotificationConfig>> GetNotificationEmailConfig(int emailConfigurationId) =>
            await _emailNotificationConfigService.GetNotificationConfigByConfigIdAsync(emailConfigurationId);

        public async Task<(bool result, string message)> DeleteNotificationEmailConfig(int emailNotificationId) =>
             await _emailNotificationConfigService.DeleteNotificationEmailConfig(emailNotificationId);

        public async Task<(bool result, string message)> AddNotificationEmailConfig(int emailConfigurationId, int userId, int recipientTypeId, int createdById) =>
             await _emailNotificationConfigService.AddNotificationEmailConfig(emailConfigurationId,userId, recipientTypeId, createdById);

        public async Task<(bool result, string message)> UpdateNotificationEmailConfig(int notificationConfigurationId, int emailConfigurationId, int userId, int recipientTypeId, int createdById) =>
             await _emailNotificationConfigService.UpdateNotificationEmailConfig(notificationConfigurationId,emailConfigurationId, userId, recipientTypeId, createdById);
    }
}