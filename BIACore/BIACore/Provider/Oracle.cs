using BIACore.Extensions;
using BIACore.Log;
using BIACore.Model;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace BIACore.Provider
{
    /// <summary>
    /// Provider for interop'ing with Oracle.
    /// Tracks performance of queries, logs exceptions, etc...
    /// </summary>
    public static class Oracle
    {
        #region List
        /// <summary>
        /// Performs an Oracle Execute for the given connection, stored procedure, args list.
        /// Automatically casts the result from a datatable into a list of fully typed objects.
        /// </summary>
        /// <typeparam name="T">The Type parameter to return</typeparam>
        /// <param name="connection">The Connection string to use</param>
        /// <param name="sp">The stored procedure to execute</param>
        /// <param name="args">Any arguments to pass to the stored procedure</param>
        /// <returns>List&lt;T&gt; the list of type objects or an empty list.</returns>
        public static List<T> Execute<T>(string connection, string sp, params DBParameter[] args) where T : new()
        {
            return Execute<T>(connection, sp, BIACore.Settings.Log.Sql, args);
        }
        public static List<T> Execute<T>(string connection, string sp, bool logOracle, params DBParameter[] args) where T : new()
        {
            DataTable table = Oracle.Execute(connection, sp, logOracle, args);
            return (table != null) ? table.ToList<T>() : new List<T>();
        }
        /// <summary>
        /// Perform an Oracle Execute for a given connection and raw oracle text.
        /// Automatically casts the result from a datatable into a list of fully typed objects.
        /// </summary>
        /// <typeparam name="T">The Type parameter to return</typeparam>
        /// <param name="connection">The Connection string to use</param>
        /// <param name="text">The oracle text to execute</param>
        /// <returns>List&lt;T&gt; the list of type objects or an empty list.</returns>
        [Obsolete("You should be using stored procedures, not oracle-text")]
        public static List<T> Execute<T>(string connection, string text) where T : new()
        {
            DataTable table = Oracle.Execute(connection, text);
            return (table != null) ? table.ToList<T>() : new List<T>();
        }
        public static List<string> ExecuteToString(string connection, string sp, params DBParameter[] args)
        {
            DataTable table = Oracle.Execute(connection, sp, args);

            List<string> result = new List<string>();
            if (table == null || table.Rows.Count < 1 || table.Columns.Count < 1) return result;

            foreach (System.Data.DataRow row in table.Rows)
            {
                result.Add(row[0].ToString());
            }
            return result;
        }
        #endregion

        #region DataTable
        public static DataTable Execute(string connection, string sp, params DBParameter[] args)
        {
            return Execute(connection, sp, BIACore.Settings.Log.Sql, args);
        }
        public static DataTable Execute(string connection, string sp, bool logOracle, params DBParameter[] args)
        {
            return Execute(connection, sp, BIACore.Settings.Log.Sql, CommandType.StoredProcedure, args);
        }
        [Obsolete("You should be using stored procedures, not oracle-text")]
        public static DataTable Execute(string connection, string text)
        {
            return Execute(connection, text, BIACore.Settings.Log.Sql, CommandType.Text);
        }
        public static DataTable Execute(string connection, string sp, bool logOracle, CommandType ct, params DBParameter[] args)
        {
            DataTable result = null;
            DateTime start = DateTime.UtcNow;
            try
            {
                if (logOracle) LogFactory.Oracle(sp, args);
                result = ExecuteOracle(connection, sp, ct, false, args);
            }
            catch (Exception e)
            {
                LogFactory.ExceptionSQL(e, sp, args);
                throw;
            }
            finally
            {
                LogFactory.Performance(ct == CommandType.Text ? "Oracle Text" : sp, DateTime.UtcNow.Subtract(start).TotalSeconds);
            }
            return result;
        }
        #endregion

        #region Non-Query
        public static void ExecuteNonQuery(string connection, string sp, params DBParameter[] args)
        {
            ExecuteNonQuery(connection, sp, CommandType.StoredProcedure, args);
        }
        [Obsolete("You should be using stored procedures, not oracle-text")]
        public static void ExecuteNonQuery(string connection, string text)
        {
            ExecuteNonQuery(connection, text, CommandType.Text);

        }
        public static void ExecuteNonQuery(string connection, string sp, CommandType ct, params DBParameter[] args)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                LogFactory.Oracle(sp, args);
                ExecuteOracle(connection, sp, ct, true, args);
            }
            catch (Exception e)
            {
                LogFactory.ExceptionSQL(e, sp, args);
                throw;
            }
            finally
            {
                LogFactory.Performance(ct == CommandType.Text ? "Oracle Text" : sp, DateTime.UtcNow.Subtract(start).TotalSeconds);
            }
        }
        #endregion

        #region Helper functions
        internal static DataTable ExecuteOracle(string connection, string oracle, CommandType ct, bool nonQuery, params DBParameter[] args)
        {
            connection = ConnectionStrings.GetConnectionString(connection);

            DataTable result = null;
            using (OracleConnection con = new OracleConnection(connection))
            {
                using (OracleCommand cmd = new OracleCommand(oracle, con))
                {
                    cmd.CommandTimeout = Settings.Oracle.Timeout;
                    cmd.CommandType = ct;

                    if (ct == CommandType.StoredProcedure && null != args)
                        foreach (DBParameter arg in args)
                            cmd.Parameters.Add(arg.ToSQLParameter());

                    con.Open();

                    if (nonQuery)
                    {
                        cmd.ExecuteNonQuery();
                    }
                    else
                    {
                        using (OracleDataAdapter adapter = new OracleDataAdapter(cmd))
                        {
                            result = new DataTable();
                            adapter.Fill(result);
                        }
                    }
                }
            }
            return result;
        }
        public static DataRow GetTotalRow(DataTable dt)
        {
            if (dt == null) return null;

            DataRow _result = null;
            DataRow total = null;

            if (dt.Rows.Count == 0)
            {
                total = dt.NewRow();
                dt.Rows.Add(total);
            }
            else
            {
                total = dt.Rows[dt.Rows.Count - 1];
            }

            _result = total.CloneRow();
            total.Delete();
            dt.AcceptChanges();

            return _result;
        }
        #endregion

        public static bool ExecuteTestConnection(string connection, string sp, params DBParameter[] args)
        {
            return ExecuteTestConnection(connection, sp, CommandType.StoredProcedure, args);
        }
        internal static bool ExecuteTestConnection(string connection, string sql, CommandType ct, params DBParameter[] args)
        {

            LogFactory.Message("Pre-Launch Oracle Connection Test", args);
            DataTable result = null;
            result = SQL.GetDatabaseConnectionString(connection, sql, ct, args);

            LogFactory.Message("Oracle Connection Test Connection: " + connection, args);

            string connectionTemplate = ConnectionStrings.ConnectionStringTemplates["Oracle"];
            string dbConnectionString = connectionTemplate.Replace("{ServerName}", Convert.ToString(result.Rows[0]["ServerName"]))
                .Replace("{DatabaseName}", Convert.ToString(result.Rows[0]["DatabaseName"]))
                .Replace("{InstanceName}", Convert.ToString(result.Rows[0]["InstanceName"]))
                .Replace("{Port}", Convert.ToString(result.Rows[0]["Port"]))
                .Replace("{GlobalName}", Convert.ToString(result.Rows[0]["GlobalName"]))
                .Replace("{Username}", Convert.ToString(result.Rows[0]["Username"]))
                .Replace("{ServerNameInstanceName}", Convert.ToString(result.Rows[0]["ServerName"]) + (!String.IsNullOrWhiteSpace(Convert.ToString(result.Rows[0]["InstanceName"])) ? @"\" + Convert.ToString(result.Rows[0]["InstanceName"]) : ""))
                .Replace("{DecryptedAuthKey}", ConnectionUser.DecryptAuthKey(Convert.ToString(result.Rows[0]["AuthKey"])));
            
            try
            {
                using (OracleConnection con = new OracleConnection(dbConnectionString))
                {
                    con.Open();

                    return true;
                }
            }
            catch (Exception e)
            {
                LogFactory.ExceptionSQL(e, "Oracle Connection Test", args);
                return false;
            }

        }
        
    }
}
