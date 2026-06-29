using Keystone.DAL.Model.Params;
using Keystone.Services.Services.Shipment;
using Microsoft.AspNetCore.Mvc;

namespace Keystone.Server.Controllers
{
    /// <summary>
    /// Shipment Detail modal endpoints. New-stack equivalent of the legacy ExtJS
    /// WebApiReportController (Shipment.cs): ShipmentRpt, ShipmentSummary,
    /// ContainerSummary, MBLSummary, ViewShipmentNotes, AddShipmentNote,
    /// DeleteShipmentNoteByNoteId.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class ShipmentController : Controller
    {
        private readonly IShipmentService _shipmentService;

        public ShipmentController(IShipmentService shipmentService)
        {
            _shipmentService = shipmentService;
        }

        /// <summary>
        /// Charge-level shipment detail grid. Body carries ShipmentNumber + DisplayCurr
        /// (legacy ShipmentRpt). Rows are grouped client-side into Origin / Manifested /
        /// Destination sections.
        /// </summary>
        [HttpPost("GetShipmentDetails")]
        public async Task<IActionResult> GetShipmentDetails([FromBody] SP_Params filters)
        {
            try
            {
                var result = await _shipmentService.GetShipmentDetails(filters);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Single-row customer info (shipper / consignee / freight payer).</summary>
        [HttpGet("GetShipmentSummary")]
        public async Task<IActionResult> GetShipmentSummary([FromQuery] string shipmentNumber)
        {
            try
            {
                var result = await _shipmentService.GetShipmentSummary(shipmentNumber);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Container Fact rows.</summary>
        [HttpGet("GetContainerSummary")]
        public async Task<IActionResult> GetContainerSummary([FromQuery] string shipmentNumber)
        {
            try
            {
                var result = await _shipmentService.GetContainerSummary(shipmentNumber);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>MBL Fact rows.</summary>
        [HttpGet("GetMBLSummary")]
        public async Task<IActionResult> GetMBLSummary([FromQuery] string shipmentNumber)
        {
            try
            {
                var result = await _shipmentService.GetMBLSummary(shipmentNumber);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Reference notes (type 'SHP') for the shipment.</summary>
        [HttpGet("GetShipmentNotes")]
        public async Task<IActionResult> GetShipmentNotes([FromQuery] string shipmentNumber)
        {
            try
            {
                var result = await _shipmentService.GetShipmentNotes(shipmentNumber);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Add a reference note (type 'SHP').</summary>
        [HttpPost("AddShipmentNote")]
        public async Task<IActionResult> AddShipmentNote([FromBody] AddShipmentNoteRequest request)
        {
            try
            {
                await _shipmentService.AddShipmentNote(request.ShipmentNumber, request.Notes, request.UserName);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>Hide (soft-delete) a shipment note by frn_id.</summary>
        [HttpPost("DeleteShipmentNoteByNoteId")]
        [HttpPost("DeleteShipmentNote")]
        public async Task<IActionResult> DeleteShipmentNoteByNoteId([FromBody] DeleteShipmentNoteRequest request)
        {
            try
            {
                await _shipmentService.DeleteShipmentNote(request.NoteId);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    /// <summary>Body for AddShipmentNote.</summary>
    public class AddShipmentNoteRequest
    {
        public string ShipmentNumber { get; set; }
        public string Notes { get; set; }
        public string UserName { get; set; }
    }

    /// <summary>Body for DeleteShipmentNote.</summary>
    public class DeleteShipmentNoteRequest
    {
        public int NoteId { get; set; }
    }
}
