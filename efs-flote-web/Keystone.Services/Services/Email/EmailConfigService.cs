using Keystone.DAL.Model;
using Keystone.DAL.Provider;
using Microsoft.Extensions.Caching.Memory;
using System.Data;

namespace Keystone.Services.Services.Email
{
    public class EmailConfigService : IEmailConfigService
    {
        private readonly IMemoryCache _cache;
        private readonly IDataProvider _dataProvider;

        public EmailConfigService(
            IMemoryCache cache,
            IDataProvider dataProvider)
        {
            _cache = cache;
            _dataProvider = dataProvider;
        }

        public async Task<EmailConfig> GetConfigAsync(int processId)
        {
#pragma warning disable CS8603 // Possible null reference return.
            return await _cache.GetOrCreateAsync($"EmailConfig_{processId}", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);

                try
                {
                    var parameters = new DBParameter[] {
                        new("@Email_Configuration_ID", DbType.Int32, processId)
                    };

                    var result = await _dataProvider.ExecuteAsync<EmailConfig>(
                        "appobject.usp_SSIS_Get_Email_Config",
                        CommandType.StoredProcedure,
                        parameters
                    );

                    var config = result.FirstOrDefault();

                    if (config != null)
                        return config;
                }
                catch (Exception ex)
                {

                    Console.WriteLine($"[EmailConfigService] Error fetching config from DB: {ex.Message}");
                }

                return new EmailConfig
                {
                    From_Email = "bia@ups.com",
                    To_Email = "zchiovaro@ups.com;jjothimani@ups.com",
                    Sub = string.Empty,
                    Body_Content = string.Empty
                };
            });
#pragma warning restore CS8603 // Possible null reference return.
        }

        public async Task<EmailConfig> GetConfigByIdAsync(int emailConfigurationId)
        {
            var parameters = new DBParameter[] {
                new("@Email_Configuration_ID",DbType.Int32, emailConfigurationId)
            };
            var results = await _dataProvider.ExecuteAsync<EmailConfig>(
                "AppObject.usp_Get_Email_Config_Listing",
                CommandType.StoredProcedure,
                parameters);

            return results.FirstOrDefault();
        }

        public async Task<(List<EmailConfig> data, int totalCount)> GetTableConfigAsync(EmailConfigPagination pagination)
        {
            var parameters = new DBParameter[] {
                new("@Email_Configuration_ID", DbType.Int32, -1),
                new ("@PageNumber", DbType.Int32, pagination.PageNumber),
                new ("@PageSize", DbType.Int32, pagination.PageSize),
            };

            var results = await _dataProvider.ExecuteAsync<EmailConfig>(
                "AppObject.usp_Get_Email_Config_Listing",
                CommandType.StoredProcedure,
                parameters);

            return (results.ToList(), results?.FirstOrDefault()?.total_count ?? 0);
        }
    }
}