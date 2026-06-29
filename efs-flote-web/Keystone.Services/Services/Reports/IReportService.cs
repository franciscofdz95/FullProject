using Keystone.DAL.Model;

namespace Keystone.Services.Services.Reports
{
    public interface IReportService
    {
        Task<IEnumerable<Dictionary<string, object>>> GetReportResult(string procedure, List<DBParameter> parameters);
        Task<List<ReportModel>> GetAllReports();
        Task<ReportModel> GetReportByID(int id);
    }
}
