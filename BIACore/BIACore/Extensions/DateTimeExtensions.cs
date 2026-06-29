using System;
using System.Globalization;

namespace BIACore.Extensions
{
    public static class DateTimeExtensions
    {

        public static string ToFileNameReady( this DateTime DT )
        {
            return DT.ToString( "yyyMMdd_HHmmss" );
        }

        /// <summary>
        /// Date must be between 1800 & 9999
        /// </summary>
        public static bool ValidSQLDateTime( this DateTime DT )
        {
            if ( DT < new DateTime( 1900, 1, 1, 12, 0, 0 ) )
                return false;
            if ( DT > new DateTime( 2200, 12, 31, 11, 59, 59 ) )
                return false;
            return true;
        }

        /// <summary>
        /// Date must be between 1800 & 9999
        /// </summary>
        public static DateTime SQLDateTime( this DateTime DT )
        {
            if ( DT < new DateTime( 1900, 1, 1, 12, 0, 0 ) )
                DT = new DateTime( 1900, 1, 1, 12, 0, 0 );
            if ( DT > new DateTime( 2200, 12, 31, 11, 59, 59 ) )
                DT = new DateTime( 2200, 12, 31, 11, 59, 59 );
            return DT;
        }

        /// <summary>
        /// Date must be between 1800 & 9999
        /// </summary>
        public static DateTime SQLDate( this DateTime DT )
        {
            if ( DT < new DateTime( 1900, 1, 1, 12, 0, 0 ) )
                DT = new DateTime( 1900, 1, 1, 12, 0, 0 );
            if ( DT > new DateTime( 2200, 12, 31, 11, 59, 59 ) )
                DT = new DateTime( 2200, 12, 31, 11, 59, 59 );
            return DT.Date;
        }

        public static string MonthName( this DateTime DT )
        {
            int iMonth = DT.Month;
            DateTimeFormatInfo gmn = new DateTimeFormatInfo();
            return gmn.GetMonthName( iMonth );
        }

        public static string ToShortDateTimeString( this DateTime DT )
        {
            return String.Format( "{0} {1}", DT.ToShortDateString(), DT.ToShortTimeString() );
        }

        public static string ToLongDateTimeString( this DateTime DT )
        {
            return String.Format( "{0} {1}", DT.ToLongDateString(), DT.ToLongTimeString() );
        }

        public static DateTime SetLastDayOfMonth( this DateTime DT )
        {
            return DT.SetDay( DT.DaysInMonth() );
        }

        public static int DaysInMonth( this DateTime DT )
        {
            return DateTime.DaysInMonth( DT.Year, DT.Month );
        }

        public static DateTime SetHour( this DateTime DT, int iHour )
        {
            if ( ( iHour < 0 ) || ( iHour > 23 ) )
                return DT;
            DT = DT.AddHours( iHour - DT.Hour );
            return DT;
        }

        public static DateTime SetMinute( this DateTime DT, int iMinute )
        {
            if ( ( iMinute < 0 ) || ( iMinute > 23 ) )
                return DT;
            DT = DT.AddMinutes( iMinute - DT.Minute );
            return DT;
        }

        public static DateTime SetSecond( this DateTime DT, int iSecond )
        {
            if ( ( iSecond < 0 ) || ( iSecond > 59 ) )
                return DT;
            DT = DT.AddSeconds( iSecond - DT.Second );
            return DT;
        }

        public static DateTime SetDay( this DateTime DT, int iDay )
        {
            if ( iDay < 0 )
                return DT;
            if ( iDay > DT.DaysInMonth() )
                iDay = DT.DaysInMonth();
            DT = DT.AddDays( iDay - DT.Day );
            return DT;
        }

        public static DateTime SetMonth( this DateTime DT, int iMonth )
        {
            if ( ( iMonth < 1 ) || ( iMonth > 12 ) )
                return DT;
            DT = DT.AddMonths( iMonth - DT.Month );
            return DT;
        }

        public static DateTime SetYear( this DateTime DT, int iYear )
        {
            DT = DT.AddYears( iYear - DT.Year );
            return DT;
        }

        public static DateTime ShiftBackwardOffWeekend( this DateTime DT )
        {
            if ( ( DT.DayOfWeek == DayOfWeek.Saturday ) || ( DT.DayOfWeek == DayOfWeek.Sunday ) )
            {
                while ( DT.DayOfWeek != DayOfWeek.Friday )
                    DT = DT.AddDays( -1 );
            }
            return DT;
        }

        /// <summary>
        /// Calculates the age based on today.
        /// </summary>
        /// <param name="dateOfBirth">The date of birth.</param>
        /// <returns>The calculated age.</returns>
        public static int CalculateAge( this DateTime dateOfBirth )
        {
            return CalculateAge( dateOfBirth, DateTime.Today );
        }

