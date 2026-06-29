using Keystone.DAL.Model;
using Keystone.DAL.Model.Params;
using Keystone.DAL.Provider;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Bills
{
    public class BillsService : IBillsService
    {
        private readonly IDataProvider _dataprovider;
        public BillsService(IDataProvider dataProvider)
        {
           _dataprovider = dataProvider;
        }

        public async Task<List<DAL.Model.Results.BillsTResult>> GetBills(DAL.Model.Params.BillsTParams param)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@AcctYear", DbType.AnsiString, param.AcctYear));
            args.Add(new DBParameter("@AcctMonth", DbType.AnsiString, param.AcctMonth));
            args.Add(new DBParameter("@display_currency", DbType.AnsiString, param.DisplayCurrency));
            args.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
            args.Add(new DBParameter("@invoice_status", DbType.AnsiString, param.InvoiceStatus));
  
            ///
            //args.Add(new DBParameter("@AcctYear", DbType.AnsiString, "2026"));
            //args.Add(new DBParameter("@AcctMonth", DbType.AnsiString, "6"));
            //args.Add(new DBParameter("@display_currency", DbType.AnsiString, "USD"));
            //args.Add(new DBParameter("@location_code", DbType.AnsiString, "LAX"));
            //args.Add(new DBParameter("@invoice_status", DbType.AnsiString, "Logged"));

            args.Add(new DBParameter("@start", DbType.AnsiString, "0"));
            var result = await _dataprovider.ExecuteAsync<DAL.Model.Results.BillsTResult>(DBConstants.Bills, System.Data.CommandType.StoredProcedure, args.ToArray());
            return result.ToList();
        }

        public async Task<List<DAL.Model.Results.BillsPaymentsTResult>> GetBillsPayments(DAL.Model.Params.BillsTParams param)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@AcctYear", DbType.AnsiString, param.AcctYear));
            args.Add(new DBParameter("@AcctMonth", DbType.AnsiString, param.AcctMonth));
            args.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
            args.Add(new DBParameter("@paidstatus", DbType.AnsiString, param.PaidStatus));
            args.Add(new DBParameter("@invoice_status", DbType.AnsiString, param.InvoiceStatus));

            //args.Add(new DBParameter("@AcctYear", DbType.AnsiString, "2026"));
            //args.Add(new DBParameter("@AcctMonth", DbType.AnsiString, "6"));
            //args.Add(new DBParameter("@location_code", DbType.AnsiString, "LAX"));
            //args.Add(new DBParameter("@paidstatus", DbType.AnsiString, "All"));
            //args.Add(new DBParameter("@invoice_status", DbType.AnsiString, "All"));

            args.Add(new DBParameter("@start", DbType.AnsiString, "0"));
            var result = await _dataprovider.ExecuteAsync<DAL.Model.Results.BillsPaymentsTResult>(DBConstants.GetInvoiceVendorPaymentDetails, System.Data.CommandType.StoredProcedure, args.ToArray());
            return result.ToList();
        }

        public async Task<int> GetIncompletedBills(string location_code, string company_code, string Acct_Year)
        {
            List<DBParameter> args = new List<DBParameter>();
            //args.Add(new DBParameter("@AcctYear", DbType.AnsiString, Acct_Year));
            //args.Add(new DBParameter("@company_code", DbType.AnsiString, company_code));
            //args.Add(new DBParameter("@location_code", DbType.AnsiString, location_code));

            args.Add(new DBParameter("@AcctYear", DbType.AnsiString, "2026"));
            args.Add(new DBParameter("@company_code", DbType.AnsiString, ""));
            args.Add(new DBParameter("@location_code", DbType.AnsiString, "LAX"));

            var result = await _dataprovider.ExecuteScalarAsync(DBConstants.GetApprovedInvoiceCountByWeek, System.Data.CommandType.StoredProcedure, args.ToArray());
            int.TryParse(result.ToString(), out int count);

            return count;
        }

        public async Task<List<int>> GetBillsHeaderCount( BillsTParams param)
        {
            List<DBParameter> args = new List<DBParameter>();
            //args.Add(new DBParameter("@AcctYear", DbType.AnsiString, param.AcctYear));
            //args.Add(new DBParameter("@AcctMonth", DbType.AnsiString, param.AcctMonth));
            //args.Add(new DBParameter("@display_currency", DbType.AnsiString, param.DisplayCurrency));
            //args.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
            //args.Add(new DBParameter("@invoice_status", DbType.AnsiString, param.InvoiceStatus));
            //args.Add(new DBParameter("@scanDest", DbType.AnsiString, param.ScanDest));
            ///
            args.Add(new DBParameter("@AcctYear", DbType.AnsiString, "2026"));
            args.Add(new DBParameter("@AcctMonth", DbType.AnsiString, "6"));
            args.Add(new DBParameter("@display_currency", DbType.AnsiString, "USD"));
            args.Add(new DBParameter("@location_code", DbType.AnsiString, "LAX"));
            args.Add(new DBParameter("@invoice_status", DbType.AnsiString, "Scanned"));
            args.Add(new DBParameter("@scanDest", DbType.AnsiString, "All"));

            var res = await _dataprovider.ExecuteAsyncGeneric(DBConstants.BillsStatusSummary, System.Data.CommandType.StoredProcedure, args.ToArray());
            var tempRes = res.SelectMany(n => n.Values).ToList();
            List<int> resList = tempRes.Select(x => Convert.ToInt32(x)).ToList();
            return resList;
        }


    }
}
