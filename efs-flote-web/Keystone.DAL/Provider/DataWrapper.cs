using Keystone.DAL.Model;
using Keystone.DAL.Utility;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Keystone.DAL.Provider
{ 
    public class DataWrapper : IDataWrapper
    {
        private readonly string _connectionString;
        private readonly string authKey = ConfigurationHelper.GetAuthKey();
        public DataWrapper()
        {
            data = new List<Dictionary<string, object>>();
        }
        public DataWrapper(IConfiguration configuration)
        {
            _connectionString = ConnectionStrings.GetConnectionString(authKey);
        }
        public DataWrapper GetDataFromSP(string spName, string[][] inputParams, string[] colNames)
        {
            DataWrapper dataWrapper = new DataWrapper();
            SqlConnection sqlConnection = new SqlConnection(_connectionString);

            SqlCommand sqlCommand = new SqlCommand(spName, sqlConnection);
            sqlCommand.CommandTimeout = 90; //The time in seconds to wait for the command to execute.
            sqlCommand.CommandType = CommandType.StoredProcedure;
            if (inputParams != null)
            {
                foreach (string[] inputParam in inputParams)
                {
                    sqlCommand.Parameters.AddWithValue(inputParam[0], inputParam[1]);
                }
            }
            sqlConnection.Open();
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
            if (sqlDataReader.HasRows)
            {
                while (sqlDataReader.Read())
                {
                    dataWrapper.AddROW(sqlDataReader, colNames);
                }
            }
            sqlDataReader.Close();
            sqlConnection.Close();

            return dataWrapper;
        }

        public void AddROW(SqlDataReader sqlDataReader, string[] colNames)
        {
            Dictionary<string, object> properties = new Dictionary<string, object>();
            foreach (string colName in colNames)
            {
                properties[colName] = sqlDataReader[colName];
            }
            data.Add(properties);
        }

        public List<Dictionary<string, object>> data { get; set; }
    }
    
}
