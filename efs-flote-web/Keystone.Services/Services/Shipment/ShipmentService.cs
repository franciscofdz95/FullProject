using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Keystone.DAL.Model;
using Keystone.DAL.Model.Params;
using Keystone.DAL.Provider;

namespace Keystone.Services.Services.Shipment
{
    /// <summary>
    /// Shipment Detail service. Mirrors the legacy ExtJS WebApiReportController
    /// (Shipment.cs). All stored-procedure names come from <see cref="DBConstants"/>.
    /// </summary>
    public class ShipmentService : IShipmentService
    {
        private readonly IDataProvider _dataProvider;

        public ShipmentService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<Dictionary<string, object>>> GetShipmentDetails(SP_Params filters)
        {
            // Legacy: param.PageName = "ShipmentRpt"; LoadPagedClientResult(GetShipmentDetails, ...)
            filters.PageName = "ShipmentRpt";
            var dbParams = filters.ToDBParameter();

            return await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetShipmentDetails,
                CommandType.StoredProcedure,
                dbParams
            );
        }

        /// <inheritdoc />
        public async Task<Dictionary<string, object>> GetShipmentSummary(string shipmentNumber)
        {
            // Legacy: LoadSingle(GetShipmentSummary, @shipment_number)
            var results = await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetShipmentSummary,
                CommandType.StoredProcedure,
                new DBParameter("@shipment_number", DbType.AnsiString, shipmentNumber ?? "")
            );
            return results.FirstOrDefault() ?? new Dictionary<string, object>();
        }

        /// <inheritdoc />
        public async Task<IEnumerable<Dictionary<string, object>>> GetContainerSummary(string shipmentNumber)
        {
            return await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetContainerSummary,
                CommandType.StoredProcedure,
                new DBParameter("@shipment_number", DbType.AnsiString, shipmentNumber ?? "")
            );
        }

        /// <inheritdoc />
        public async Task<IEnumerable<Dictionary<string, object>>> GetMBLSummary(string shipmentNumber)
        {
            return await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.GetMBLSummary,
                CommandType.StoredProcedure,
                new DBParameter("@shipment_number", DbType.AnsiString, shipmentNumber ?? "")
            );
        }

        /// <inheritdoc />
        public async Task<IEnumerable<Dictionary<string, object>>> GetShipmentNotes(string shipmentNumber)
        {
            // Legacy ViewShipmentNotes: @frn_id=0, @frn_type='SHP', @key_id=ShipmentNumber
            var args = new[]
            {
                new DBParameter("@frn_id",   DbType.Int32,     0),
                new DBParameter("@frn_type", DbType.AnsiString, "SHP"),
                new DBParameter("@key_id",   DbType.AnsiString, shipmentNumber ?? "")
            };

            return await _dataProvider.ExecuteAsyncGeneric(
                DBConstants.FLOTEGetReferenceNotes,
                CommandType.StoredProcedure,
                args
            );
        }

        /// <inheritdoc />
        public async Task AddShipmentNote(string shipmentNumber, string notes, string userName)
        {
            // Legacy AddShipmentNote: @frn_notes, @frn_type='SHP', @key_id, @usr_name
            var args = new[]
            {
                new DBParameter("@frn_notes", DbType.AnsiString, notes ?? ""),
                new DBParameter("@frn_type",  DbType.AnsiString, "SHP"),
                new DBParameter("@key_id",    DbType.AnsiString, shipmentNumber ?? ""),
                new DBParameter("@usr_name",  DbType.AnsiString, userName ?? "")
            };

            await _dataProvider.ExecuteNonQueryAsync(
                DBConstants.SetReferenceNotes,
                CommandType.StoredProcedure,
                args
            );
        }

        /// <inheritdoc />
        public async Task DeleteShipmentNote(int noteId)
        {
            // Legacy DeleteShipmentNoteByNoteId: @frn_id
            await _dataProvider.ExecuteNonQueryAsync(
                DBConstants.HideReferenceNotes,
                CommandType.StoredProcedure,
                new DBParameter("@frn_id", DbType.Int32, noteId)
            );
        }
    }
}
