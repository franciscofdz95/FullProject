using Keystone.DAL.Model;

namespace Keystone.Services.Services.ValuePay
{
    public interface IValuePayLocationService
    {
        Task<List<ValuePayLocationInfo>> GetAllAsync(string reqLoc);
        Task<(bool result, string message)> UpdateLocationAsync(ValuePayLocationUpdateRequest request);
    }
}
