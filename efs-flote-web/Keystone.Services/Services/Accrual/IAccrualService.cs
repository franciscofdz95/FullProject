
using Keystone.DAL.Model.Params;
using Keystone.DAL.Model.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Accrual
{
    public interface IAccrualService
    {
        Task<IEnumerable<AccrualMonthlyReportModel>> GetAccrualMonthlyReport(SP_Params _parameters);
        Task<IEnumerable<AccrualMonthlyDetailReportModel>> GetAccrualMonthlyDetailReport(SP_Params _parameters);
        Task<IEnumerable<AccrualAccuracyReportModel>> GetAccrualAccuracyReport(SP_Params _parameters);
    }
}