        /// <summary>
        /// Calculates the age based on a passed reference date.
        /// </summary>
        /// <param name="dateOfBirth">The date of birth.</param>
        /// <param name="referenceDate">The reference date to calculate on.</param>
        /// <returns>The calculated age.</returns>
        public static int CalculateAge( this DateTime dateOfBirth, DateTime referenceDate )
        {
            int years = referenceDate.Year - dateOfBirth.Year;
            if ( referenceDate.Month < dateOfBirth.Month || ( referenceDate.Month == dateOfBirth.Month && referenceDate.Day < dateOfBirth.Day ) ) --years;
            return years;
        }

        /// <summary>
        /// Returns the number of days in the month of the provided date.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <returns>The number of days.</returns>
        public static int GetCountDaysOfMonth( this DateTime date )
        {
            var nextMonth = date.AddMonths( 1 );
            return new DateTime( nextMonth.Year, nextMonth.Month, 1 ).AddDays( -1 ).Day;
        }

        /// <summary>
        /// Returns the first day of the month of the provided date.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <returns>The first day of the month</returns>
        public static DateTime GetFirstDayOfMonth( this DateTime date )
        {
            return new DateTime( date.Year, date.Month, 1 );
        }

        /// <summary>
        /// Returns the first day of the month of the provided date.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <param name="dayOfWeek">The desired day of week.</param>
        /// <returns>The first day of the month</returns>
        public static DateTime GetFirstDayOfMonth( this DateTime date, DayOfWeek dayOfWeek )
        {
            var dt = date.GetFirstDayOfMonth();
            while ( dt.DayOfWeek != dayOfWeek )
            {
                dt = dt.AddDays( 1 );
            }
            return dt;
        }

        /// <summary>
        /// Returns the last day of the month of the provided date.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <returns>The last day of the month.</returns>
        public static DateTime GetLastDayOfMonth( this DateTime date )
        {
            return new DateTime( date.Year, date.Month, GetCountDaysOfMonth( date ) );
        }

        /// <summary>
        /// Returns the last day of the month of the provided date.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <param name="dayOfWeek">The desired day of week.</param>
        /// <returns>The date time</returns>
        public static DateTime GetLastDayOfMonth( this DateTime date, DayOfWeek dayOfWeek )
        {
            var dt = date.GetLastDayOfMonth();
            while ( dt.DayOfWeek != dayOfWeek )
            {
                dt = dt.AddDays( -1 );
            }
            return dt;
        }

        /// <summary>
        /// Indicates whether the date is today.
        /// </summary>
        /// <param name="dt">The date.</param>
        /// <returns>
        /// 	<c>true</c> if the specified date is today; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsToday( this DateTime dt )
        {
            return ( dt.Date == DateTime.Today );
        }

        /// <summary>
        /// Sets the time on the specified DateTime value.
        /// </summary>
        /// <param name="date">The base date.</param>
        /// <param name="hours">The hours to be set.</param>
        /// <param name="minutes">The minutes to be set.</param>
        /// <param name="seconds">The seconds to be set.</param>
        /// <returns>The DateTime including the new time value</returns>
        public static DateTime SetTime( this DateTime date, int hours, int minutes, int seconds )
        {
            return date.SetTime( new TimeSpan( hours, minutes, seconds ) );
        }

        /// <summary>
        /// Sets the time on the specified DateTime value.
        /// </summary>
        /// <param name="date">The base date.</param>
        /// <param name="time">The TimeSpan to be applied.</param>
        /// <returns>
        /// The DateTime including the new time value
        /// </returns>
        public static DateTime SetTime( this DateTime date, TimeSpan time )
        {
            return date.Date.Add( time );
        }

        /// <summary>
        /// Converts a DateTime into a DateTimeOffset using the local system time zone.
        /// </summary>
        /// <param name="localDateTime">The local DateTime.</param>
        /// <returns>The converted DateTimeOffset</returns>
        public static DateTimeOffset ToDateTimeOffset( this DateTime localDateTime )
        {
            return localDateTime.ToDateTimeOffset( null );
        }

        /// <summary>
        /// Converts a DateTime into a DateTimeOffset using the specified time zone.
        /// </summary>
        /// <param name="localDateTime">The local DateTime.</param>
        /// <param name="localTimeZone">The local time zone.</param>
        /// <returns>The converted DateTimeOffset</returns>
        public static DateTimeOffset ToDateTimeOffset( this DateTime localDateTime, TimeZoneInfo localTimeZone )
        {
            localTimeZone = ( localTimeZone ?? TimeZoneInfo.Local );

            if ( localDateTime.Kind != DateTimeKind.Unspecified )
            {
                localDateTime = new DateTime( localDateTime.Ticks, DateTimeKind.Unspecified );
            }

            return TimeZoneInfo.ConvertTimeToUtc( localDateTime, localTimeZone );
        }

