using System;

namespace BIACore.Extensions
{
    public static class GUIDExtensions
    {
        public static Guid NewComb( this Guid gGuid )
        {
            byte[] dateBytes = BitConverter.GetBytes( DateTime.Now.Ticks );
            byte[] guidBytes = gGuid.ToByteArray();
            // copy the last six bytes from the date to the last six bytes of the GUID5.    
            Array.Copy( dateBytes, dateBytes.Length - 7, guidBytes, guidBytes.Length - 7, 6 );
            return new Guid( guidBytes );
        }

        public static object DBNullIfEmpty( this Guid gGuid )
        {
            if ( gGuid == Guid.Empty )
                return DBNull.Value;
            else
                return gGuid;
        }

        public static object NullIfEmpty( this Guid gGuid )
        {
            if ( gGuid == Guid.Empty )
                return null;
            else
                return gGuid;
        }
    }
}
