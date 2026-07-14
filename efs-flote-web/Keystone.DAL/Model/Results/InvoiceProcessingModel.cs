namespace Keystone.DAL.Model.Results
{
    public class InvoiceProcessingLineModel
    {
        public string ROWNUMBER { get; set; }
        public string Invoice_detail_id { get; set; }
        public string invoice_id { get; set; }
        public string rcvd_at_dt { get; set; }
        public string location_code { get; set; }
        public string vendor_code { get; set; }
        public string vendor_name { get; set; }
        public string MBL_nbr { get; set; }
        public string MBL_fk { get; set; }
        public string mbl_iata_busid { get; set; }
        public string shpmnt_nbr { get; set; }
        public string shipment_dim_fk { get; set; }
        public string mbl_chg_fk { get; set; }
        public string rev_split { get; set; }
        public string charge_code_txt { get; set; }
        public string Charge_code { get; set; }
        public string CHARGE_DESCRIPTION { get; set; }
        public string sell_amt { get; set; }
        public string sell_cid { get; set; }
        public string buy_amt { get; set; }
        public string buy_cid { get; set; }
        public string invoice_cid { get; set; }
        public string invoice_amt { get; set; }
        public string invoicevat_id { get; set; }
        public string invoicevat_amt { get; set; }
        public string ConvRate { get; set; }
        public string comment { get; set; }
        public string PaidDifferentlyReason { get; set; }
        public string frontCheck { get; set; }
        public string backCheck { get; set; }
        public string AccrualFlag { get; set; }
        public string Reference_id { get; set; }
        public string rowtype { get; set; }
        public string old_amt { get; set; }
        public string old_cid { get; set; }
        public string man_tol_amt { get; set; }
        public string loc_tol_amt { get; set; }
        public string loc_tol_per { get; set; }
        public string TotalRows { get; set; }
    }

    public class InvoiceChargesDetailModel
    {
        public string invoice_id { get; set; }
        public string vendor_code { get; set; }
        public string Vendor_Name_English { get; set; }
        public string E2K_CARRIER_CODE { get; set; }
        public string InvRefNo { get; set; }
        public string Invoice_CID { get; set; }
        public string Charges_Logged { get; set; }
        public string Charges_Processed { get; set; }
        public string Charges_Variance { get; set; }
        public string VAT_Logged { get; set; }
        public string VAT_Processed { get; set; }
        public string VAT_Variance { get; set; }
        public string TWH_Logged { get; set; }
        public string TWH_Processed { get; set; }
        public string TWH_Variance { get; set; }
        public string OSOffset_Logged { get; set; }
        public string OSOffset_Processed { get; set; }
        public string OSOffset_Variance { get; set; }
        public string Total_Logged { get; set; }
        public string Total_Processed { get; set; }
        public string Total_Variance { get; set; }
    }

    public class VatCodeModel
    {
        public string vat_code { get; set; }
        public string long_description { get; set; }
        public string vat_percent { get; set; }
        public string displayVat { get; set; }
        public string invoicevat_id { get; set; }
    }
}
