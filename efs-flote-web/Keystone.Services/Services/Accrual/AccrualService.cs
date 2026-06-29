using Keystone.DAL.Model.Params;
using Keystone.DAL.Model.Results;
using Keystone.DAL.Provider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Accrual
{
    public class AccrualService : IAccrualService
    {
        private readonly IDataProvider _dataProvider;
        public AccrualService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<IEnumerable<AccrualMonthlyReportModel>> GetAccrualMonthlyReport(SP_Params _parameters)
        {
            _parameters.PageName = "AccrualMonJrnlRpt";
            var param = _parameters.ToDBParameter();
            return await _dataProvider.ExecuteAsync<AccrualMonthlyReportModel>(DBConstants.AccrualMonthlyReport, System.Data.CommandType.StoredProcedure, param);
        }

        public async Task<IEnumerable<AccrualMonthlyDetailReportModel>> GetAccrualMonthlyDetailReport(SP_Params _parameters)
        {
            _parameters.PageName = "AccrualMonDetailRpt";
            var param = _parameters.ToDBParameter();
            return await _dataProvider.ExecuteAsync<AccrualMonthlyDetailReportModel>(DBConstants.AccrualMonthlyDetailReport, System.Data.CommandType.StoredProcedure, param);
        }

        public async Task<IEnumerable<AccrualAccuracyReportModel>> GetAccrualAccuracyReport(SP_Params _parameters)
        {
            _parameters.PageName = "AccrualAccuracy";
            var param = _parameters.ToDBParameter();
            return await _dataProvider.ExecuteAsync<AccrualAccuracyReportModel>(DBConstants.AccrualAccuracyReport, System.Data.CommandType.StoredProcedure, param);
        }

    }
}
