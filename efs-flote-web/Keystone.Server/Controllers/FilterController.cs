using Keystone.Services.Services.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilterController : Controller
    {
        private readonly IFilterService _filterService;

        public FilterController(IFilterService filterService)
        {
            _filterService = filterService;
        }

        /// <summary>
        /// Returns accounting years from rolling months (used for AcctYear dropdown).
        /// </summary>
        [HttpGet("AcctYear")]
        public async Task<IActionResult> GetAccountingYears()
        {
            try
            {
                var result = await _filterService.GetAccountingYears();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns accounting months (used for AcctMonth dropdown).
        /// </summary>
        [HttpGet("AcctMonth")]
        public async Task<IActionResult> GetAccountingMonths()
        {
            try
            {
                var result = await _filterService.GetAccountingMonths();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns display currencies. Query param: locationCode,countryCode
        /// </summary>
        [HttpGet("DisplayCurrency")]
        public async Task<IActionResult> GetDisplayCurrencies([FromQuery] string locationCode = "", [FromQuery] string countryCode = "")
        {
            try
            {
                var result = await _filterService.GetDisplayCurrencies(locationCode, countryCode);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns location type options (static values matching old ExtJS app).
        /// </summary>
        [HttpGet("LocType")]
        public IActionResult GetLocationTypes()
        {
            var result = new[]
            {
                new { value = "DEP", text = "DEP" },
                new { value = "TP", text = "TP" }
            };
            return Ok(result);
        }

        /// <summary>
        /// Returns location codes for autocomplete.
        /// </summary>
        [HttpGet("LocationCode")]
        public async Task<IActionResult> GetLocationCodes([FromQuery] string geoCode = "", [FromQuery] string geoId = "", [FromQuery] string locationCode = "")
        {
            try
            {
                var result = await _filterService.GetLocationCodes(geoCode, geoId, locationCode);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns service codes.
        /// </summary>
        [HttpGet("ServiceCode")]
        public async Task<IActionResult> GetServiceCodes()
        {
            try
            {
                var result = await _filterService.GetServiceCodes();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns country codes for typeahead (old ExtJS: api/WebAPIFilter/Country, minChars: 2).
        /// </summary>
        [HttpGet("Country")]
        public async Task<IActionResult> GetCountryCodes([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetCountryCodes(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns company codes for typeahead (old ExtJS: api/WebAPIFilter/CompanyCode, minChars: 2).
        /// </summary>
        [HttpGet("CompanyCode")]
        public async Task<IActionResult> GetCompanyCodes([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetCompanyCodes(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns MBL cost basis options (old ExtJS: api/WebAPIFilter/MBLCostBasis).
        /// </summary>
        [HttpGet("MBLCostBasis")]
        public async Task<IActionResult> GetMblCostBasis()
        {
            try
            {
                var result = await _filterService.GetMblCostBasis();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns MBL numbers for typeahead (old ExtJS: api/WebAPIFilter/MBLNo, minChars: 3).
        /// </summary>
        [HttpGet("MBLNo")]
        public async Task<IActionResult> GetMblNumbers([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetMblNumbers(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns container numbers for typeahead (old ExtJS: api/WebAPIFilter/ContainerNo, minChars: 3).
        /// </summary>
        [HttpGet("ContainerNo")]
        public async Task<IActionResult> GetContainerNumbers([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetContainerNumbers(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns shipment numbers for typeahead (old ExtJS: api/WebAPIFilter/ShipmentNo, minChars: 3).
        /// </summary>
        [HttpGet("ShipmentNo")]
        public async Task<IActionResult> GetShipmentNumbers([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetShipmentNumbers(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns carrier BOL for typeahead (old ExtJS: api/WebAPIFilter/CarrierBOL, minChars: 3).
        /// </summary>
        [HttpGet("CarrierBOL")]
        public async Task<IActionResult> GetCarrierBols([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetCarrierBols(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns vendor codes for typeahead (old ExtJS: api/WebAPIFilter/VendorCode, minChars: 3).
        /// </summary>
        [HttpGet("VendorCode")]
        public async Task<IActionResult> GetVendorCodes([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetVendorCodes(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns invoice reference numbers for typeahead (old ExtJS: api/WebAPIFilter/InvRefNo, minChars: 3).
        /// </summary>
        [HttpGet("InvRefNo")]
        public async Task<IActionResult> GetInvoiceRefNos([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetInvoiceRefNos(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns charge codes for typeahead (old ExtJS: api/WebAPIFilter/ChargeCode, minChars: 2).
        /// </summary>
        [HttpGet("ChargeCode")]
        public async Task<IActionResult> GetChargeCodes([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetChargeCodes(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns location country for typeahead (old ExtJS: api/WebAPIFilter/LocCountry, minChars: 3).
        /// </summary>
        [HttpGet("LocCountry")]
        public async Task<IActionResult> GetLocCountry([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetLocCountry(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns location region options (old ExtJS: api/WebAPIFilter/LocRegion, default 'All').
        /// </summary>
        [HttpGet("LocRegion")]
        public async Task<IActionResult> GetLocRegion()
        {
            try
            {
                var result = await _filterService.GetLocRegion();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Returns paid differently reasons for typeahead (old ExtJS: api/WebAPIFilter/Reason, minChars: 3).
        /// </summary>
        [HttpGet("Reason")]
        public async Task<IActionResult> GetReasons([FromQuery] string query = "")
        {
            try
            {
                var result = await _filterService.GetReasons(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
