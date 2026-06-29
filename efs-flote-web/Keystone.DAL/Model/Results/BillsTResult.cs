using Microsoft.AspNetCore.Http.HttpResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Model.Results
{
    public class BillsTResult
    {
        public Int64 ROWNUMBER { get; set; } 
        public Int32 invoice_id { get; set; }
        public DateTime CreatedDT { get; set; }
        public string InvRefNo { get; set; }
        public string Invoice_CID { get; set; }
        public string AP_Vendor_id { get; set; }
        public string AP_Remit_id { get; set; }
        public int Vendor_id { get; set; }
        public string Location_Code { get; set; }
        public string remote_check_location { get; set; }
        public string ScanFolder { get; set; }
        public string Oracle_Site_Code { get; set; }
        public string ImageNumber { get; set; }
        public string  vendor_code { get; set; }
        public string vendor_name_english { get; set; }
        public string showcheckbox { get; set; }
        public string pay_group { get; set; }
        public string CreatedBy { get; set; }
        public DateTime ApprovedDT { get; set; }
        public string ApprovedBy { get; set; }
        public string invoice_status { get; set; }
        public string ReferenceFilter { get; set; }
        public int reference_id { get; set; }
        public string imageURL { get; set; }
        public string scan_dest { get; set; }
        public int ImageCount { get; set; }
        public string Imagefolder { get; set; }
        public string on_oracle { get; set; }
        public string Rejected { get; set; }
        public string RejectedBy { get; set; }
        public DateTime RejectedDate { get; set; }
        public string RejectedRecall { get; set; }
        public string Comment { get; set; }
        public decimal invoice_amt { get; set; }
        public decimal invoiceAmt { get; set; }
        public string shpmnt_nbr { get; set; }
        public string location_data_entry { get; set; }
        public DateTime ModifiedDT { get; set; }
        public string ModifiedBy { get; set; }
        public int detail_cnt { get; set; }
        public int batch_id { get; set; }
        public string invalidimage { get; set; }
        public string ScanRejectedBy { get; set; }
        public string RejectScanComments { get; set; }
        public string IncorrectScan { get; set; }
        public string Scandest_Mod { get; set; }
        public string pay_group_popup { get; set; }
        public decimal Paid { get; set; }
        public int TotalRows { get; set; }

    }

    public class BillsPaymentsTResult
    {
        public Int64 ROWNUMBER { get; set; }
        public string Location_Code { get; set; }
        public string InvRefNo { get; set; }
        public Int32 Invoice_Id { get; set; }
        public string Invoice_Status { get; set; }
        public Int32 Invoice_Key { get; set; }
        public Int32 Vendor_Site_key { get; set; }
        public string Invoice_Currency_Code { get; set; }
        public string Invoice_Num { get; set; }
        public decimal Invoice_Amount { get; set; }
        public DateTime Invoice_Date { get; set; }
        public string Invoice_Image_Num { get; set; }
        public string Invoice_Payment_Method { get; set; }
        public string Invoice_Dist_Type { get; set; }
        public string Vendor_Num { get; set; }
        public string Vendor_Name { get; set; }
        public string Site_Code { get; set; }
        public string Payment_Status { get; set; }
        public DateTime Payment_Due_Date { get; set; }
        public decimal Payment_Amount { get; set; }
        public string Check_Currency_Code { get; set; }
        public string Payment_Method { get; set; }
        public string Check_Num { get; set; }
        public int TotalRows { get; set; }
        public DateTime Check_Date { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
