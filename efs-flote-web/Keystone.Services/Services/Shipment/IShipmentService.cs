using System.Collections.Generic;
using System.Threading.Tasks;
using Keystone.DAL.Model.Params;

namespace Keystone.Services.Services.Shipment
{
    /// <summary>
    /// Shipment Detail services. Mirrors the legacy ExtJS WebApiReportController
    /// (Shipment.cs) endpoints: ShipmentRpt, ShipmentSummary, ContainerSummary,
    /// MBLSummary, ViewShipmentNotes, AddShipmentNote, DeleteShipmentNoteByNoteId.
    /// </summary>
    public interface IShipmentService
    {
        /// <summary>Charge-level shipment detail grid (Origin / Manifested / Destination groups).</summary>
        Task<IEnumerable<Dictionary<string, object>>> GetShipmentDetails(SP_Params filters);

        /// <summary>Single-row customer info (shipper / consignee / freight payer / customer group).</summary>
        Task<Dictionary<string, object>> GetShipmentSummary(string shipmentNumber);

        /// <summary>Container Fact rows for the shipment.</summary>
        Task<IEnumerable<Dictionary<string, object>>> GetContainerSummary(string shipmentNumber);

        /// <summary>MBL Fact rows for the shipment.</summary>
        Task<IEnumerable<Dictionary<string, object>>> GetMBLSummary(string shipmentNumber);

        /// <summary>Reference notes (type 'SHP') for the shipment.</summary>
        Task<IEnumerable<Dictionary<string, object>>> GetShipmentNotes(string shipmentNumber);

        /// <summary>Add a reference note (type 'SHP') to the shipment.</summary>
        Task AddShipmentNote(string shipmentNumber, string notes, string userName);

        /// <summary>Hide (soft-delete) a shipment note by its frn_id.</summary>
        Task DeleteShipmentNote(int noteId);
    }
}
