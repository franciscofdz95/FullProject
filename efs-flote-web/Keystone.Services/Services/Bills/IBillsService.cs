using Keystone.DAL.Model.Params;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Bills
{
    public interface IBillsService
    {
        Task<List<DAL.Model.Results.BillsTResult>> GetBills(DAL.Model.Params.BillsTParams param);
        Task<List<DAL.Model.Results.BillsPaymentsTResult>> GetBillsPayments(DAL.Model.Params.BillsTParams param);

        Task<int> GetIncompletedBills(string location_code, string company_code, string Acct_Year);
        Task<List<int>> GetBillsHeaderCount(BillsTParams param);

    }
}
