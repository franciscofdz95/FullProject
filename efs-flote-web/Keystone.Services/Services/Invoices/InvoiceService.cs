using Keystone.DAL.Model;
using Keystone.DAL.Model.Results;
using Keystone.DAL.Provider;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Invoices
{
    internal class InvoiceService : IInvoiceService
    {
        private readonly IDataProvider _dataProvider;
        public InvoiceService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }
        public async Task<InvoiceModel> GetInvoice(string invoiceId)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));
            var result = await _dataProvider.ExecuteAsync<InvoiceModel>(DBConstants.GetForEditInvoice, CommandType.StoredProcedure, args.ToArray());
            return result.FirstOrDefault();
        }

        public async Task<string> CheckInvoiceDetForExVATCode(string invoiceId, string vatCode)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));
            args.Add(new DBParameter("@vat_code", DbType.AnsiString, vatCode));
            return await _dataProvider.ExecuteScalarAsync(DBConstants.CheckInvoiceDetailForExVatCode, CommandType.StoredProcedure, args.ToArray());
        }
    }
}
