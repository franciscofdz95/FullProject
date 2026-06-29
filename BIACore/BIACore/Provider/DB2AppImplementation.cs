/*
 *******************************************************************************************************
 * Steps to implement DB2 Provider
 * 
 * 1. Create 'Provider' folder in WebAPI project
 * 2. Add new class 'DB2' to Provider folder
 * 3. Select all code in the DB2 class file and delete
 * 4. Select the code in this file from '//Provider.DB2 File Code Start' to '//Provider.DB2 File Code End' and paste into DB2 class file
 * 5. Create 'DB2Controller' class inside Controller folder of WebAPI Project
 * 6. Select all code in the DB2Controller class file and delete
 * 7. Select the code in this file fro '//DB2Controller File Code Start' to '//DB2Controller File Code Start' and paste into DB2Controller class file
 * 8. Do a replace all in the DB2Controller looking for 'YourAppCode' and replace with the solution name of your project
 * 9. Add a new Reference, browse to \\SVRP000346ec\dev_root\Reference\ThirdParty\IBM\netf40\IBM.Data.DB2.dll. ***MAKE SURE YOU SET THIS REFERENCE PROPERTY 'Copy Local' TO FALSE***
 * 10. Create your route files and extend them from the DB2Controller class
 * ******************************************************************************************************
//Provider.DB2 File Code Start
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;

using IBM.Data.DB2;
using IBM.Data.DB2Types;

using BIACore.Extensions;
using BIACore.Log;
using BIACore.Model;

namespace YourAppCode.Provider
{
    public static class DB2
    {
        #region List
        /// <summary>
        /// Performs an DB2 Execute for the given connection, stored procedure, args list.
        /// Automatically casts the result from a datatable into a list of fully typed objects.
        /// </summary>
        /// <typeparam name="T">The Type parameter to return</typeparam>
        /// <param name="connection">The Connection string to use</param>
        /// <param name="sp">The stored procedure to execute</param>
        /// <param name="args">Any arguments to pass to the stored procedure</param>
        /// <returns>List&lt;T&gt; the list of type objects or an empty list.</returns>
        public static List<T> Execute<T>(string connection, string sp, params DBParameter[] args) where T : new()
        {
            DataTable table = DB2.Execute(connection, sp, args);
            return (table != null) ? table.ToList<T>() : new List<T>();
        }

        /// <summary>
        /// Perform an DB2 Execute for a given connection and raw sql text.
        /// Automatically casts the result from a datatable into a list of fully typed objects.
        /// </summary>
        /// <typeparam name="T">The Type parameter to return</typeparam>
        /// <param name="connection">The Connection string to use</param>
        /// <param name="text">The sql text to execute</param>
        /// <returns>List&lt;T&gt; the list of type objects or an empty list.</returns>
        [Obsolete("You should be using stored procedures, not sql-text")]
        public static List<T> Execute<T>(string connection, string text) where T : new()
        {
            DataTable table = DB2.Execute(connection, text);
            return (table != null) ? table.ToList<T>() : new List<T>();
        }

        public static List<string> ExecuteToString(string connection, string sp, params DBParameter[] args)
        {
            DataTable table = DB2.Execute(connection, sp, args);

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
            DataTable result = null;
            DateTime start = DateTime.UtcNow;
            try
            {
                LogFactory.DB2(sp, args);
                using (DB2Connection con = new DB2Connection(connection))
                {
                    using (DB2Command cmd = new DB2Command(sp, con))
                    {
                        cmd.CommandTimeout = Settings.DB2.Timeout;
                        cmd.CommandType = CommandType.StoredProcedure;
                        if (null != args)
                            foreach (DBParameter arg in args)
                                cmd.Parameters.Add(arg.ToSQLParameter());

                        con.Open();
                        using (DB2DataAdapter adapter = new DB2DataAdapter(cmd))
                        {
                            result = new DataTable();
                            adapter.Fill(result);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                LogFactory.ExceptionSQL(e, sp, args);
                throw;
            }
            finally
            {
                LogFactory.Performance(sp, DateTime.UtcNow.Subtract(start).TotalSeconds);
            }
            return result;
        }

        [Obsolete("You should be using stored procedures, not sql-text")]
        public static DataTable Execute(string connection, string text)
        {
            DataTable result = null;
            DateTime start = DateTime.UtcNow;
            try
            {
                LogFactory.DB2(text);
                using (DB2Connection con = new DB2Connection(connection))
                {
                    using (DB2Command cmd = new DB2Command(text, con))
                    {
                        cmd.CommandTimeout = Settings.DB2.Timeout;
                        cmd.CommandType = CommandType.Text;

                        con.Open();
                        using (DB2DataAdapter adapter = new DB2DataAdapter(cmd))
                        {
                            result = new DataTable();
                            adapter.Fill(result);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                LogFactory.ExceptionSQL(e, text);
                throw;
            }
            finally
            {
                LogFactory.Performance("DB2 Text", DateTime.UtcNow.Subtract(start).TotalSeconds);
            }
            return result;
        }
        #endregion

        #region Non-Query
        public static void ExecuteNonQuery(string connection, string sp, params DBParameter[] args)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                LogFactory.DB2(sp, args);
                using (DB2Connection con = new DB2Connection(connection))
                {
                    using (DB2Command cmd = new DB2Command(sp, con))
                    {
                        cmd.CommandTimeout = Settings.DB2.Timeout;
                        cmd.CommandType = CommandType.StoredProcedure;
                        if (null != args)
                            foreach (DBParameter arg in args)
                                cmd.Parameters.Add(arg.ToSQLParameter());

                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                LogFactory.ExceptionSQL(e, sp, args);
                throw;
            }
            finally
            {
                LogFactory.Performance(sp, DateTime.UtcNow.Subtract(start).TotalSeconds);
            }
        }

        [Obsolete("You should be using stored procedures, not sql-text")]
        public static void ExecuteNonQuery(string connection, string text)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                LogFactory.DB2(text);
                using (DB2Connection con = new DB2Connection(connection))
                {
                    using (DB2Command cmd = new DB2Command(text))
                    {
                        cmd.CommandTimeout = Settings.DB2.Timeout;
                        cmd.CommandType = CommandType.Text;
                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
            finally
            {
                LogFactory.Performance("DB2 Text", DateTime.UtcNow.Subtract(start).TotalSeconds);
            }

        }
        #endregion

        #region Helper functions
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
    }
}
//Provider.DB2 File Code End


//DB2Controller File Code Start
//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Web.Http;
//
//using BIACore.Model;
//using BIACore.Web.Model;
//
//using YourAppCode.WebAPI;

namespace YourAppCode.WebAPI.Controller
{
    public partial class DB2Controller : BIACore.Web.Controller.BaseController
    {

        public override string Connection
        {
            get { return Connections.DB2DB; }
        }

        /// <summary>
        /// Execute a stored procedure with the given arguments.
        /// The result is not expected to be paged.
        /// MetaData (for ExtJS) is automatically generated from the result set.
        /// </summary>
        /// <param name="sp">Stored Procedure to be run</param>
        /// <param name="dbType">type of DB to connect to</param>
        /// <param name="args">Arguments to pass</param>
        /// <returns></returns>
        public virtual ClientResult LoadClientResult(string sp, params DBParameter[] args)
        {
            MethodBase caller = new StackTrace().GetFrame(1).GetMethod();
            LogFactory.Debug((caller == null || caller.DeclaringType == null) ? string.Empty :
                 string.Format("{0}:{1}", caller.DeclaringType.ToString(), caller.Name));
            DateTime rStart = DateTime.UtcNow;
            try
            {
                DateTime start = DateTime.UtcNow;
                DataTable result = YourAppCode.Provider.DB2.Execute(Connection, sp, args);
                DateTime final = DateTime.UtcNow;

                Sanitize(result);

                List<object> data = (result == null) ? new List<object>() : result.ToList<object>();

                LogFactory.Message("{0}: Returning {1} rows. {2}ms",
                    Environment.MachineName,
                    data.Count,
                    final.Subtract(start).TotalMilliseconds.ToString());

                return new StoreResult<object>()
                {
                    MetaData = (result == null) ? null : new MetaData(result),
                    Data = data,
                    Total = data.Count,
                    Debug = Settings.Config.Debug ? new DebugData(GetDBCallAsString(sp, args), rStart, DateTime.UtcNow, final.Subtract(start).TotalMilliseconds) : null
                };
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        /// <summary>
        /// Execute a stored procedure with the given arguments.
        /// The result is expected to be paged, so a TotalRow (The last row in the data set)
        /// is expected. This row will be filtered out of the Data array and added to it's own
        /// DataTotal array.
        /// Aside from paging and total row count, you can also add per-page or data total 
        /// values to this row.
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual ClientResult LoadPagedClientResult(string sp, params DBParameter[] args)
        {
            MethodBase caller = new StackTrace().GetFrame(1).GetMethod();
            LogFactory.Debug(caller.Name);
            DateTime rStart = DateTime.UtcNow;
            try
            {
                DateTime start = DateTime.UtcNow;
                DataTable result = YourAppCode.Provider.DB2.Execute(Connection, sp, args);
                DateTime final = DateTime.UtcNow;
                Sanitize(result);
                DataRow totalRow = YourAppCode.Provider.DB2.GetTotalRow(result);
                LogFactory.Message("{0}: Returning {1} out of {2} rows. {3}ms",
                    Environment.MachineName,
                    (result == null) ? 0 : result.Rows.Count,
                    (totalRow.IsNull(Settings.Sql.RowNumber)) ? 0 : totalRow[Settings.Sql.RowNumber],
                    final.Subtract(start).TotalMilliseconds.ToString());

                return new StoreResult<object>()
                {
                    MetaData = (result == null) ? null : new MetaData(result),
                    Data = (result == null) ? new List<object>() : result.ToList<object>(),
                    DataTotal = (result == null) ? new List<object>() : new List<object>() { totalRow.ToType<object>() },
                    Total = (totalRow.IsNull(Settings.Sql.RowNumber)) ? 0 : Convert.ToInt32(totalRow[Settings.Sql.RowNumber]),
                    Debug = Settings.Config.Debug ? new DebugData(GetDBCallAsString(sp, args), rStart, DateTime.UtcNow, final.Subtract(start).TotalMilliseconds) : null
                };
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                // force the save on an exception so a copy of it exists.
                // otherwise, follow the usual logging rules.
                throw;
            }
        }

        /// <summary>
        /// Execute a stored procedure with the given arguments.
        /// The result is not expected to be paged.
        /// MetaData (for ExtJS) is automatically generated from the result set.
        /// </summary>
        /// <param name="sp">Stored Procedure to be run</param>
        /// <param name="dbType">type of DB to connect to</param>
        /// <param name="args">Arguments to pass</param>
        /// <returns></returns>
        public virtual ClientResult LoadClientNullableResult(string sp, params DBParameter[] args)
        {
            MethodBase caller = new StackTrace().GetFrame(1).GetMethod();
            LogFactory.Debug((caller == null || caller.DeclaringType == null) ? string.Empty :
                 string.Format("{0}:{1}", caller.DeclaringType.ToString(), caller.Name));
            DateTime rStart = DateTime.UtcNow;
            try
            {
                DateTime start = DateTime.UtcNow;
                DataTable result = YourAppCode.Provider.DB2.Execute(Connection, sp, args);
                DateTime final = DateTime.UtcNow;

                Sanitize(result);

                List<object> data = (result == null) ? new List<object>() : result.ToList<object>(true);

                LogFactory.Message("{0}: Returning {1} rows. {2}ms",
                    Environment.MachineName,
                    data.Count,
                    final.Subtract(start).TotalMilliseconds.ToString());

                return new StoreResult<object>()
                {
                    MetaData = (result == null) ? null : new MetaData(result),
                    Data = data,
                    Total = data.Count,
                    Debug = Settings.Config.Debug ? new DebugData(GetDBCallAsString(sp, args), rStart, DateTime.UtcNow, final.Subtract(start).TotalMilliseconds) : null
                };
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        /// <summary>
        /// Execute a stored procedure with the given arguments.
        /// Returns a list of dynamically created classes with properties for each column in
        /// the result set.
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual List<object> LoadResult(string sp, params DBParameter[] args)
        {
            MethodBase caller = new StackTrace().GetFrame(1).GetMethod();
            LogFactory.Debug(caller.Name);
            try
            {
                DateTime start = DateTime.UtcNow;
                DataTable result = YourAppCode.Provider.DB2.Execute(Connection, sp, args);
                DateTime final = DateTime.UtcNow;
                Sanitize(result);
                LogFactory.Message("{0}: Returning {1}. {2}ms",
                    Environment.MachineName,
                    (result == null) ? 0 : result.Rows.Count,
                    final.Subtract(start).TotalMilliseconds.ToString());
                return (result == null) ? new List<object>() : result.ToList<object>();
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        /// <summary>
        /// Execute a stored procedure with the given arguments.
        /// Returns a list of dynamically created classes that extends the given type T (and so T
        /// MUST be a public type) with properties for each column in the result set.
        /// Items defined in T will be left alone; extra values will be stuck in the extension of T.
        /// So if you defined Thing{ int Item; }, this would return Thing1 : Thing { int id; }
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sp"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual List<T> LoadResult<T>(string sp, params DBParameter[] args) where T : new()
        {
            MethodBase caller = new StackTrace().GetFrame(1).GetMethod();
            LogFactory.Debug(caller.Name);
            try
            {
                DateTime start = DateTime.UtcNow;
                DataTable result = YourAppCode.Provider.DB2.Execute(Connection, sp, args);
                DateTime final = DateTime.UtcNow;
                Sanitize(result);
                LogFactory.Message("{0}: Returning {1} rows. {2}ms",
                    Environment.MachineName,
                    (result == null) ? 0 : result.Rows.Count,
                    final.Subtract(start).TotalMilliseconds.ToString());
                return (result == null) ? new List<T>() : result.ToList<T>();
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        /// <summary>
        /// Load a single item from the given stored procedure.
        /// If the result set is actually an array, then only the first item is returned.
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual object LoadSingle(string sp, params DBParameter[] args)
        {
            MethodBase caller = new StackTrace().GetFrame(1).GetMethod();
            LogFactory.Debug(caller.Name);
            try
            {
                DateTime start = DateTime.UtcNow;
                DataTable result = YourAppCode.Provider.DB2.Execute(Connection, sp, args);
                DateTime final = DateTime.UtcNow;
                Sanitize(result);
                LogFactory.Message("{0}: Returning {1} rows. {2}ms",
                    Environment.MachineName,
                    (result == null) ? 0 : result.Rows.Count,
                    final.Subtract(start).TotalMilliseconds.ToString());
                List<object> list = (result == null) ? new List<object>() : result.ToList<object>();

                return (list.Count == 1) ? list[0] : null;
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        /// <summary>
        /// Load a single item from the given stored procedure.
        /// If the result set is actually an array, then only the first item is returned.
        /// Result class will extend T, and so T MUST be public.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sp"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual T LoadSingle<T>(string sp, params DBParameter[] args) where T : new()
        {
            MethodBase caller = new StackTrace().GetFrame(1).GetMethod();
            LogFactory.Debug(caller.Name);
            try
            {
                DateTime start = DateTime.UtcNow;
                DataTable result = YourAppCode.Provider.DB2.Execute(Connection, sp, args);
                DateTime final = DateTime.UtcNow;
                Sanitize(result);
                LogFactory.Message("{0}: Returning {1} rows. {2}ms",
                    Environment.MachineName,
                    (result == null) ? 0 : 1,
                    final.Subtract(start).TotalMilliseconds.ToString());
                List<T> list = (result == null) ? new List<T>() : result.ToList<T>();
                return (list.Count == 1) ? list[0] : default(T);
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        /// <summary>
        /// Execute the given stored procedure; no result is expected.
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="args"></param>
        public virtual void DB2Execute(string text)
        {
            MethodBase caller = new StackTrace().GetFrame(1).GetMethod();
            LogFactory.Debug(caller.Name);
            try
            {
                DateTime start = DateTime.UtcNow;
                YourAppCode.Provider.DB2.ExecuteNonQuery(Connection, text);
                DateTime final = DateTime.UtcNow;
                LogFactory.Message("{0}: Execute Completed. {1}ms", Environment.MachineName, final.Subtract(start).TotalMilliseconds.ToString());
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        /// <summary>
        /// Execute the given stored procedure; no result is expected.
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="args"></param>
        public virtual void DB2Execute(string sp, params DBParameter[] args)
        {
            MethodBase caller = new StackTrace().GetFrame(1).GetMethod();
            LogFactory.Debug(caller.Name);
            try
            {
                DateTime start = DateTime.UtcNow;
                YourAppCode.Provider.DB2.ExecuteNonQuery(Connection, sp, args);
                DateTime final = DateTime.UtcNow;
                LogFactory.Message("{0}: Execute Completed. {1}ms", Environment.MachineName, final.Subtract(start).TotalMilliseconds.ToString());
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        /// <summary>
        /// Clean the resulting table of any columns the user is not allowed to see.
        /// </summary>
        /// <param name="data"></param>
        public virtual void Sanitize(DataTable data, DBType dbType = DBType.SQL)
        {
        }

        private static string GetDBCallAsString(string sp, params object[] args)
        {
            return string.Format("{0}{1}{2}", sp, " ", (null != args) ? string.Join(" " + ",", args) : string.Empty);
        }
    }
}
//DB2Controller File Code Start
*/