using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Model.Results
{
    public class InvoiceVATModel
    {
        public string VAT_Code { get; set; }
        public decimal VAT_Percent { get; set; }
        public decimal VAT_Amount { get; set; }
        public decimal Amount { get; set; }
    }
    public class InvoiceSUMVatModel
    {
        public string InvoiceVAT_Id { get; set; }
        public string Invoice_Id { get; set; }
        public decimal Amount { get; set; }
        public string Source { get; set; }
        public string VAT_Code { get; set; }
        public decimal VAT_Percent { get; set; }
        public decimal VAT_Amount { get; set; }
        public string Currency_Code { get; set; }
        public string ModifiedBy { get; set; }
        public decimal TWH_Amount { get; set; }
        public decimal OSOffset { get; set; }
    }
}
