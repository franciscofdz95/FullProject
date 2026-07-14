using Keystone.DAL.Model;
using System.Collections.Generic;
using System.Data;

namespace Keystone.DAL.Model.Params
{
    public class VendorStatementSummaryParams
    {
        public string? InvoiceId { get; set; }
        public string? CarrierBol { get; set; }
        public string? ChargeCode { get; set; }
        public string? Hbl { get; set; }
        public string? CbolStatus { get; set; }
        public string? RadioSelection { get; set; }
        public string? Sort { get; set; }
        public string? Comments { get; set; }
        public string? UserId { get; set; }

        // Client-side paging is used, so the SP is always asked for the full result set.
        private const string FullResultLimit = "100000";

        public DBParameter[] ToSummaryParams()
        {
            var args = new List<DBParameter>
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@start", DbType.AnsiString, "0"),
                new DBParameter("@limit", DbType.AnsiString, FullResultLimit),
                new DBParameter("@sort", DbType.AnsiString, string.IsNullOrEmpty(Sort) ? "Carrier_BOL ASC" : Sort),
                new DBParameter("@status", DbType.AnsiString, CbolStatus),
                new DBParameter("@rdoType", DbType.AnsiString, RadioSelection)
            };

            if (!string.IsNullOrEmpty(CarrierBol) || !string.IsNullOrEmpty(ChargeCode) || !string.IsNullOrEmpty(Hbl))
            {
                args.Add(new DBParameter("@carrier_bol", DbType.AnsiString, CarrierBol));
                args.Add(new DBParameter("@charge_code", DbType.AnsiString, ChargeCode));
                args.Add(new DBParameter("@hbl", DbType.AnsiString, Hbl));
            }

            return args.ToArray();
        }

        public DBParameter[] ToAggregateParams()
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId)
            };
        }

        public DBParameter[] ToMatchParams()
        {
            return new[]
            {
                new DBParameter("@Invoice_Id", DbType.AnsiString, InvoiceId),
                new DBParameter("@Carrier_Bol", DbType.AnsiString, CarrierBol),
                new DBParameter("@Charge_Code", DbType.AnsiString, ChargeCode),
                new DBParameter("@hbl", DbType.AnsiString, Hbl),
                new DBParameter("@Comments", DbType.AnsiString, Comments),
                new DBParameter("@User_Id", DbType.AnsiString, UserId),
                new DBParameter("@rdoType", DbType.AnsiString, RadioSelection)
            };
        }

        public bool HasDrillDownFilter()
        {
            return !string.IsNullOrEmpty(CarrierBol) || !string.IsNullOrEmpty(ChargeCode) || !string.IsNullOrEmpty(Hbl);
        }
    }
}