        /// <summary>
        /// Gets the first day of the week using the current culture.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <returns>The first day of the week</returns>
        public static DateTime GetFirstDayOfWeek( this DateTime date )
        {
            return date.GetFirstDayOfWeek( null );
        }

        /// <summary>
        /// Gets the first day of the week using the specified culture.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <param name="cultureInfo">The culture to determine the first weekday of a week.</param>
        /// <returns>The first day of the week</returns>
        public static DateTime GetFirstDayOfWeek( this DateTime date, CultureInfo cultureInfo )
        {
            cultureInfo = ( cultureInfo ?? CultureInfo.CurrentCulture );

            var firstDayOfWeek = cultureInfo.DateTimeFormat.FirstDayOfWeek;
            while ( date.DayOfWeek != firstDayOfWeek ) date = date.AddDays( -1 );

            return date;
        }

        /// <summary>
        /// Gets the last day of the week using the current culture.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <returns>The first day of the week</returns>
        public static DateTime GetLastDayOfWeek( this DateTime date )
        {
            return date.GetLastDayOfWeek( null );
        }

        /// <summary>
        /// Gets the last day of the week using the specified culture.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <param name="cultureInfo">The culture to determine the first weekday of a week.</param>
        /// <returns>The first day of the week</returns>
        public static DateTime GetLastDayOfWeek( this DateTime date, CultureInfo cultureInfo )
        {
            return date.GetFirstDayOfWeek( cultureInfo ).AddDays( 6 );
        }

        /// <summary>
        /// Gets the next occurence of the specified weekday within the current week using the current culture.
        /// </summary>
        /// <param name="date">The base date.</param>
        /// <param name="weekday">The desired weekday.</param>
        /// <returns>The calculated date.</returns>
        /// <example><code>
        /// var thisWeeksMonday = DateTime.Now.GetWeekday(DayOfWeek.Monday);
        /// </code></example>
        public static DateTime GetWeeksWeekday( this DateTime date, DayOfWeek weekday )
        {
            return date.GetWeeksWeekday( weekday, null );
        }

        /// <summary>
        /// Gets the next occurence of the specified weekday within the current week using the specified culture.
        /// </summary>
        /// <param name="date">The base date.</param>
        /// <param name="weekday">The desired weekday.</param>
        /// <param name="cultureInfo">The culture to determine the first weekday of a week.</param>
        /// <returns>The calculated date.</returns>
        /// <example><code>
        /// var thisWeeksMonday = DateTime.Now.GetWeekday(DayOfWeek.Monday);
        /// </code></example>
        public static DateTime GetWeeksWeekday( this DateTime date, DayOfWeek weekday, CultureInfo cultureInfo )
        {
            var firstDayOfWeek = date.GetFirstDayOfWeek( cultureInfo );
            return firstDayOfWeek.GetNextWeekday( weekday );
        }

        /// <summary>
        /// Gets the next occurence of the specified weekday.
        /// </summary>
        /// <param name="date">The base date.</param>
        /// <param name="weekday">The desired weekday.</param>
        /// <returns>The calculated date.</returns>
        /// <example><code>
        /// var lastMonday = DateTime.Now.GetNextWeekday(DayOfWeek.Monday);
        /// </code></example>
        public static DateTime GetNextWeekday( this DateTime date, DayOfWeek weekday )
        {
            while ( date.DayOfWeek != weekday ) date = date.AddDays( 1 );
            return date;
        }

        /// <summary>
        /// Gets the previous occurence of the specified weekday.
        /// </summary>
        /// <param name="date">The base date.</param>
        /// <param name="weekday">The desired weekday.</param>
        /// <returns>The calculated date.</returns>
        /// <example><code>
        /// var lastMonday = DateTime.Now.GetPreviousWeekday(DayOfWeek.Monday);
        /// </code></example>
        public static DateTime GetPreviousWeekday( this DateTime date, DayOfWeek weekday )
        {
            while ( date.DayOfWeek != weekday ) date = date.AddDays( -1 );
            return date;
        }

        public static DateTime Min( this DateTime date, DateTime dCompare )
        {
            if ( date < dCompare )
                return date;
            else
                return dCompare;
        }

        public static DateTime Max( this DateTime date, DateTime dCompare )
        {
            if ( date > dCompare )
                return date;
            else
                return dCompare;
        }
    }
}
