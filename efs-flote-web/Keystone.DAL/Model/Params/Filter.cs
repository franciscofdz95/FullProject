using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Model.Params
{
    public class SP_Params
    {
        #region Variables
        public string AcctYear { get; set; }
        public string AcctMonth { get; set; }
        public string AccrualFlag { get; set; }
        public string BatchId { get; set; }
        public string InvoiceId { get; set; }
        public string InvoiceRefNo { get; set; }
        public string CarrierId { get; set; }
        public string CarrierCBOL { get; set; }

        public string HBL { get; set; }

        public string ChargeCode { get; set; }
        public string ChargeStatus { get; set; }
        public string CompanyCode { get; set; }
        public string ContainerNumber { get; set; }
        public string CostType { get; set; }
        public string CountryCode { get; set; }
        public string CurrencyCode { get; set; }
        public string Destination { get; set; }
        public string DisplayCurr { get; set; }
        public string DocumentId { get; set; }
        public string EndDate { get; set; }
        public string InvoiceStatus { get; set; }

        public string LocCode { get; set; }
        public string Loctype { get; set; }
        public string MBLCostBasis { get; set; }
        public string MBLNumber { get; set; }
        public string ModifiedBy { get; set; }
        public string OrigDest { get; set; }
        public string Origin { get; set; }
        public string RcvdAtDate { get; set; }
        public string ServiceCode { get; set; }
        public string ShipmentNumber { get; set; }
        public string StartDate { get; set; }
        public string VendorCode { get; set; }
        public string PageName { get; set; }
        public string ReferenceFilter { get; set; }
        public string Table { get; set; }
        public string WhereClause { get; set; }
        public string TestValue { get; set; }
        public string E2kCarrierCode { get; set; }
        public string ImageNumber { get; set; }
        public string UPSRefType { get; set; }
        public string VendorEnglishName { get; set; }
        public string VendorLegalName { get; set; }
        public string VendorId { get; set; }
        public string RegionCode { get; set; }
        public string DistrictCode { get; set; }
        public string GeoId { get; set; }
        public string GeoCode { get; set; }
        public string FolderName { get; set; }
        public string ExportType { get; set; }
        public string UserId { get; set; }
        public string Comments { get; set; }
        public string InvoiceStatusTo { get; set; }
        public string InvoiceStatusFrom { get; set; }
        public string ImageURL { get; set; }
        public string ScanDest { get; set; }
        public string ColumnNames { get; set; }
        public string DataIndexes { get; set; }
        public string RejectedStatus { get; set; }
        public string SortParam { get; set; }
        public string SelectedInvoices { get; set; }
        public string RevSplit { get; set; }
        public string Description { get; set; }
        public string ORAAccount { get; set; }
        public string ShipmentDimFK { get; set; }
        public string TWHCode { get; set; }
        public string VATCode { get; set; }
        public string InvoiceVATId { get; set; }
        public string FromCID { get; set; }
        public string ToCID { get; set; }
        public string MBLFk { get; set; }
        public string ChargeFk { get; set; }
        public decimal FromRate { get; set; }
        public decimal ToRate { get; set; }
        public string RowType { get; set; }
        public string InvoiceDetId { get; set; }
        public decimal ConvRate { get; set; }

        public decimal ChargeAmt { get; set; }
        public decimal VATAmt { get; set; }
        public decimal InvoiceAmt { get; set; }
        public decimal SplitAmt { get; set; }
        public int ActiveFlag { get; set; }
        public int CanApprove { get; set; }
        public string E2kUserId { get; set; }
        public string RadioSelection { get; set; }
        public string CbolStatus { get; set; }
        public string Containers { get; set; }
        public bool IsDev { get; set; }
        public string ShowError { get; set; }
        public string ErrorType { get; set; }
        public int RowId { get; set; }
        public string ApiUrl { get; set; }
        public string Reason { get; set; }
        public string OriginTp { get; set; }
        public string DestTp { get; set; }
        public string OriginCc { get; set; }
        public string DestCc { get; set; }
        public string EPAOrig { get; set; }
        public string LocCountry { get; set; }
        public string LocRegion { get; set; }
        public string EPADest { get; set; }
        public string RegionOrig { get; set; }
        public string RegionDest { get; set; }
        public string DivisionOrig { get; set; }
        public string DivisionDest { get; set; }
        public string MblNbrFlag { get; set; }
        public string ServiceLevel { get; set; }
        public string VendorName { get; set; }
        public string StartPeriod { get; set; }
        public string EndPeriod { get; set; }
        public string PaidStatus { get; set; }
        #endregion


        public SP_Params() { }
        /// <summary>
        /// DBParameters list.
        /// </summary>
        /// <returns></returns>
        public DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (PageName != "PaidDifferently")
            {

                if (!string.IsNullOrEmpty(AcctYear)) args.Add(new DBParameter("@AcctYear", DbType.AnsiString, AcctYear == "All" ? "0" : AcctYear));
                if (!string.IsNullOrEmpty(AcctMonth)) args.Add(new DBParameter("@AcctMonth", DbType.AnsiString, AcctMonth == "All" ? "0" : AcctMonth));
                if (PageName == "LocVendorsRpt" || PageName == "locationvendor")
                {
                    if (!string.IsNullOrEmpty(CurrencyCode)) args.Add(new DBParameter("@currency_code", DbType.AnsiString, DisplayCurr));
                }
                else { if (!string.IsNullOrEmpty(DisplayCurr)) args.Add(new DBParameter("@display_currency", DbType.AnsiString, DisplayCurr)); }
            }
            if (!string.IsNullOrEmpty(LocCode)) args.Add(new DBParameter("@location_code", DbType.AnsiString, LocCode));
            if (!string.IsNullOrEmpty(LocCountry)) args.Add(new DBParameter("@LocCountry", DbType.AnsiString, LocCountry));
            if (!string.IsNullOrEmpty(LocRegion)) args.Add(new DBParameter("@LocRegion_ID", DbType.AnsiString, LocRegion));
            if (!string.IsNullOrEmpty(AccrualFlag)) args.Add(new DBParameter("@Accrual_flag", DbType.AnsiString, AccrualFlag));
            if (!string.IsNullOrEmpty(BatchId)) args.Add(new DBParameter("@InvBatchID", DbType.AnsiString, BatchId));
            if (!string.IsNullOrEmpty(InvoiceId)) args.Add(new DBParameter("@invoice_id", DbType.AnsiString, InvoiceId));

            if (!string.IsNullOrEmpty(InvoiceRefNo)) args.Add(new DBParameter("@InvRefNo", DbType.AnsiString, InvoiceRefNo));
            if (!string.IsNullOrEmpty(ChargeCode)) args.Add(new DBParameter("@charge_code", DbType.AnsiString, ChargeCode));
            if (!string.IsNullOrEmpty(ChargeStatus)) args.Add(new DBParameter("@charge_status", DbType.AnsiString, ChargeStatus));
            if (!string.IsNullOrEmpty(CompanyCode)) args.Add(new DBParameter("@company_code", DbType.AnsiString, CompanyCode));
            if (!string.IsNullOrEmpty(ContainerNumber)) args.Add(new DBParameter("@container_number", DbType.AnsiString, ContainerNumber));
            if (!string.IsNullOrEmpty(Containers)) args.Add(new DBParameter("@containers", DbType.AnsiString, Containers));

            if (!string.IsNullOrEmpty(CostType)) args.Add(new DBParameter("@CostType", DbType.AnsiString, CostType));
            if (!string.IsNullOrEmpty(CountryCode)) args.Add(new DBParameter("@country_code", DbType.AnsiString, CountryCode));
            if (!string.IsNullOrEmpty(CurrencyCode)) args.Add(new DBParameter("@currency_code", DbType.AnsiString, CurrencyCode));
            if (!string.IsNullOrEmpty(Destination)) args.Add(new DBParameter("@Destination", DbType.AnsiString, Destination));

            if (!string.IsNullOrEmpty(DocumentId)) args.Add(new DBParameter("@DocumentId", DbType.AnsiString, DocumentId));
            if (!string.IsNullOrEmpty(EndDate)) args.Add(new DBParameter("@EndDate", DbType.AnsiString, EndDate.Length > 10 ? EndDate.Substring(0, 10) : EndDate)); //datePart
            if (!string.IsNullOrEmpty(InvoiceStatus)) args.Add(new DBParameter("@invoice_status", DbType.AnsiString, InvoiceStatus));


            if (!string.IsNullOrEmpty(MBLCostBasis)) args.Add(new DBParameter("@mbl_cost_basis", DbType.AnsiString, MBLCostBasis));
            if (!string.IsNullOrEmpty(MBLNumber)) args.Add(new DBParameter("@mbl_number", DbType.AnsiString, MBLNumber));
            if (!string.IsNullOrEmpty(ModifiedBy)) args.Add(new DBParameter("@ModifiedBy", DbType.AnsiString, ModifiedBy));
            if (!string.IsNullOrEmpty(OrigDest)) args.Add(new DBParameter("@OD", DbType.AnsiString, OrigDest));
            if (!string.IsNullOrEmpty(Origin)) args.Add(new DBParameter("@Origin", DbType.AnsiString, Origin));

            if (!string.IsNullOrEmpty(RcvdAtDate)) args.Add(new DBParameter("@RcvdAtDate", DbType.AnsiString, RcvdAtDate.Length > 10 ? RcvdAtDate.Substring(0, 10) : RcvdAtDate));
            if (!string.IsNullOrEmpty(ServiceCode)) args.Add(new DBParameter("@service_code", DbType.AnsiString, ServiceCode));
            if (!string.IsNullOrEmpty(ShipmentNumber)) args.Add(new DBParameter("@shipment_number", DbType.AnsiString, ShipmentNumber));
            if (!string.IsNullOrEmpty(StartDate)) args.Add(new DBParameter("@StartDate", DbType.AnsiString, StartDate.Length > 10 ? StartDate.Substring(0, 10) : StartDate)); //datePart
            if (!string.IsNullOrEmpty(VendorCode)) args.Add(new DBParameter("@vendor_code", DbType.AnsiString, VendorCode));
            if (!string.IsNullOrEmpty(ReferenceFilter)) args.Add(new DBParameter("@ReferenceFilter", DbType.AnsiString, ReferenceFilter));
            if (!string.IsNullOrEmpty(CarrierCBOL)) args.Add(new DBParameter("@mbl_iata_busid", DbType.AnsiString, CarrierCBOL));
            if (!string.IsNullOrEmpty(CarrierId)) args.Add(new DBParameter("@carrier_id", DbType.AnsiString, CarrierId));

            if (!string.IsNullOrEmpty(Table)) args.Add(new DBParameter("@table", DbType.AnsiString, Table));
            if (!string.IsNullOrEmpty(WhereClause)) args.Add(new DBParameter("@whereClause", DbType.AnsiString, WhereClause));
            if (!string.IsNullOrEmpty(TestValue)) args.Add(new DBParameter("@testValue", DbType.AnsiString, TestValue));

            if (!string.IsNullOrEmpty(E2kCarrierCode)) args.Add(new DBParameter("@e2k_carrier_code", DbType.AnsiString, E2kCarrierCode));
            if (!string.IsNullOrEmpty(ImageNumber)) args.Add(new DBParameter("@ImageNumber", DbType.AnsiString, ImageNumber));

            if (!string.IsNullOrEmpty(VendorEnglishName)) args.Add(new DBParameter("@Vendor_Name_Eng", DbType.AnsiString, VendorEnglishName));
            if (!string.IsNullOrEmpty(VendorLegalName)) args.Add(new DBParameter("@Vendor_Legal_Name", DbType.AnsiString, VendorLegalName));
            if (!string.IsNullOrEmpty(VendorId)) args.Add(new DBParameter("@Vendor_Id", DbType.AnsiString, VendorId));
            if (!string.IsNullOrEmpty(GeoId)) args.Add(new DBParameter("@geoid", DbType.AnsiString, GeoId));
            if (!string.IsNullOrEmpty(GeoCode)) args.Add(new DBParameter("@geocode", DbType.AnsiString, GeoCode));
            if (!string.IsNullOrEmpty(FolderName)) args.Add(new DBParameter("@foldername", DbType.AnsiString, FolderName));
            if (!string.IsNullOrEmpty(ExportType)) args.Add(new DBParameter("@ExportType", DbType.AnsiString, ExportType));
            if (!string.IsNullOrEmpty(UserId)) args.Add(new DBParameter("@UserId", DbType.AnsiString, UserId));
            if (!string.IsNullOrEmpty(Comments)) args.Add(new DBParameter("@Comments", DbType.AnsiString, Comments));
            if (!string.IsNullOrEmpty(InvoiceStatusTo)) args.Add(new DBParameter("@invoiceStatusTo", DbType.AnsiString, InvoiceStatusTo));
            if (!string.IsNullOrEmpty(InvoiceStatusFrom)) args.Add(new DBParameter("@invoiceStatusFrom", DbType.AnsiString, InvoiceStatusFrom));
            if (!string.IsNullOrEmpty(ImageURL)) args.Add(new DBParameter("@imageUrl", DbType.AnsiString, ImageURL));
            if (!string.IsNullOrEmpty(ScanDest)) args.Add(new DBParameter("@scanDest", DbType.AnsiString, ScanDest));
            if (!string.IsNullOrEmpty(SortParam)) args.Add(new DBParameter("@sort", DbType.AnsiString, SortParam));
            if (!string.IsNullOrEmpty(HBL)) args.Add(new DBParameter("@hbl", DbType.AnsiString, HBL));
            if (!string.IsNullOrEmpty(Reason)) args.Add(new DBParameter("@Reason", DbType.AnsiString, Reason));
            if (!string.IsNullOrEmpty(OriginTp)) args.Add(new DBParameter("@OriginTp", DbType.AnsiString, OriginTp));
            if (!string.IsNullOrEmpty(DestTp)) args.Add(new DBParameter("@DestTp", DbType.AnsiString, DestTp));
            if (!string.IsNullOrEmpty(OriginCc)) args.Add(new DBParameter("@OriginCc", DbType.AnsiString, OriginCc));
            if (!string.IsNullOrEmpty(DestCc)) args.Add(new DBParameter("@DestCc", DbType.AnsiString, DestCc));
            if (!string.IsNullOrEmpty(EPAOrig)) args.Add(new DBParameter("@EPAOrig", DbType.AnsiString, EPAOrig));
            if (!string.IsNullOrEmpty(EPADest)) args.Add(new DBParameter("@EPADest", DbType.AnsiString, EPADest));
            if (!string.IsNullOrEmpty(RegionOrig)) args.Add(new DBParameter("@RegionOrig", DbType.AnsiString, RegionOrig));
            if (!string.IsNullOrEmpty(RegionDest)) args.Add(new DBParameter("@RegionDest", DbType.AnsiString, RegionDest));
            if (!string.IsNullOrEmpty(DivisionOrig)) args.Add(new DBParameter("@DivisionOrig", DbType.AnsiString, DivisionOrig));
            if (!string.IsNullOrEmpty(DivisionDest)) args.Add(new DBParameter("@DivisionDest", DbType.AnsiString, DivisionDest));
            if (!string.IsNullOrEmpty(MblNbrFlag)) args.Add(new DBParameter("@MblNbrFlag", DbType.AnsiString, MblNbrFlag));
            if (!string.IsNullOrEmpty(ServiceLevel)) args.Add(new DBParameter("@service_code", DbType.AnsiString, ServiceLevel));
            if (!string.IsNullOrEmpty(VendorName)) args.Add(new DBParameter("@Vendor_Name_Eng", DbType.AnsiString, VendorName));
            if (!string.IsNullOrEmpty(StartPeriod)) args.Add(new DBParameter("@StartPeriod", DbType.AnsiString, StartPeriod.Length > 10 ? StartPeriod.Substring(0, 10) : StartPeriod)); //datePart
            if (!string.IsNullOrEmpty(EndPeriod)) args.Add(new DBParameter("@EndPeriod", DbType.AnsiString, EndPeriod.Length > 10 ? EndPeriod.Substring(0, 10) : EndPeriod)); //datePart
            if (!string.IsNullOrEmpty(PaidStatus)) args.Add(new DBParameter("@paidstatus", DbType.AnsiString, PaidStatus));

            //args.AddRange(ToDBParameter());

            return args.ToArray();
        }
    }
}
