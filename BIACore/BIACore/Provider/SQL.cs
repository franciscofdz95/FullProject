using BIACore.Extensions;
using BIACore.Log;
using BIACore.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace BIACore.Provider
{
    /// <summary>
    /// Provider for interop'ing with SQL.
    /// Tracks performance of queries, logs exceptions, etc...
    /// </summary>
    // Add error trapping around SqlConnection.Open looking for SqlException with ex.Number == 18487 || 18488 to trap bad password errors
    public static class SQL
    {
        #region List
        /// <summary>
        /// Performs an SQL Execute for the given connection, stored procedure, args list.
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
        public static List<T> Execute<T>(string connection, string sp, bool logSql, params DBParameter[] args) where T : new()
        {
            DataTable table = SQL.Execute(connection, sp, logSql, args);
            return (table != null) ? table.ToList<T>() : new List<T>();
        }
        /// <summary>
        /// Perform an SQL Execute for a given connection and raw sql text.
        /// Automatically casts the result from a datatable into a list of fully typed objects.
        /// </summary>
        /// <typeparam name="T">The Type parameter to return</typeparam>
        /// <param name="connection">The Connection string to use</param>
        /// <param name="text">The sql text to execute</param>
        /// <returns>List&lt;T&gt; the list of type objects or an empty list.</returns>
        [Obsolete("You should be using stored procedures, not sql-text")]
        public static List<T> Execute<T>(string connection, string text) where T : new()
        {
            DataTable table = SQL.Execute(connection, text);
            return (table != null) ? table.ToList<T>() : new List<T>();
        }
        public static List<string> ExecuteToString(string connection, string sp, params DBParameter[] args)
        {
            DataTable table = SQL.Execute(connection, sp, args);

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
        public static DataTable Execute(string connection, string sp, bool logSql, params DBParameter[] args)
        {
            return Execute(connection, sp, BIACore.Settings.Log.Sql, CommandType.StoredProcedure, args);
        }
        [Obsolete("You should be using stored procedures, not sql-text")]
        public static DataTable Execute(string connection, string text)
        {
            return Execute(connection, text, BIACore.Settings.Log.Sql, CommandType.Text);
        }
        public static DataTable Execute(string connection, string sp, bool logSql, CommandType ct, params DBParameter[] args)
        {
            DataTable result = null;
            DateTime start = DateTime.UtcNow;
            try
            {
                if (logSql) LogFactory.SQL(sp, args);
                result = ExecuteSQL(connection, sp, ct, false, args);
            }
            catch (Exception e)
            {
                LogFactory.ExceptionSQL(e, sp, args);
                throw(e); // Testing throwing e..
            }
            finally
            {
                LogFactory.Performance(ct == CommandType.Text ? "SQL Text" : sp, DateTime.UtcNow.Subtract(start).TotalSeconds);
            }
            return result;
        }
        #endregion

        #region Non-Query
        public static void ExecuteNonQuery(string connection, string sp, params DBParameter[] args)
        {
            ExecuteNonQuery(connection, sp, CommandType.StoredProcedure, args);
        }
        [Obsolete("You should be using stored procedures, not sql-text")]
        public static void ExecuteNonQuery(string connection, string text)
        {
            ExecuteNonQuery(connection, text, CommandType.Text);

        }
        public static void ExecuteNonQuery(string connection, string sp, CommandType ct, params DBParameter[] args)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                LogFactory.SQL(sp, args);
                ExecuteSQL(connection, sp, ct, true, args);
            }
            catch (Exception e)
            {
                LogFactory.ExceptionSQL(e, sp, args);
                throw;
            }
            finally
            {
                LogFactory.Performance(ct == CommandType.Text ? "SQL Text" : sp, DateTime.UtcNow.Subtract(start).TotalSeconds);
            }
        }
        #endregion

        #region Raw
        public static Dictionary<string,object> ExecuteSQLRaw(string connection, string sp, params DBParameter[] args)
        {
            return (Dictionary<string, object>)ExecuteSQLRaw(connection, sp, CommandType.StoredProcedure, false, args);
        }
        public static object ExecuteSQLRaw(string connection, string sql, CommandType ct, bool nonQuery, params DBParameter[] args)
        {
            try
            {
                connection = ConnectionStrings.GetConnectionString(connection);

                using (SqlConnection con = new SqlConnection(connection))
                {
                    using (SqlCommand cmd = new SqlCommand(sql, con))
                    {
                        cmd.CommandTimeout = Settings.Sql.Timeout;
                        cmd.CommandType = ct;

                        if (ct == CommandType.StoredProcedure && null != args)
                            foreach (DBParameter arg in args)
                                cmd.Parameters.Add(arg.ToSQLParameter());

                        con.Open();

                        if (nonQuery) return cmd.ExecuteNonQuery();
                        using (SqlDataReader data = cmd.ExecuteReader())
                        {
                            if (data.HasRows)
                            {
                                data.Read();
                                List<string> columns = Enumerable.Range(0, data.FieldCount).Select(data.GetName).ToList();
                                Dictionary<string, object> dataObj = new Dictionary<string, object>();
                                foreach (string col in columns)
                                {
                                    dataObj.Add(col, data[col]);
                                }
                                con.Close();
                                return dataObj;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // ***WARNING***
                // This is a very dangerous place to do any logging, since it has the potential to catch an error trying to log and get into
                // exponential loop condition that will overload the server, use all available memory and crash the BIACore App Pool.
                // - M.Erdmann 6/18/2020
                // ***WARNING***

                //if not db: BIASecurity, LOG
                if (!connection.ToLower().Contains("catalog=biasecurity"))
                {
                    LogFactory.ExceptionSQL(ex, sql, args);
                }
                //otherwise, LOG unless it is one of these deadly errors
                else if (
                    !(
                        sql.Contains("Log_GroupUpsert") ||
                        sql.Contains("Log_ISP_3") ||      //if this fails for any reason, would cause loop
                        ex.StackTrace.Contains("Log_GroupUpsert") ||
                        ex.StackTrace.Contains("Log_ISP_3") ||
                        //ex.StackTrace.Contains("Execution Timeout Expired") ||
                        ex.StackTrace.Contains("Connection Timeout Expired") ||
                        ex.StackTrace.Contains("Login failed for user") ||
                        //ex.StackTrace.Contains("transport-level error has occurred") ||  //removing this, I don't believe this is a full-down error
                        ex.StackTrace.Contains("network-related or instance-specific error") ||
                        ex.StackTrace.Contains("pre-login handshake")
                    )
                )
                {
                    LogFactory.ExceptionSQL(ex, sql, args);  //Do not re-enable, this causes a loop if the ExecuteSQL is called by the LogFactory! M.Erdmann 6/17/2020
                }
            }
            return null;
        }
        #endregion

        #region Helper functions
        internal static DataTable ExecuteSQL(string connection, string sql, CommandType ct, bool nonQuery, params DBParameter[] args)
        {
            connection = ConnectionStrings.GetConnectionString(connection);

            DataTable result = null;
            using (SqlConnection con = new SqlConnection(connection))
            {
                using (SqlCommand cmd = new SqlCommand(sql, con))
                {
                    cmd.CommandTimeout = Settings.Sql.Timeout;
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
                        using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
                        {
                            result = new DataTable();
                            adapter.Fill(result);
                        }
                    }
                }
            }

            return result;

            // ***WARNING***
            // Be very careful adding logging at this level, could have serious consequences. See ExecuteSQLRaw above for more info.
            // While this method is not normally used to run against the BIACore databases, extreme care should still be taken.
            // - M.Erdmann 6/18/2020
            // ***WARNING***

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

        public static bool ExecuteTestConnection(string connection, string sp, params DBParameter[] args)
        {
            return ExecuteTestConnection(connection, sp, CommandType.StoredProcedure, args);
        }
        internal static bool ExecuteTestConnection(string connection, string sql, CommandType ct, params DBParameter[] args)
        {
            DataTable result = null;
            result = GetDatabaseConnectionString(connection, sql, ct, args);
   
            string connectionTemplate = ConnectionStrings.ConnectionStringTemplates["SQL"];
            string dbConnectionString = connectionTemplate.Replace("{ServerName}", Convert.ToString(result.Rows[0]["ServerName"]))
                .Replace("{DatabaseName}",Convert.ToString(result.Rows[0]["DatabaseName"]))
                .Replace("{ServerNameInstanceName}", (!String.IsNullOrWhiteSpace(Convert.ToString(result.Rows[0]["Port"]))) ? @"{ServerNameInstanceName}," + Convert.ToString(result.Rows[0]["Port"]) : @"{ServerNameInstanceName}")
                .Replace("{InstanceName}", Convert.ToString(result.Rows[0]["InstanceName"]))
                .Replace("{Port}", Convert.ToString(result.Rows[0]["Port"]))
                .Replace("{GlobalName}", Convert.ToString(result.Rows[0]["GlobalName"]))
                .Replace("{Username}", Convert.ToString(result.Rows[0]["Username"]))
                .Replace("{ServerNameInstanceName}", Convert.ToString(result.Rows[0]["ServerName"]) + (!String.IsNullOrWhiteSpace(Convert.ToString(result.Rows[0]["InstanceName"])) ? @"\" + Convert.ToString(result.Rows[0]["InstanceName"]) : ""))
                .Replace("{DecryptedAuthKey}", ConnectionUser.DecryptAuthKey(Convert.ToString(result.Rows[0]["AuthKey"])));


            try
            {
                using (SqlConnection con = new SqlConnection(String.Format("{0}{1}", dbConnectionString, "Connection Timeout=30")))
                {
                    con.Open();

                    return true;             
                }
            }
            catch (Exception e)
            {
                LogFactory.ExceptionSQL(e,"SQL Connection Test", args);
                return false;
            }
            
        }
        internal static DataTable GetDatabaseConnectionString(string connection, string sql, CommandType ct, params DBParameter[] args)
        {
            connection = ConnectionStrings.GetConnectionString(connection);
           
            DataTable result = null;
            using (SqlConnection con = new SqlConnection(connection))
            {
                using (SqlCommand cmd = new SqlCommand(sql, con))
                {
                    cmd.CommandTimeout = Settings.Sql.Timeout;
                    cmd.CommandType = ct;

                    if (ct == CommandType.StoredProcedure && null != args)
                        foreach (DBParameter arg in args)
                            cmd.Parameters.Add(arg.ToSQLParameter());

                    con.Open();

                    using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
                    {
                        result = new DataTable();
                        adapter.Fill(result);
                    }
                }
            }        
           

            return result;
        }
       
        #endregion
    }
}
