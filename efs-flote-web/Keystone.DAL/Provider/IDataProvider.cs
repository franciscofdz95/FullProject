using Keystone.DAL.Model;
using System.Data;

namespace Keystone.DAL.Provider
{
    public interface IDataProvider
    {
        Task<IEnumerable<T>>  ExecuteAsync<T>(string storedprocedure, CommandType commandtype, params DBParameter[] args) where T : new();
        Task ExecuteNonQueryAsync(string storedprocedure, CommandType commandtype, params DBParameter[] args);
        Task<string> ExecuteScalarAsync(string v, CommandType storedProcedure, DBParameter[] parameters);
        //ESE-1025-2
        Task<IEnumerable<Dictionary<string, object>>> ExecuteAsyncGeneric(string storedprocedure, CommandType commandtype, params DBParameter[] args);
    }
}
