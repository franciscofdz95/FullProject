using Keystone.DAL.Model;
using Keystone.DAL.Model.Results;
using Keystone.DAL.Provider;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.AdminMessage
{
    public class AdminMessageService : IAdminMessageService
    {
        private readonly IDataProvider _dataProvider;
        public AdminMessageService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<IEnumerable<AdminMessageModel>> GetAdminMessages()
        {
            
            return await _dataProvider.ExecuteAsync<AdminMessageModel>(DBConstants.GetAdminMessage, System.Data.CommandType.StoredProcedure);
        }

        public async Task UpdateAdminMessage(string adminMessage, int requiredReading)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@Admin_Message", DbType.AnsiString, adminMessage));
            args.Add(new DBParameter("@Required_Reading", DbType.Int16, requiredReading));
            await _dataProvider.ExecuteNonQueryAsync(DBConstants.UpdateAdminMessage, System.Data.CommandType.StoredProcedure);
        }

        public async Task UpdateAdminMessageByUser(string messageId, string userId)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@message_id", DbType.AnsiString, messageId));
            args.Add(new DBParameter("@user_id", DbType.AnsiString, userId));

            await _dataProvider.ExecuteNonQueryAsync(DBConstants.UpdateAdminMessage, System.Data.CommandType.StoredProcedure);
        }
    }
}
