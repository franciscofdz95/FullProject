using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Model.Results
{
    public class InvoiceModel
    {
        public int SupplierID{get;set;} 
        public int Invoice_id{get;set;}
        public string invoice_status{get;set;}
        public string location_code{get;set;}
        public int Vendor_id{get;set;}
        public string vendor_name_english{get;set;}
            public string VendorLVB{get;set;}
            public string VendorValueField{get;set;}
            public string VendorKeyField{get;set;}
            public string InvRefNo{get;set;}
            public string invoice_CID{get;set;}
            public DateTime InvoiceDate{get;set;}
            public DateTime InvoiceDueDate{get;set;}
            public decimal Invoice_Amt{get;set;}
            public string ReferenceFilter{get;set;}
            public int Reference_id{get;set;}
            public DateTime VATPointDate{get;set;}
            public string OtherReference{get;set;}
            public string CheckNumber{get;set;}
            public string StampNumber{get;set;}
            public string AccNumber{get;set;}
            public string Bank_info{get;set;}
            public DateTime Check_date{get;set;}
            public decimal Check_Amt_nbr{get;set;}
            public bool pay_alone_flag{get;set;}
            public decimal GL_Currency_rate{get;set;}
            public string value_pay_invoice_type_code{get;set;}
            public int RegionId{get;set;}
            public string CountryCode{get;set;}
            public string SITE_CURRENCY_CODE{get;set;}
            public string ScanInfo{get;set;}
            public string remote_check_location{get;set;}
            public decimal CheckAmt{get;set;}
            public DateTime StampDT{get;set;}
            public decimal TWH_Amount{get;set;}
            public string locCurrCode{get;set;}
            public decimal VATTotal{get;set;}
            public decimal TotalBillAmount{get;set;}

    }
}
