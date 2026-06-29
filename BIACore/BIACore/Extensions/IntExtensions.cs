namespace BIACore.Extensions
{
    public static class IntExtensions
    {
        public static bool IsEven( this int iValue )
        {
            return ( ( iValue & 1 ) != 0 );
        }

        public static bool IsOdd( this int iValue )
        {
            return ( ( iValue & 1 ) == 0 );
        }
    }
}
