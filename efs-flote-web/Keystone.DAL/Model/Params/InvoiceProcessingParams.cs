using Keystone.DAL.Model;
using System.Collections.Generic;
using System.Data;

namespace Keystone.DAL.Model.Params
{
    public class InvoiceProcessingParams
    {
        // Shared / report filter fields
        public string? InvoiceId { get; set; }
        public string? RadioSelection { get; set; }
        public string? ColumnNames { get; set; }
        public string? LocCode { get; set; }
        public string? VendorCode { get; set; }
        public string? ChargeCode { get; set; }
        public string? ShipmentNumber { get; set; }
        public string? CompanyCode { get; set; }
        public string? DisplayCurr { get; set; }
        public string? Sort { get; set; }

        // Currency / exchange rate
        public string? FromCID { get; set; }
        public string? ToCID { get; set; }
        public decimal FromRate { get; set; }
        public decimal ToRate { get; set; }
        public decimal ConvRate { get; set; }
        public string? InvoiceDetId { get; set; }
        public string? CurrencyCode { get; set; }

        // Line-item keys
        public string? ShipmentDimFK { get; set; }
        public string? MBLFk { get; set; }
        public string? ChargeFk { get; set; }
        public string? RowType { get; set; }

        // Invoice line posting
        public string? InvoiceVATId { get; set; }
        public decimal ChargeAmt { get; set; }
        public string? BuyCID { get; set; }
        public string? InvoiceCID { get; set; }
        public string? Comments { get; set; }
        public string? PaidDifferentlyReason { get; set; }
        public int ActiveFlag { get; set; }
        public decimal VATAmt { get; set; }
        public int AccrualFlag { get; set; }
        public decimal SplitAmt { get; set; }
        public string? UserId { get; set; }

        // VAT
        public string? VATCode { get; set; }

        // Non-E2K / Tax withholding
        public string? Description { get; set; }
        public string? ORAAccount { get; set; }
        public string? RevSplit { get; set; }
        public string? TWHCode { get; set; }

        // Verify
        public string? InvoiceStatusTo { get; set; }
        public string? ImageNumber { get; set; }
        public int CanApprove { get; set; }
        public string? E2kUserId { get; set; }

        public DBParameter[] ToReportParams()
        {
            var args = new List<DBParameter>
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@location_code", DbType.AnsiString, LocCode),
                new DBParameter("@vendor_code", DbType.AnsiString, VendorCode),
                new DBParameter("@charge_code", DbType.AnsiString, ChargeCode),
                new DBParameter("@shipment_number", DbType.AnsiString, ShipmentNumber),
                new DBParameter("@company_code", DbType.AnsiString, CompanyCode),
                new DBParameter("@display_currency", DbType.AnsiString, DisplayCurr),
                new DBParameter("@sort", DbType.AnsiString, string.IsNullOrEmpty(Sort) ? "location_code_orderer ASC" : Sort)
            };
            return args.ToArray();
        }

        public DBParameter[] ToChargeDetailsParams()
        {
            return new[]
            {
                new DBParameter("@Invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@Type", DbType.AnsiString, string.IsNullOrEmpty(ColumnNames) ? "All" : ColumnNames)
            };
        }

