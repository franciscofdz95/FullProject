using Keystone.DAL.Model;
using Keystone.DAL.Provider;
using System.Data;

namespace Keystone.Services.Services.Reports
{
    public class ReportService : IReportService
    {
        private readonly IDataProvider _dataProvider;

        public ReportService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public async Task<List<ReportModel>> GetAllReports()
        {
            var parameters = new DBParameter[] {
            new DBParameter("@active",DbType.Int16, 1),
            };

            var results = await _dataProvider.ExecuteAsync<ReportModel>(
                    "AppObject.usp_GetAll_SFABRA_Reports",
                    CommandType.StoredProcedure,
                    parameters
                );
            return results.ToList();
        }

        public async Task<ReportModel> GetReportByID(int id)
        {
            var parameters = new DBParameter[] {
                new ("@ID",DbType.Int64, id),
            };

            var result = await _dataProvider.ExecuteAsync<ReportModel>(
                    "AppObject.usp_Get_SFABRA_ReportByID",
                    CommandType.StoredProcedure,
                    parameters
                );

            return result.FirstOrDefault();
        }

        public async Task<IEnumerable<Dictionary<string, object>>> GetReportResult(string procedure, List<DBParameter> parameters)
        {
            IEnumerable<Dictionary<string, object>> results = null;
            if (parameters.Count == 0)
            {
                results = await _dataProvider.ExecuteAsyncGeneric(
                        procedure,
                        CommandType.StoredProcedure
                    );
            }
            else
            {
                results = await _dataProvider.ExecuteAsyncGeneric(
                        procedure,
                        CommandType.StoredProcedure,
                        parameters.ToArray()
                    );
            }

            return results;
        }

        ///// <summary>
        ///// ESE-0126-1
        ///// </summary>
        ///// <param name="_writeOffRepList"></param>
        ///// <returns></returns>
        //public async Task<List<string>> UploadDocuments(List<WriteOffReportModel> _writeOffRepList)
        //{
        //    List<string> _results = new();
        //    foreach (var item in _writeOffRepList)
        //    {
        //        var parameters = new DBParameter[]
        //           {
        //               new ("@schedule_num", DbType.Int32, item.Schedule_Num),
        //               new ("@district_num", DbType.Int32, item.District_Num),
        //               new ("@sfabra_num", DbType.AnsiString, item.SFABRA_Num),
        //               new ("@gateway", DbType.AnsiString, item.Gateway),
        //               new ("@gateway_comments", DbType.AnsiString, item.Gateway_Comments),
        //               new ("@at_comments", DbType.AnsiString, item.AT_Comments),
        //               new ("@writeoff_comments", DbType.AnsiString, item.WriteOff),
        //               new ("@team_discuss", DbType.AnsiString, item.Team_Discuss)
        //           };

        //        var result = await _dataProvider.ExecuteScalarAsync(
        //        "[AppObject].[usp_Update_WriteOffComments]",
        //        CommandType.StoredProcedure,
        //        parameters);

        //        _results.Add(result);
        //    }

        //    return _results;
        //}

        ///// <summary>
        ///// 
        ///// </summary>
        ///// <returns></returns>
        //public async Task<IEnumerable<SfabraDropDownText>> GetReportRegionsDropdown()
        //{
        //    var result = await _dataProvider.ExecuteAsync<SfabraDropDownText>("AppObject.usp_GetReportRegions", CommandType.StoredProcedure);

        //    return result;
        //}

    }
}
