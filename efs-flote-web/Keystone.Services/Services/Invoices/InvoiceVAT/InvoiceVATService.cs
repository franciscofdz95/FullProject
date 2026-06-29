using Keystone.DAL.Model;
using Keystone.DAL.Model.Results;
using Keystone.DAL.Provider;
using Keystone.DAL.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Invoices.InvoiceVAT
{
    public class InvoiceVATService : IInvoiceVATService
    {
        private readonly IDataProvider _dataProvider;
            public InvoiceVATService(IDataProvider dataProvider)
            {
                _dataProvider = dataProvider;
            }

        public async Task DeleteVATData(string invoiceId, string vatCode)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));
            args.Add(new DBParameter("@vat_code", DbType.AnsiString, vatCode));
            await _dataProvider.ExecuteNonQueryAsync(DBConstants.DeleteInvoiceVAT, System.Data.CommandType.StoredProcedure, args.ToArray());
        }

        public async Task UpdateDeleteInvoiceVATData(string invoiceId, string vatCode)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));
            args.Add(new DBParameter("@vat_code", DbType.AnsiString, vatCode));
            await _dataProvider.ExecuteNonQueryAsync(DBConstants.UpdateDeleteInvoiceVatData, System.Data.CommandType.StoredProcedure, args.ToArray());
        }

        public async Task UpdateInvoiceVATIds(string invoiceId)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));
            await _dataProvider.ExecuteNonQueryAsync(DBConstants.UpdateInvoiceVatIds, System.Data.CommandType.StoredProcedure, args.ToArray());
        }

        public async Task<int> GetInvoiceChargeCountByVatId(string invoiceId, string location_code)
        {
                int res = 0;
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));
                args.Add(new DBParameter("@location_code", DbType.AnsiString, location_code));
                string result = await _dataProvider.ExecuteScalarAsync(DBConstants.GetInvoiceDetailCountByVatId, System.Data.CommandType.StoredProcedure, args.ToArray());
                int.TryParse(result, out res);
                return res;
        }

        public async Task<IEnumerable<InvoiceSUMVatModel>> GetBillVATDetail(string invoiceId)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));
            return await _dataProvider.ExecuteAsync<InvoiceSUMVatModel>(DBConstants.GetInvoiceSumVAT, System.Data.CommandType.StoredProcedure, args.ToArray());
        }
        public async Task<IEnumerable<InvoiceVATModel>> GetInvoiceVAT(string invoiceId)
        {
            return await _dataProvider.ExecuteAsync<InvoiceVATModel>(DBConstants.GetInvoiceVAT, CommandType.StoredProcedure, new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));
        }
        
    }
}
