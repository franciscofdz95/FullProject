using BIACore.Extensions;
using BIACore.Log;
using BIACore.Model;
using BIACore.Provider;
using BIACore.Web.Model;
using BIACore.Web.Model.ExtJS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;

namespace BIACore.Web.Controller
{
    /// <summary>
    /// Extends the WebAPI API controller class.
    /// I found I was writing the same stuff over and over again for all my controllers, 
    /// so this is a collection of all the functionality I've needed.
    /// Logging is included automatically, as well as first-chance exception catch and log.
    /// This way the exception is logged at the point closest to the database if (and when)
    /// it occurs.
    /// </summary>
    public abstract class BaseController : ApiController
    {
        public enum DBType
        {
            SQL=1,
            Oracle=2,
            DB2=3
        }
        /// <summary>
        /// The connection string for use with the SQL calls below.
        /// </summary>
        public abstract string Connection { get; }

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
            return LoadClientResult(sp, DBType.SQL, args);
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
        public virtual ClientResult LoadClientResult(string sp, DBType dbType = DBType.SQL, params DBParameter[] args)
        {
            return LoadClientNullableResult(sp, dbType, false, args);
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
            return LoadClientNullableResult(sp, DBType.SQL, args);
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
        public virtual ClientResult LoadClientNullableResult(string sp, DBType dbType = DBType.SQL, params DBParameter[] args)
        {
            return LoadClientNullableResult(sp, dbType, true, args);
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
        public virtual ClientResult LoadClientNullableResult(string sp, DBType dbType = DBType.SQL, bool AllowNulls = false, params DBParameter[] args)
        {
            LogFactory.Debug(GetStackTrace());
            DateTime start = DateTime.UtcNow;
            DateTime? final = null;
            try
            {
                DataTable result = dbType == DBType.Oracle ? BIACore.Provider.Oracle.Execute(Connection, sp, args) : SQL.Execute(Connection, sp, args);
                final = DateTime.UtcNow;
                Sanitize(result, dbType);

                List<object> data = (result == null) ? new List<object>() : result.ToList<object>(true);

                LogFactory.Message("{0}: Returning {1} rows. {2}ms",
                    Environment.MachineName,
                    data.Count,
                    ((DateTime)final).Subtract(start).TotalMilliseconds.ToString());

                return new StoreResult<object>()
                {
                    MetaData = (result == null) ? null : new MetaData(result, AllowNulls),
                    Data = data,
                    Total = data.Count,
                    Debug = Settings.Config.Debug ? new DebugData(GetDBCallAsString(sp, args), start, DateTime.UtcNow, ((DateTime)final).Subtract(start).TotalMilliseconds) : null
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
            return LoadPagedClientResult(sp, DBType.SQL, args);
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
        /// <param name="dbType">type of DB to connect to</param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual ClientResult LoadPagedClientResult(string sp, DBType dbType = DBType.SQL, params DBParameter[] args)
        {
            LogFactory.Debug(GetStackTrace());
            DateTime start = DateTime.UtcNow;
            DateTime? final = null;

            string TotalRowNumber = dbType == DBType.Oracle ? Settings.Oracle.RowNumber : Settings.Sql.RowNumber;
            try
            {                
                DataTable result = dbType == DBType.Oracle ? BIACore.Provider.Oracle.Execute(Connection, sp, args) : SQL.Execute(Connection, sp, args);
                final = DateTime.UtcNow;
                Sanitize(result, dbType);
                DataRow totalRow = dbType == DBType.Oracle ? BIACore.Provider.Oracle.GetTotalRow(result) : SQL.GetTotalRow(result);
                LogFactory.Message("{0}: Returning {1} out of {2} rows. {3}ms",
                    Environment.MachineName,
                    (result == null) ? 0 : result.Rows.Count,
                    (totalRow.IsNull(TotalRowNumber)) ? 0 : totalRow[TotalRowNumber],
                    ((DateTime)final).Subtract(start).TotalMilliseconds.ToString());

                return new StoreResult<object>()
                {
                    MetaData = (result == null) ? null : new MetaData(result),
                    Data = (result == null) ? new List<object>() : result.ToList<object>(),
                    DataTotal = (result == null) ? new List<object>() : new List<object>() { totalRow.ToType<object>() },
                    Total = (totalRow.IsNull(TotalRowNumber)) ? 0 : Convert.ToInt32(totalRow[TotalRowNumber]),
                    Debug = Settings.Config.Debug ? new DebugData(GetDBCallAsString(sp, args), start, DateTime.UtcNow, ((DateTime)final).Subtract(start).TotalMilliseconds) : null
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
            return LoadResult(sp, DBType.SQL, args);
        }

        /// <summary>
        /// Execute a stored procedure with the given arguments.
        /// Returns a list of dynamically created classes with properties for each column in
        /// the result set.
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="dbType">type of DB to connect to</param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual List<object> LoadResult(string sp, DBType dbType = DBType.SQL, params DBParameter[] args)
        {
            return LoadResult<object>(sp, dbType, args);
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
            return LoadResult<T>(sp, DBType.SQL, args);
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
        /// <param name="dbType">type of DB to connect to</param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual List<T> LoadResult<T>(string sp, DBType dbType = DBType.SQL, params DBParameter[] args) where T : new()
        {
            LogFactory.Debug(GetStackTrace());
            try
            {
                DateTime start = DateTime.UtcNow;
                DataTable result = dbType == DBType.Oracle ? BIACore.Provider.Oracle.Execute(Connection, sp, args) : SQL.Execute(Connection, sp, args);
                DateTime final = DateTime.UtcNow;
                Sanitize(result, dbType);
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
            return LoadSingle(sp, DBType.SQL, args);
        }

        /// <summary>
        /// Load a single item from the given stored procedure.
        /// If the result set is actually an array, then only the first item is returned.
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="dbType">type of DB to connect to</param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual object LoadSingle(string sp, DBType dbType = DBType.SQL, params DBParameter[] args)
        {
            return LoadSingle<object>(sp, dbType, args);
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
            return LoadSingle<T>(sp, DBType.SQL, args);
        }

        /// <summary>
        /// Load a single item from the given stored procedure.
        /// If the result set is actually an array, then only the first item is returned.
        /// Result class will extend T, and so T MUST be public.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sp"></param>
        /// <param name="dbType">type of DB to connect to</param>
        /// <param name="args"></param>
        /// <returns></returns>
        public virtual T LoadSingle<T>(string sp, DBType dbType = DBType.SQL, params DBParameter[] args) where T : new()
        {
            LogFactory.Debug(GetStackTrace());
            try
            {
                DateTime start = DateTime.UtcNow;
                DataTable result = dbType == DBType.Oracle ? BIACore.Provider.Oracle.Execute(Connection, sp, args) : SQL.Execute(Connection, sp, args);
                DateTime final = DateTime.UtcNow;
                Sanitize(result, dbType);
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
        public virtual void Execute(string sp, params DBParameter[] args)
        {
            Execute(sp, DBType.SQL, args);
        }

        /// <summary>
        /// Execute the given stored procedure; no result is expected.
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="dbType">type of DB to connect to</param>
        /// <param name="args"></param>
        public virtual void Execute(string sp, DBType dbType = DBType.SQL, params DBParameter[] args)
        {
            LogFactory.Debug(GetStackTrace());
            try
            {
                DateTime start = DateTime.UtcNow;
                if (dbType == DBType.Oracle) BIACore.Provider.Oracle.ExecuteNonQuery(Connection, sp, args);
                else SQL.ExecuteNonQuery(Connection, sp, args);
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
            return HttpUtility.HtmlEncode(string.Format("{0}{1}{2}", sp, " ", (null != args) ? string.Join(" " + ",", args) : string.Empty));
        }

        private static string GetStackTrace()
        {
            int upMethods = 2;
            MethodBase caller = new StackTrace().GetFrame(upMethods).GetMethod();
            while (caller != null && caller.DeclaringType != null && caller.DeclaringType.ToString() == "BIACore.WebAPI.Controller.BaseController")
            {
                upMethods++;
                caller = new StackTrace().GetFrame(upMethods).GetMethod();
            }
            return (caller == null || caller.DeclaringType == null) ? string.Empty :
                 string.Format("{0}:{1}", caller.DeclaringType.ToString(), caller.Name);
        }

        public virtual bool TestConnection(string sp, DBType dbType, params DBParameter[] args)
        {
            try
            {
                bool result = dbType == DBType.Oracle ? BIACore.Provider.Oracle.ExecuteTestConnection(Connection, sp, args) : SQL.ExecuteTestConnection(Connection, sp, args);

                return result;
            }
            catch (Exception e)
            {               
                throw;
            }
        }

    }
}
