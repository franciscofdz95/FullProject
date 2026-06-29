using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Model.Params
{
    public class BillsTParams
    {
        public string? View { get; set; }
        public string? AcctYear { get; set; }
        public string? AcctMonth { get; set; }
        public string? LocCode { get; set; }
        public string? InvoiceStatus { get; set; }
        public string? DisplayCurrency { get; set; }
        public string? PaidStatus { get; set; }
        public string? ScanDest { get; set; }
    }
}
