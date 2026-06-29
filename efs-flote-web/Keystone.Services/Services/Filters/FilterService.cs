using Keystone.DAL.Model;
using Keystone.DAL.Provider;
using System.Data;

namespace Keystone.Services.Services.Filters
{
    public class FilterService : IFilterService
    {
        private readonly IDataProvider _dataProvider;

        public FilterService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetAccountingYears()
        {
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.RollingMonths,
                CommandType.StoredProcedure
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetAccountingMonths()
        {
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.RollingMonthsMon,
                CommandType.StoredProcedure
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetDisplayCurrencies(string locationCode, string countryCode)
        {
            // SP usp_GetCurrency_FV2 requires both @location_code and @country_code —
            // always pass them (empty string when not known), matching old ExtJS
            // DisplayCurr.cs which always sent queryVal[0] and queryVal[1].
            var parameters = new DBParameter[]
            {
                new DBParameter("@location_code", DbType.AnsiString, locationCode ?? ""),
                new DBParameter("@country_code",  DbType.AnsiString, countryCode  ?? "")
            };

            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetCurrency,
                CommandType.StoredProcedure,
                parameters
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetLocationCodes(string geoCode, string geoId, string locationCode)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@geoid", DbType.AnsiString, geoId ?? ""),
                new DBParameter("@geocode", DbType.AnsiString, geoCode ?? ""),
                new DBParameter("@location_code", DbType.AnsiString, locationCode ?? "")
            };

            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.AutoCompLocation,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetServiceCodes()
        {
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetServiceCodes,
                CommandType.StoredProcedure
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetCountryCodes(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@country_code", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.AutoCompCountry,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetCompanyCodes(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@company_code", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.AutoCompCompanyCode,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetMblCostBasis()
        {
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetMBLCostBasis,
                CommandType.StoredProcedure
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetMblNumbers(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@mbl_busid", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.AutoCompMBL,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetContainerNumbers(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@container_busid", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.AutoCompContainer,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetShipmentNumbers(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@shpmnt_nbr", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.AutoCompShipment,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetCarrierBols(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@mbl_iata_busid", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.AutoCompCarrier,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetVendorCodes(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@vendor_Code", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.AutoCompVendor2,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetInvoiceRefNos(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@invrefno", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.AutoCompInvRefNo,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetChargeCodes(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@charge_code", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.AutoCompChargeCode,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetLocCountry(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@LocCountry", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetLocCountry,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetLocRegion()
        {
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetLocRegion,
                CommandType.StoredProcedure
            );
            return results;
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetReasons(string query)
        {
            var parameters = new List<DBParameter>
            {
                new DBParameter("@PaidDifferentlyReason", DbType.AnsiString, query ?? "")
            };
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetfilterPaidDifferrentlyReason,
                CommandType.StoredProcedure,
                parameters.ToArray()
            );
            return results;
        }
    }
}
