using Keystone.DAL.Model;
using Keystone.DAL.Utility; 
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using System.Data;
using Serilog;

namespace Keystone.DAL.Provider
{
    public class DataProvider:IDataProvider
    {
        private readonly string _connectionString;
        private readonly ILogger _log = Log.ForContext<DataProvider>();
        private readonly string authKey = ConfigurationHelper.GetAuthKey();
        public DataProvider(IConfiguration configuration)
        {
            _connectionString = ConnectionStrings.GetConnectionString(authKey);
        }
        
        public async Task<IEnumerable<T>> ExecuteAsync<T>(string storedprocedure, CommandType commandtype, params DBParameter[] args)where T : new()
        {
            _log.Information("This is log from the Data access layer");
            var result = new List<T>();
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(storedprocedure, con))
                {
                    cmd.CommandType = commandtype;

                    if (commandtype == CommandType.StoredProcedure && null != args)
                        foreach (DBParameter arg in args)
                            cmd.Parameters.Add(arg.ToSQLParameter());

                    await con.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            T obj = new T();

                            for(int i = 0; i < reader.FieldCount; i++)
                            {
                                var property = typeof(T).GetProperty(reader.GetName(i));
                                if(property != null && !reader.IsDBNull(i))
                                {
                                    try
                                    {
                                        property.SetValue(obj, reader.GetValue(i));
                                    }
                                    catch (Exception ex)
                                    {
                                        Console.WriteLine(ex.Message + " " + property.Name);
                                        _log.Error(ex.Message + " " + property.Name);
                                    }

                                }
                            }
                        result.Add(obj);
                        }
                    }
                }
            }
            return result.ToList<T>();
        }
        public async Task ExecuteNonQueryAsync(string storedprocedure, CommandType commandtype, params DBParameter[] args)
        {
            _log.Information("This is log from the Data access layer");
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(storedprocedure, con))
                {
                    cmd.CommandType = commandtype;

                    if (commandtype == CommandType.StoredProcedure && null != args)
                        foreach (DBParameter arg in args)
                            cmd.Parameters.Add(arg.ToSQLParameter());

                    con.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task<string> ExecuteScalarAsync(string storedprocedure, CommandType commandtype, params DBParameter[] args)
        {
            _log.Information("Executing Scalar Query: {StoredProcedure}", storedprocedure);
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(storedprocedure, con))
                {
                    cmd.CommandType = commandtype;

                    if (commandtype == CommandType.StoredProcedure && null != args)
                        foreach (DBParameter arg in args)
                            cmd.Parameters.Add(arg.ToSQLParameter());

                    await con.OpenAsync();
                    var result = await cmd.ExecuteScalarAsync();
                    return result?.ToString();
                }
            }
        }

        ///ESE-1025-2
        ///
        public async Task<IEnumerable<Dictionary<string, object>>> ExecuteAsyncGeneric(string storedprocedure, CommandType commandtype, params DBParameter[] args)
        {
            _log.Information("This is log from the Data access layer");
            var result = new List<Dictionary<string, object>>();
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(storedprocedure, con))
                {
                    cmd.CommandType = commandtype;

                    if (commandtype == CommandType.StoredProcedure && null != args)
                        foreach (DBParameter arg in args)
                            cmd.Parameters.Add(arg.ToSQLParameter());

                    await con.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new Dictionary<string, object>();
                            for (int r = 0; r < reader.FieldCount; r++)
                            {
                                row[reader.GetName(r)] = reader.IsDBNull(r) ? null : reader.GetValue(r);
                            }
                            result.Add(row);
                        }
                    }
                }
            }
            return result;
        }
    }
}
