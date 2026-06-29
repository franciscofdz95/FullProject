using Keystone.DAL.Model;
using Keystone.DAL.Provider;
using System.Data;

namespace Keystone.Services.Services.Email
{
    public class EmailNotificationConfigService : IEmailNotificationConfigService
    {
        private readonly IDataProvider _dataProvider;

        public EmailNotificationConfigService(
            IDataProvider dataProvider
            )
        {
            _dataProvider = dataProvider;
        }

        public async Task<List<EmailNotificationConfig>> GetNotificationConfigByConfigIdAsync(int emailConfigurationId)
        {
            var parameters = new DBParameter[] {
                new("@Email_Configuration_ID",DbType.Int32, emailConfigurationId)
            };
            var results = await _dataProvider.ExecuteAsync<EmailNotificationConfig>(
                "AppObject.usp_Get_Notification_Email_Config",
                CommandType.StoredProcedure,
                parameters);
            return results.ToList();
        }

        public async Task<(bool result, string message)> DeleteNotificationEmailConfig(int emailNotificationId)
        {
            try
            {
                var parameters = new DBParameter[] {
                    new("@Email_Notification_ID",DbType.Int32, emailNotificationId)
                  };

                await _dataProvider.ExecuteScalarAsync("appObject.usp_Delete_Notification_Email_Config", CommandType.StoredProcedure, parameters);

                return (true, string.Empty);
            }
            catch (Exception)
            {
                return (false, "Exception found");
            }
        }

        public async Task<(bool result, string message)> AddNotificationEmailConfig(
           int emailConfigurationId,
           int userId,
           int recipientTypeId,
           int createdById) => await UpsertNotificationEmailConfigAsync(null, emailConfigurationId, userId, recipientTypeId, createdById);

        public async Task<(bool result, string message)> UpdateNotificationEmailConfig(
           int emailNotificationId,
           int emailConfigurationId,
           int userId,
           int recipientTypeId,
           int createdById) => await UpsertNotificationEmailConfigAsync(emailNotificationId, emailConfigurationId, userId, recipientTypeId, createdById);

        private async Task<(bool result, string message)> UpsertNotificationEmailConfigAsync(
            int? emailNotificationId,
            int emailConfigurationId,
            int userId,
            int recipientTypeId,
            int createdById)
        {
                try
                {
                    var parameters = new DBParameter[]
                    {
                        new("@Email_Notification_ID", DbType.Int32, emailNotificationId),
                        new("@Email_Configuration_ID", DbType.Int32, emailConfigurationId),
                        new("@User_ID", DbType.Int32, userId),
                        new("@Recipient_Type", DbType.Int32, recipientTypeId),
                        new("@Created_By", DbType.Int32, createdById)
                    };

                    var result = await _dataProvider.ExecuteScalarAsync(
                        "AppObject.usp_Upsert_Notification_Email_Config",
                        CommandType.StoredProcedure,
                        parameters
                    );

                    return (true, result?.ToString() ?? string.Empty);
                }
                catch (Exception ex)
                {
                    return (false, $"Exception found: {ex.Message}");
                }
            }
        }

    }