        public DBParameter[] ToNonE2kCostParams(string tariffPointType)
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@shipment_num", DbType.AnsiString, ShipmentNumber),
                new DBParameter("@tariff_point_type", DbType.AnsiString, tariffPointType),
                new DBParameter("@charge_description", DbType.AnsiString, Description)
            };
        }

        public DBParameter[] ToTariffPointTypeParams()
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@shipment_num", DbType.AnsiString, ShipmentNumber)
            };
        }

        public DBParameter[] ToTWHCodesParams()
        {
            return new[]
            {
                new DBParameter("@location_code", DbType.AnsiString, LocCode),
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@invoice_currency", DbType.AnsiString, CurrencyCode)
            };
        }

        public DBParameter[] ToValidateTWHEntryParams()
        {
            return new[] { new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId) };
        }

        public DBParameter[] ToInsertNonE2KChargeParams()
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@shpmnt_nbr", DbType.AnsiString, ShipmentNumber),
                new DBParameter("@shipment_dim_fk", DbType.AnsiString, ShipmentDimFK),
                new DBParameter("@userid", DbType.AnsiString, UserId),
                new DBParameter("@rev_split", DbType.AnsiString, RevSplit),
                new DBParameter("@charge_code", DbType.AnsiString, ChargeCode),
                new DBParameter("@description", DbType.AnsiString, Description),
                new DBParameter("@accountnum", DbType.AnsiString, ORAAccount),
                new DBParameter("@location_code", DbType.AnsiString, LocCode),
                new DBParameter("@invoice_currency", DbType.AnsiString, CurrencyCode)
            };
        }

        public DBParameter[] ToInsertTaxWithholdingParams()
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@shpmnt_nbr", DbType.AnsiString, ShipmentNumber),
                new DBParameter("@shipment_dim_fk", DbType.AnsiString, ShipmentDimFK),
                new DBParameter("@userid", DbType.AnsiString, UserId),
                new DBParameter("@VATCode", DbType.AnsiString, VATCode),
                new DBParameter("@description", DbType.AnsiString, Description),
                new DBParameter("@location_code", DbType.AnsiString, LocCode),
                new DBParameter("@invoice_currency", DbType.AnsiString, CurrencyCode),
                new DBParameter("@twhCode", DbType.AnsiString, TWHCode)
            };
        }

        public DBParameter[] ToExchangeRateParams()
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@fromCID", DbType.AnsiString, FromCID),
                new DBParameter("@toCID", DbType.AnsiString, ToCID),
                new DBParameter("@Shipment_dim_fk", DbType.AnsiString, ShipmentDimFK),
                new DBParameter("@mbl_fk", DbType.AnsiString, MBLFk),
                new DBParameter("@shpmnt_nbr", DbType.AnsiString, ShipmentNumber),
                new DBParameter("@charge_fk", DbType.AnsiString, ChargeFk),
                new DBParameter("@charge_code", DbType.AnsiString, ChargeCode)
            };
        }

        public DBParameter[] ToPostInvoiceCurrencyParams()
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@fromCID", DbType.AnsiString, FromCID),
                new DBParameter("@toCID", DbType.AnsiString, ToCID),
                new DBParameter("@fromRate", DbType.Decimal, FromRate),
                new DBParameter("@toRate", DbType.Decimal, ToRate),
                new DBParameter("@Shipment_dim_fk", DbType.AnsiString, ShipmentDimFK),
                new DBParameter("@mbl_fk", DbType.AnsiString, MBLFk),
                new DBParameter("@shpmnt_nbr", DbType.AnsiString, ShipmentNumber),
                new DBParameter("@charge_fk", DbType.AnsiString, ChargeFk),
                new DBParameter("@charge_code", DbType.AnsiString, ChargeCode),
                new DBParameter("@rate", DbType.Decimal, ConvRate),
                new DBParameter("@invoice_detail_id", DbType.AnsiString, InvoiceDetId)
            };
        }

        public DBParameter[] ToPostInvoiceLineParams()
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@Shipment_dim_fk", DbType.AnsiString, ShipmentDimFK),
                new DBParameter("@mbl_fk", DbType.AnsiString, MBLFk),
                new DBParameter("@shpmnt_nbr", DbType.AnsiString, ShipmentNumber),
                new DBParameter("@charge_fk", DbType.AnsiString, ChargeFk),
                new DBParameter("@charge_code", DbType.AnsiString, ChargeCode),
                new DBParameter("@invoicevat_id", DbType.AnsiString, InvoiceVATId),
                new DBParameter("@charge_Amt", DbType.Decimal, ChargeAmt),
                new DBParameter("@charge_Cid", DbType.AnsiString, BuyCID),
                new DBParameter("@invoice_Cid", DbType.AnsiString, InvoiceCID),
                new DBParameter("@comment", DbType.AnsiString, Comments),
                new DBParameter("@PaidDifferentlyReason", DbType.AnsiString, PaidDifferentlyReason),
                new DBParameter("@activeflag", DbType.Int32, ActiveFlag),
                new DBParameter("@userid", DbType.AnsiString, UserId),
                new DBParameter("@vat_amt", DbType.Decimal, VATAmt),
                new DBParameter("@accrualflag", DbType.Int32, AccrualFlag),
                new DBParameter("@split_amt", DbType.Decimal, SplitAmt),
                new DBParameter("@conv_Rate", DbType.Decimal, ConvRate),
                new DBParameter("@rowtype", DbType.AnsiString, RowType)
            };
        }

        public DBParameter[] ToCheckValidCurrencyParams()
        {
            return new[] { new DBParameter("@currency_code", DbType.AnsiString, CurrencyCode) };
        }

        public DBParameter[] ToChargeCountByVatIdParams()
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@location_code", DbType.AnsiString, LocCode)
            };
        }

        public DBParameter[] ToUpdateCommentParams()
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@userid", DbType.AnsiString, UserId),
                new DBParameter("@comment", DbType.AnsiString, Comments),
                new DBParameter("@status", DbType.AnsiString, InvoiceStatusTo),
                new DBParameter("@imageNo", DbType.AnsiString, ImageNumber)
            };
        }

        public DBParameter[] ToVerifyInvoiceParams()
        {
            return new[]
            {
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@status", DbType.AnsiString, InvoiceStatusTo),
                new DBParameter("@userid", DbType.AnsiString, UserId),
                new DBParameter("@activeflag", DbType.Int32, ActiveFlag),
                new DBParameter("@canApprove", DbType.Int32, CanApprove),
                new DBParameter("@e2kUserId", DbType.AnsiString, E2kUserId)
            };
        }

        public DBParameter[] ToUpdateVatIdParams()
        {
            return new[] { new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId) };
        }

        public DBParameter[] ToSplitRemainderParams()
        {
            return new[]
            {
                new DBParameter("@shipment_dim_fk", DbType.AnsiString, ShipmentDimFK),
                new DBParameter("@mbl_fk", DbType.AnsiString, MBLFk == "0" ? null : MBLFk),
                new DBParameter("@charge_fk", DbType.AnsiString, ChargeFk),
                new DBParameter("@charge_code", DbType.AnsiString, ChargeCode)
            };
        }

        public DBParameter[] ToInvoiceLineCurrencyParams()
        {
            return new[]
            {
                new DBParameter("@shipment_dim_fk", DbType.AnsiString, ShipmentDimFK),
                new DBParameter("@mbl_fk", DbType.AnsiString, MBLFk == "0" ? null : MBLFk),
                new DBParameter("@fromCID", DbType.AnsiString, FromCID),
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId),
                new DBParameter("@shpmnt_nbr", DbType.AnsiString, ShipmentNumber),
                new DBParameter("@charge_fk", DbType.AnsiString, ChargeFk),
                new DBParameter("@charge_code", DbType.AnsiString, ChargeCode)
            };
        }

        public DBParameter[] ToCheckInvoiceCurrencyParams()
        {
            return new[]
            {
                new DBParameter("@fromCID", DbType.AnsiString, FromCID),
                new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId)
            };
        }

        public DBParameter[] ToVatCodesParams(out bool byInvoiceVatId)
        {
            byInvoiceVatId = !string.IsNullOrEmpty(InvoiceVATId) && InvoiceVATId != "0" && InvoiceVATId != "999999999";
            return byInvoiceVatId
                ? new[] { new DBParameter("@invoicevat_id", DbType.AnsiString, InvoiceVATId) }
                : new[] { new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId) };
        }

        public DBParameter[] ToSCACParams()
        {
            return new[] { new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId) };
        }
    }
}
