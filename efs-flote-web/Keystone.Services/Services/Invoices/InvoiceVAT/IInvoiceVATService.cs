
using Keystone.DAL.Model.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Invoices.InvoiceVAT
{
    internal interface IInvoiceVATService
    {
        Task DeleteVATData(string invoiceId, string vatCode);
        Task UpdateDeleteInvoiceVATData(string invoiceId, string vatCode);
        Task UpdateInvoiceVATIds(string invoiceId);
        Task<int> GetInvoiceChargeCountByVatId(string invoiceId, string location_code);
        Task<IEnumerable<InvoiceSUMVatModel>> GetBillVATDetail(string invoiceId);
        Task<IEnumerable<InvoiceVATModel>> GetInvoiceVAT(string invoiceId);
    }
}
