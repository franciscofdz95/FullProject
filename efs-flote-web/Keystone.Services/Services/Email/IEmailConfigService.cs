using Keystone.DAL.Model;

namespace Keystone.Services.Services.Email
{
    public interface IEmailConfigService
    {
        Task<EmailConfig> GetConfigAsync(int processId);

        Task<EmailConfig> GetConfigByIdAsync(int emailConfigurationId);

        Task<(List<EmailConfig> data, int totalCount)> GetTableConfigAsync(EmailConfigPagination pagination);
    }
}
