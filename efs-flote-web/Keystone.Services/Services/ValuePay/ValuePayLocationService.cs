using Keystone.DAL.Model;
using Keystone.DAL.Provider;
using System.Data;

namespace Keystone.Services.Services.ValuePay
{
    public class ValuePayLocationService : IValuePayLocationService
    {
        private readonly IDataProvider _dataProvider;

        public ValuePayLocationService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<List<ValuePayLocationInfo>> GetAllAsync()
        {
            var parameters = new DBParameter[] {
                new("@reqLoc", DbType.AnsiString, null)
            };

            var results = await _dataProvider.ExecuteAsync<ValuePayLocationInfo>(
                DBConstants.GetValuePayByRLoc,
                CommandType.StoredProcedure,
                parameters);

            return results.ToList();
        }

        public async Task<(bool result, string message)> UpdateLocationAsync(ValuePayLocationUpdateRequest request)
        {
            try
            {
                var parameters = new DBParameter[] {
                    new("@reqLoc", DbType.AnsiString, request.ReqLocation),
                    new("@valuePayLoc", DbType.AnsiString, request.ValuePayLocation),
                    new("@invoiceTypeCode", DbType.AnsiString, request.InvoiceTypeCode)
                };

                await _dataProvider.ExecuteNonQueryAsync(
                    DBConstants.GetValuePayUpdateAction,
                    CommandType.StoredProcedure,
                    parameters);

                return (true, "Value Pay Location updated successfully.");
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }
    }
}
