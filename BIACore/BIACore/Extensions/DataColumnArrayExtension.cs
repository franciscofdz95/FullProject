using System.Data;

namespace BIACore.Extensions
{
    public static class DataColumnArrayExtension
    {
        public static bool Contains( this DataColumn[] DCList, string ColumnName )
        {
            foreach ( DataColumn DC in DCList )
                if ( DC.ColumnName.ToUpper() == ColumnName.ToUpper() )
                    return true;

            return false;
        }
    }
}
