namespace Keystone.Services.Services.Filters
{
    public interface IFilterService
    {
        Task<IEnumerable<Dictionary<string, object>>> GetAccountingYears();
        Task<IEnumerable<Dictionary<string, object>>> GetAccountingMonths();
        Task<IEnumerable<Dictionary<string, object>>> GetDisplayCurrencies(string locationCode, string countryCode);
        Task<IEnumerable<Dictionary<string, object>>> GetLocationCodes(string geoCode, string geoId, string locationCode);
        Task<IEnumerable<Dictionary<string, object>>> GetServiceCodes();
        Task<IEnumerable<Dictionary<string, object>>> GetCountryCodes(string query);
        Task<IEnumerable<Dictionary<string, object>>> GetCompanyCodes(string query);
        Task<IEnumerable<Dictionary<string, object>>> GetMblCostBasis();
        Task<IEnumerable<Dictionary<string, object>>> GetMblNumbers(string query);
        Task<IEnumerable<Dictionary<string, object>>> GetContainerNumbers(string query);
        Task<IEnumerable<Dictionary<string, object>>> GetShipmentNumbers(string query);
        Task<IEnumerable<Dictionary<string, object>>> GetCarrierBols(string query);
        Task<IEnumerable<Dictionary<string, object>>> GetVendorCodes(string query);
        Task<IEnumerable<Dictionary<string, object>>> GetInvoiceRefNos(string query);
        Task<IEnumerable<Dictionary<string, object>>> GetChargeCodes(string query);
        Task<IEnumerable<Dictionary<string, object>>> GetLocCountry(string query);
        Task<IEnumerable<Dictionary<string, object>>> GetLocRegion();
        Task<IEnumerable<Dictionary<string, object>>> GetReasons(string query);
    }
}
