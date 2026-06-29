using Keystone.DAL.Model.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Invoices
{
    public interface IInvoiceService
    {
        Task<InvoiceModel> GetInvoice(string invoiceId);
        Task<string> CheckInvoiceDetForExVATCode(string invoiceId, string vatCode);
    }
}
