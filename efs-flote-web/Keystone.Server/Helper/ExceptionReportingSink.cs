using Keystone.DAL.Model;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Serilog.Core;
using Serilog.Events;
using System.Configuration;
using System.Data;
using System.Net;
using System.Text;
using System.Data.Common;
using System.Reflection.Metadata;
using Keystone.DAL.Provider;
using System.Security.Cryptography;
using System.Reflection.Emit;
using Serilog;
using Microsoft.Extensions.Configuration;
using Keystone.DAL.Utility;

namespace Keystone.Server.Helper
{ 
    public class ExceptionReportingSink: ILogEventSink
    {
        IFormatProvider? _formatProvider;
        private readonly string? _connectionString;
        IConfiguration _configuration;
        private readonly string authKey = ConfigurationHelper.GetAuthKey();

        public ExceptionReportingSink(IFormatProvider? formatProvider, IConfiguration configuration)
        {
            _formatProvider = formatProvider;
            _configuration= configuration;
            //_connectionString = configuration.GetConnectionString("ConnectionString");
            _connectionString = ConnectionStrings.GetConnectionString(authKey);
        }

        public void Emit(LogEvent logEvent)
        {
            var userID = _configuration.AsEnumerable().ToList().Where(w => w.Key.Equals("USERNAME")).Select(s => s.Value).FirstOrDefault();
            var server = _configuration.AsEnumerable().ToList().Where(w => w.Key.Equals("COMPUTERNAME")).Select(s => s.Value).FirstOrDefault();
            string appCode = "MyReport";
            if (logEvent.Level == LogEventLevel.Information || logEvent.Level == LogEventLevel.Error)
            {
               Guid guid = Guid.NewGuid();
                   var parameters = new DBParameter[] {
                    new DBParameter("@TransactionId",DbType.AnsiString,guid),
                    new DBParameter("@Date",DbType.AnsiString,DateTime.Now.ToString()),
                    new DBParameter("@Server",DbType.AnsiString,server),
                    new DBParameter("@UserId",DbType.AnsiString,userID),
                    new DBParameter("@AppCode",DbType.AnsiString, appCode),
                    new DBParameter("@Level",DbType.AnsiString, (logEvent.Properties.Where(w => w.Key == "Level").Count() == 0) ? logEvent.Level.ToString() : logEvent.Properties.Where(w => w.Key == "Level").Select(t => t.Value).FirstOrDefault().ToString().Replace('"', ' ')+ logEvent.Level.ToString()),
                    new DBParameter("@Event",DbType.AnsiString,"Event"),
                    new DBParameter("@Detail",DbType.AnsiString, logEvent.MessageTemplate.Text.ToString())
                };
                ExecuteAsync<ApplicationBase>("secObject.Log_ISP_3", CommandType.StoredProcedure, parameters);
            }                    
        }
        public async Task<IEnumerable<T>> ExecuteAsync<T>(string storedprocedure, CommandType commandtype, params DBParameter[] args) where T : new()
        {    
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

                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                var property = typeof(T).GetProperty(reader.GetName(i));
                                if (property != null && !reader.IsDBNull(i))
                                {
                                    property.SetValue(obj, reader.GetValue(i));
                                }
                            }
                            result.Add(obj);
                        }

                    }
                }
            }
            return result.ToList<T>();
        }
        
    }

}
