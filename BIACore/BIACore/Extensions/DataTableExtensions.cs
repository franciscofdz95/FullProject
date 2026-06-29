using System;
using System.Collections.Generic;
using System.Data;

namespace BIACore.Extensions
{
    public static class DataTableExtensions
    {
        public static DataTable SelectDistinct( this DataTable DT, string FieldName )
        {
            DataTable dt = new DataTable( "dt" + FieldName );
            dt.Columns.Add( FieldName, DT.Columns[ FieldName ].DataType );

            object LastValue = null;
            foreach ( DataRow dr in DT.Select( "", FieldName ) )
            {
                if ( LastValue == null || !( dr.ColumnValuesEqual( LastValue, dr[ FieldName ] ) ) )
                {
                    LastValue = dr[ FieldName ];
                    dt.Rows.Add( new object[] { LastValue } );
                }
            }

            return dt;
        }

        /// <summary>
        /// Locate a key value in a column name
        /// This is a table walk.  Only returns the first record found
        /// </summary>
        /// <param name="DT"></param>
        /// <param name="sColumnName"></param>
        /// <param name="oKeyValue"></param>
        /// <returns></returns>
        public static DataRow Locate( this DataTable DT, string sColumnName, object oKeyValue )
        {
            foreach ( DataRow drLocate in DT.Rows )
            {
                if ( drLocate[ sColumnName ].ToString() == oKeyValue.ToString() )
                    return drLocate;
            }
            return null;
        }

        /// <summary>
        /// Non Destructive remove of rows found by 'filter'
        /// </summary>
        /// <param name="DT"></param>
        /// <param name="sFilter"></param>
        /// <returns></returns>
        public static DataTable Remove( this DataTable DT, string sFilter )
        {
            DataTable dtResult = DT.Copy();
            DataRow[] aRows = dtResult.Select( sFilter );
            foreach ( DataRow dr in aRows )
                dtResult.Rows.Remove( dr );
            return dtResult;
        }

        public static string CommaList( this DataTable DT, string sFieldName )
        {
            string sResult = "";
            foreach ( DataRow dr in DT.Rows )
            {
                if ( sResult != "" )
                    sResult += ", ";
                sResult += dr.ToString( sFieldName );
            }
            return sResult;
        }

        public static DataTable Sort( this DataTable dt, string sSort )
        {
            DataView dv = dt.AsDataView();
            dv.Sort = sSort;
            return dv.ToTable();
        }

        public static object ToJSONObject( this DataTable dt )
        {
            List<Dictionary<string, object>> aReturn = new List<Dictionary<string, object>>();

            foreach ( DataRow dr in dt.Rows )
            {
                Dictionary<string, object> aRow = new Dictionary<string, object>();
                foreach ( DataColumn DC in dt.Columns )
                {
                    if ( DC.DataType == typeof( bool ) )
                    {
                        if ( dr[ DC ] != DBNull.Value )
                            aRow.Add( DC.ColumnName, ( (bool)dr[ DC ] ) ? 1 : 0 );
                        else
                            aRow.Add( DC.ColumnName, 0 );
                    }
                    else if ( DC.DataType == typeof( DateTime ) )
                    {
                        aRow.Add( DC.ColumnName, ( (DateTime)dr[ DC ] ).ToString( "g" ) );
                    }
                    else
                    {
                        if ( dr[ DC ] != DBNull.Value )
                            aRow.Add( DC.ColumnName, dr[ DC ] );
                        else
                            aRow.Add( DC.ColumnName, "" );
                    }
                }
                aReturn.Add( aRow );
            }

            return aReturn;
        }

        #region Copied over from old Core
        /// <summary>
        /// Iterates over the rows of this DataTable and produces an
        /// anonymous object with named-properties based on the column names and values.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="table"></param>
        /// <param name="allowNullable"></param>
        /// <returns></returns>
        public static List<T> ToList<T>(this DataTable table, bool allowNullable = false) where T : new()
        {
            List<T> result = new List<T>();
            if (table.Rows.Count == 0) return result;

            foreach (System.Data.DataRow row in table.Rows)
            {
                result.Add(row.ToType<T>(allowNullable));
            }
            
            return result;
        }
        #endregion
    }
}
