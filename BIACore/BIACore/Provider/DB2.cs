
//using System;
//using System.Collections.Generic;
//using System.Configuration;
//using System.Data;
//using System.Data.Common;
//using System.Linq;
//using System.Text;

//using IBM.Data.DB2;
//using IBM.Data.DB2Types;

//using BIACore.Extensions;
//using BIACore.Log;
//using BIACore.Model;

//namespace BIACore.Provider
//{
//    /// <summary>
//    /// Provider for interop'ing with DB2.
//    /// Tracks performance of queries, logs exceptions, etc...
//    /// </summary>
//    public static class DB2
//    {
//        #region List
//        /// <summary>
//        /// Performs an DB2 Execute for the given connection, stored procedure, args list.
//        /// Automatically casts the result from a datatable into a list of fully typed objects.
//        /// </summary>
//        /// <typeparam name="T">The Type parameter to return</typeparam>
//        /// <param name="connection">The Connection string to use</param>
//        /// <param name="sp">The stored procedure to execute</param>
//        /// <param name="args">Any arguments to pass to the stored procedure</param>
//        /// <returns>List&lt;T&gt; the list of type objects or an empty list.</returns>
//        public static List<T> Execute<T>(string connection, string sp, params DBParameter[] args) where T : new()
//        {
//            DataTable table = DB2.Execute(connection, sp, args);
//            return (table != null) ? table.ToList<T>() : new List<T>();
//        }

//        /// <summary>
//        /// Perform an DB2 Execute for a given connection and raw sql text.
//        /// Automatically casts the result from a datatable into a list of fully typed objects.
//        /// </summary>
//        /// <typeparam name="T">The Type parameter to return</typeparam>
//        /// <param name="connection">The Connection string to use</param>
//        /// <param name="text">The sql text to execute</param>
//        /// <returns>List&lt;T&gt; the list of type objects or an empty list.</returns>
//        [Obsolete("You should be using stored procedures, not sql-text")]
//        public static List<T> Execute<T>(string connection, string text) where T : new()
//        {
//            DataTable table = DB2.Execute(connection, text);
//            return (table != null) ? table.ToList<T>() : new List<T>();
//        }

//        public static List<string> ExecuteToString(string connection, string sp, params DBParameter[] args)
//        {
//            DataTable table = DB2.Execute(connection, sp, args);

//            List<string> result = new List<string>();
//            if (table == null || table.Rows.Count < 1 || table.Columns.Count < 1) return result;

//            foreach (System.Data.DataRow row in table.Rows)
//            {
//                result.Add(row[0].ToString());
//            }
//            return result;
//        }
//        #endregion

//        #region DataTable
//        public static DataTable Execute(string connection, string sp, params DBParameter[] args)
//        {
//            DataTable result = null;
//            DateTime start = DateTime.UtcNow;
//            try
//            {
//                LogFactory.DB2(sp, args);
//                using (DB2Connection con = new DB2Connection(connection))
//                {
//                    using (DB2Command cmd = new DB2Command(sp, con))
//                    {
//                        cmd.CommandTimeout = Settings.DB2.Timeout;
//                        cmd.CommandType = CommandType.StoredProcedure;
//                        if (null != args)
//                            foreach (DBParameter arg in args)
//                                cmd.Parameters.Add(arg.ToSQLParameter());

//                        con.Open();
//                        using (DB2DataAdapter adapter = new DB2DataAdapter(cmd))
//                        {
//                            result = new DataTable();
//                            adapter.Fill(result);
//                        }
//                    }
//                }
//            }
//            catch (Exception e)
//            {
//                LogFactory.ExceptionSQL(e, sp, args);
//                throw;
//            }
//            finally
//            {
//                LogFactory.Performance(sp, DateTime.UtcNow.Subtract(start).TotalSeconds);
//            }
//            return result;
//        }

//        [Obsolete("You should be using stored procedures, not sql-text")]
//        public static DataTable Execute(string connection, string text)
//        {
//            DataTable result = null;
//            DateTime start = DateTime.UtcNow;
//            try
//            {
//                LogFactory.DB2(text);
//                using (DB2Connection con = new DB2Connection(connection))
//                {
//                    using (DB2Command cmd = new DB2Command(text, con))
//                    {
//                        cmd.CommandTimeout = Settings.DB2.Timeout;
//                        cmd.CommandType = CommandType.Text;

//                        con.Open();
//                        using (DB2DataAdapter adapter = new DB2DataAdapter(cmd))
//                        {
//                            result = new DataTable();
//                            adapter.Fill(result);
//                        }
//                    }
//                }
//            }
//            catch (Exception e)
//            {
//                LogFactory.ExceptionSQL(e, text);
//                throw;
//            }
//            finally
//            {
//                LogFactory.Performance("DB2 Text", DateTime.UtcNow.Subtract(start).TotalSeconds);
//            }
//            return result;
//        }
//        #endregion

//        #region Non-Query
//        public static void ExecuteNonQuery(string connection, string sp, params DBParameter[] args)
//        {
//            DateTime start = DateTime.UtcNow;
//            try
//            {
//                LogFactory.DB2(sp, args);
//                using (DB2Connection con = new DB2Connection(connection))
//                {
//                    using (DB2Command cmd = new DB2Command(sp, con))
//                    {
//                        cmd.CommandTimeout = Settings.DB2.Timeout;
//                        cmd.CommandType = CommandType.StoredProcedure;
//                        if (null != args)
//                            foreach (DBParameter arg in args)
//                                cmd.Parameters.Add(arg.ToSQLParameter());

//                        con.Open();
//                        cmd.ExecuteNonQuery();
//                    }
//                }
//            }
//            catch (Exception e)
//            {
//                LogFactory.ExceptionSQL(e, sp, args);
//                throw;
//            }
//            finally
//            {
//                LogFactory.Performance(sp, DateTime.UtcNow.Subtract(start).TotalSeconds);
//            }
//        }

//        [Obsolete("You should be using stored procedures, not sql-text")]
//        public static void ExecuteNonQuery(string connection, string text)
//        {
//            DateTime start = DateTime.UtcNow;
//            try
//            {
//                LogFactory.DB2(text);
//                using (DB2Connection con = new DB2Connection(connection))
//                {
//                    using (DB2Command cmd = new DB2Command(text))
//                    {
//                        cmd.CommandTimeout = Settings.DB2.Timeout;
//                        cmd.CommandType = CommandType.Text;
//                        con.Open();
//                        cmd.ExecuteNonQuery();
//                    }
//                }
//            }
//            catch (Exception e)
//            {
//                LogFactory.Exception(e);
//                throw;
//            }
//            finally
//            {
//                LogFactory.Performance("DB2 Text", DateTime.UtcNow.Subtract(start).TotalSeconds);
//            }

//        }
//        #endregion

//        #region Helper functions
//        public static DataRow GetTotalRow(DataTable dt)
//        {
//            if (dt == null) return null;

//            DataRow _result = null;
//            DataRow total = null;

//            if (dt.Rows.Count == 0)
//            {
//                total = dt.NewRow();
//                dt.Rows.Add(total);
//            }
//            else
//            {
//                total = dt.Rows[dt.Rows.Count - 1];
//            }

//            _result = total.CloneRow();
//            total.Delete();
//            dt.AcceptChanges();

//            return _result;
//        }
//        #endregion
//    }
//}