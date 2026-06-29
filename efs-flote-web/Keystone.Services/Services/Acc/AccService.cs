using Keystone.DAL.Model;
using Keystone.DAL.Model.Results;
using Keystone.DAL.Provider;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Acc
{
    public class AccService : IAccService
    {
        private readonly IDataProvider _dataProvider;
        public AccService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<IEnumerable<AccNameModel>> GetAccName(string location_code, DateTime invoice_date)
        {
            List<DBParameter> _params = new List<DBParameter>();
            _params.Add(new DBParameter("@location_code", DbType.AnsiString, location_code));
            _params.Add(new DBParameter("@invoice_date", DbType.AnsiString, invoice_date));
            return await _dataProvider.ExecuteAsync<AccNameModel>(DBConstants.GetAccName, System.Data.CommandType.StoredProcedure, _params.ToArray());
        }

        public async Task<IEnumerable<AccNameModel>> GetAccNumber(string accNumber)
        {
            List<DBParameter> _params = new List<DBParameter>();
            _params.Add(new DBParameter("@number", DbType.AnsiString, accNumber));
            return await _dataProvider.ExecuteAsync<AccNameModel>(DBConstants.GetAccName, System.Data.CommandType.StoredProcedure, _params.ToArray());
        }

    }
}
