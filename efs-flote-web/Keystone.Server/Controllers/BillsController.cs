using Keystone.DAL.Model.Params;
using Keystone.Server.Utility;
using Keystone.Services.Services.Bills;
using Microsoft.AspNetCore.Mvc;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class BillsController : Controller
    {
        private readonly IBillsService _billsService;
        private ValidationTools _validationTools;
        public BillsController(IBillsService billsService)
        {
            _billsService = billsService;
            _validationTools = new ValidationTools();
        }

        [HttpGet("GetBills")]
        public async Task<IActionResult> GetBills([FromQuery] BillsTParams _billsParam)
        {
            try
            {
                var bills = await _billsService.GetBills(_billsParam);
                bills = _validationTools.RemoveEmptyRows(bills);
                return Ok(bills);
            }
            catch(Exception ex)
            {
                    return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetBillsPayments")]
        public async Task<IActionResult> GetBillsPayments([FromQuery] BillsTParams _billsParam)
        {
            try
            {
                var bills = await _billsService.GetBillsPayments(_billsParam);
                bills = _validationTools.RemoveEmptyRows(bills);
                return Ok(bills);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetIncompletedBills")]
        public async Task<IActionResult> GetIncompletedBills([FromQuery] string location_code, string company_code, string acctYear)
        {
            try
            {
                var billsCount = await _billsService.GetIncompletedBills(location_code, company_code, acctYear);

                return Ok(billsCount);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetBillsHeaderCount")]
        public async Task<IActionResult> GetBillsHeaderCount([FromQuery] BillsTParams _billsParams)
        {
            try
            {
                var billsHeader = await _billsService.GetBillsHeaderCount(_billsParams);

                return Ok(billsHeader);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
