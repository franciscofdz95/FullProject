using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;

namespace BIACore.Extensions
{
    public static class StringExtensions
    {
        public static DataSet CreateDatasetFromXML( this string sXML )
        {
            System.Text.ASCIIEncoding encoding = new System.Text.ASCIIEncoding();
            using ( MemoryStream MS = new MemoryStream( sXML.Length ) )
            {
                byte[] B = encoding.GetBytes( sXML );
                MS.Write( B, 0, B.Length );
                MS.Position = 0;
                DataSet ds = new DataSet();
                ds.ReadXml( MS, XmlReadMode.ReadSchema );
                return ds;
            }
        }

        public static string[] Split( this string s, char sDelimiter )
        {
            char[] aDelimiter = { sDelimiter };
            return s.Split( aDelimiter );
        }

        public static string AddCommaText( this string s, string sValue )
        {
            if ( !s.IsNullOrEmpty() )
                s += ", ";
            s += sValue;

            return s;
        }

        public static string AddLine( this string s, string sValue )
        {
            if ( !s.IsNullOrEmpty() )
                s += Environment.NewLine;
            s += sValue;

            return s;
        }

        public static bool IsNullOrEmpty( this string s )
        {
            return ( s == null || s.Trim().Length == 0 );
        }

        public static string ToStringNull( this string s )
        {
            if ( s == null )
                return "";
            else
                return s.ToString();
        }


        public static string RemoveLeading( this string s, char sRemove )
        {
            while ( ( !s.IsNullOrEmpty() ) && ( s[ 0 ] == sRemove ) )
                s = s.Substring( 1 );
            return s;
        }

        public static string Left( this string s, int iLeft )
        {
            if ( s.Length > iLeft )
                return s.Substring( 0, iLeft );
            else
                return s;
        }

        public static string Right( this string s, int iLeft )
        {
            if ( iLeft < s.Length )
                return s.Substring( s.Length - iLeft );
            else
                return s;
        }

        public static List<Guid> ToGuidList( this string s )
        {
            List<Guid> aGuid = new List<Guid>();
            char[] aSplitList = { ',' };
            string[] aGuidStrings = s.Split( aSplitList, StringSplitOptions.RemoveEmptyEntries );
            foreach ( string s2 in aGuidStrings )
                aGuid.Add( new Guid( s2 ) );
            return aGuid;
        }

        /*
        public static List<string> ToList( this string s )
        {
            List<string> aString = new List<string>();
            char[] aSplitList = { ',' };
            string[] aGuidStrings = s.Split( aSplitList, StringSplitOptions.RemoveEmptyEntries );
            foreach ( string s2 in aGuidStrings )
                aString.Add( s2 );
            return aString;
        }
        */

        /// <summary>
        /// Checks if url is valid. 
        /// from http://www.osix.net/modules/article/?id=586
        /// and changed to match http://localhost
        /// 
        /// complete (not only http) url regex can be found 
        /// at http://internet.ls-la.net/folklore/url-regexpr.html
        /// </summary>
        /// <param name="text"></param>

        /// <returns></returns>

        public static bool IsValidUrl( this string url )
        {
            string strRegex = "^(https?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //user@
        + @"(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP- 199.194.52.184
        + "|" // allows either IP or domain
        + @"([0-9a-z_!~*'()-]+\.)*" // tertiary domain(s)- www.
        + @"([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]" // second level domain
        + @"(\.[a-z]{2,6})?)" // first level domain- .com or .museum is optional
        + "(:[0-9]{1,5})?" // port number- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            return Regex.IsMatch( url, strRegex );
        }

        /// <summary>

        /// Reduce string to shorter preview which is optionally ended by some string (...).
        /// </summary>
        /// <param name="s">string to reduce</param>
        /// <param name="count">Length of returned string including endings.</param>
        /// <param name="endings">optional edings of reduced text</param>

        /// <example>
        /// string description = "This is very long description of something";
        /// string preview = description.Reduce(20,"...");
        /// produce -> "This is very long..."
        /// </example>
        /// <returns></returns>

        public static string Reduce( this string s, int count, string endings )
        {
            if ( count < endings.Length )
                throw new Exception( "Failed to reduce to less then endings length." );
            int sLength = s.Length;
            int len = sLength;
            if ( endings != null )
                len += endings.Length;
            if ( count > sLength )
                return s; //it's too short to reduce
            s = s.Substring( 0, sLength - len + count );
            if ( endings != null )
                s += endings;
            return s;
        }

        /// <summary>
        /// remove white space, not line end
        /// Useful when parsing user input such phone,
        /// price int.Parse("1 000 000".RemoveSpaces(),.....
        /// </summary>
        /// <param name="s"></param>

        /// <param name="value">string without spaces</param>
        public static string RemoveSpaces( this string s )
        {
            return s.Replace( " ", "" );
        }


        /// <summary>
        /// true, if the string can be parse as Double respective Int32
        /// Spaces are not considred.
        /// </summary>
        /// <param name="s">input string</param>

        /// <param name="floatpoint">true, if Double is considered,
        /// otherwhise Int32 is considered.</param>
        /// <returns>true, if the string contains only digits or float-point</returns>
        public static bool IsNumber( this string s, bool floatpoint )
        {
            int i;
            double d;
            string withoutWhiteSpace = s.RemoveSpaces();
            if ( floatpoint )
                return double.TryParse( withoutWhiteSpace, NumberStyles.Any,
                    Thread.CurrentThread.CurrentUICulture, out d );
            else
                return int.TryParse( withoutWhiteSpace, out i );
        }

        /// <summary>
        /// true, if the string contains only digits or float-point.
        /// Spaces are not considred.
        /// </summary>
        /// <param name="s">input string</param>

        /// <param name="floatpoint">true, if float-point is considered</param>
        /// <returns>true, if the string contains only digits or float-point</returns>
        public static bool IsNumberOnly( this string s, bool floatpoint )
        {
            s = s.Trim();
            if ( s.Length == 0 )
                return false;
            foreach ( char c in s )
            {
                if ( !char.IsDigit( c ) )
                {
                    if ( floatpoint && ( c == '.' || c == ',' ) )
                        continue;
                    return false;
                }
            }
            return true;
        }

        public static string Clean_Filename( this string s )
        {
            s = s.Replace( "&", "_" );
            s = s.Replace( "@", "_" );
            s = s.Replace( "*", "_" );
            s = s.Replace( ":", "_" );
            return s;
        }


        public static string Clean_Var( this string s )
        {
            s = s.Replace( "-", "_" );
            s = s.Replace( "{", "_" );
            s = s.Replace( "}", "_" );
            s = s.Replace( "&", "_" );
            s = s.Replace( "@", "_" );
            s = s.Replace( "*", "_" );
            return s;
        }

        public static string Clean_Web( this string s )
        {
            s = s.Replace( "<", "" );
            s = s.Replace( ">", "" );
            s = s.Replace( @"\", "" );
            s = s.Replace( "/", "" );
            s = s.Replace( ";", "" );
            return s;
        }


        public static string RemoveNonAlphaNumeric( this string s )
        {

            Regex regex = new Regex( "[^a-zA-Z0-9\x20]" );

            return regex.Replace( s, "" );

        }

        /// <summary>
        /// Remove accent from strings 
        /// </summary>
        /// <example>
        ///  input:  "Příliš žluťoučký kůň úpěl ďábelské ódy."
        ///  result: "Prilis zlutoucky kun upel dabelske ody."
        /// </example>
        /// <param name="s"></param>
        /// <remarks>founded at http://stackoverflow.com/questions/249087/
        /// how-do-i-remove-diacritics-accents-from-a-string-in-net</remarks>
        /// <returns>string without accents</returns>

        public static string RemoveDiacritics( this string s )
        {
            string stFormD = s.Normalize( NormalizationForm.FormD );
            StringBuilder sb = new StringBuilder();

            for ( int ich = 0; ich < stFormD.Length; ich++ )
            {
                UnicodeCategory uc = CharUnicodeInfo.GetUnicodeCategory( stFormD[ ich ] );
                if ( uc != UnicodeCategory.NonSpacingMark )
                {
                    sb.Append( stFormD[ ich ] );
                }
            }
            return ( sb.ToString().Normalize( NormalizationForm.FormC ) );
        }


        /// <summary>
        /// Replace \r\n or \n by <br />
        /// from http://weblogs.asp.net/gunnarpeipman/archive/2007/11/18/c-extension-methods.aspx
        /// </summary>

        /// <param name="s"></param>
        /// <returns></returns>
        public static string Nl2Br( this string s )
        {
            return s.Replace( "\r\n", "<br />" ).Replace( "\n", "<br />" );
        }

        /// <summary>
        /// Replace <br /> with \r\n
        /// </summary>

        /// <param name="s"></param>
        /// <returns></returns>
        public static string Br2NL( this string s )
        {
            return s.Replace( "<br />", Environment.NewLine );
        }

        /// <summary>
        static MD5CryptoServiceProvider s_md5 = null;

        /// from http://weblogs.asp.net/gunnarpeipman/archive/2007/11/18/c-extension-methods.aspx
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string MD5( this string s )
        {
            if ( s_md5 == null ) //creating only when needed
                s_md5 = new MD5CryptoServiceProvider();
            Byte[] newdata = Encoding.Default.GetBytes( s );
            Byte[] encrypted = s_md5.ComputeHash( newdata );
            return BitConverter.ToString( encrypted ).Replace( "-", "" ).ToLower();
        }

        public static bool SaveToFile( this string s, string sFilename )
        {
            bool bReturn = true;
            try
            {
                using ( StreamWriter w = File.CreateText( sFilename ) )
                {
                    w.Write( sFilename );
                    w.Flush();
                    w.Close();
                }
            }
            catch
            {
                bReturn = false;
            }

            return bReturn;
        }

        public static List<string> ParameterList( this string s )
        {
            List<string> aParameterList = new List<string>();

            string sWork = s;
            int iLeft = sWork.IndexOf( '[' );
            while ( iLeft >= 0 )
            {
                int iRight = sWork.IndexOf( ']' );
                if ( iRight == -1 )
                    break;
                aParameterList.Add( sWork.Substring( iLeft + 1, iRight - iLeft - 1 ) );

                sWork = sWork.Substring( iRight + 1 );
                iLeft = sWork.IndexOf( '[' );
            }

            return aParameterList;
        }

        public static List<string> WordsAndParameterList( this string s )
        {
            List<string> aList = new List<string>();


            string[] aWords = s.Replace( "[", " [" ).Replace( "]", "] " ).Replace( "  ", " " ).Split( ' ' );

            string sWordBuild = "";
            bool bParameter = false;
            foreach ( string sWord in aWords )
            {
                if ( !bParameter )
                    bParameter = ( sWord.Trim().Left( 1 ) == "[" );

                if ( bParameter )
                {
                    sWordBuild += " " + sWord.Trim();
                    if ( sWord.Right( 1 ) == "]" )
                    {
                        bParameter = false;
                        aList.Add( sWordBuild.Trim() );
                        sWordBuild = "";
                    }
                }
                else
                    aList.Add( sWord.Trim() );

            }

            return aList;
        }

        #region Common string extensions

        /// <summary>
        /// Determines whether the specified string is null or empty.
        /// </summary>
        /// <param name="value">The string value to check.</param>
        public static bool IsEmpty( this string value )
        {
            return ( ( value == null ) || ( value.Length == 0 ) );
        }

        /// <summary>
        /// Determines whether the specified string is not null or empty.
        /// </summary>
        /// <param name="value">The string value to check.</param>
        public static bool IsNotEmpty( this string value )
        {
            return ( value.IsEmpty() == false );
        }

        /// <summary>
        /// Checks whether the string is empty and returns a default value in case.
        /// </summary>
        /// <param name="value">The string to check.</param>
        /// <param name="defaultValue">The default value.</param>
        /// <returns>Either the string or the default value.</returns>
        public static string IfEmpty( this string value, string defaultValue )
        {
            return ( value.IsNotEmpty() ? value : defaultValue );
        }

        /// <summary>
        /// Formats the value with the parameters using string.Format.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="parameters">The parameters.</param>
        /// <returns></returns>
        public static string FormatWith( this string value, params object[] parameters )
        {
            return string.Format( value, parameters );
        }

        /// <summary>
        /// Trims the text to a provided maximum length.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="maxLength">Maximum length.</param>
        /// <returns></returns>
        /// <remarks>Proposed by Rene Schulte</remarks>
        public static string TrimToMaxLength( this string value, int maxLength )
        {
            return ( value == null || value.Length <= maxLength ? value : value.Substring( 0, maxLength ) );
        }

        /// <summary>
        /// Trims the text to a provided maximum length and adds a suffix if required.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="maxLength">Maximum length.</param>
        /// <param name="suffix">The suffix.</param>
        /// <returns></returns>
        /// <remarks>Proposed by Rene Schulte</remarks>
        public static string TrimToMaxLength( this string value, int maxLength, string suffix )
        {
            return ( value == null || value.Length <= maxLength ? value : string.Concat( value.Substring( 0, maxLength ), suffix ) );
        }

        /// <summary>
        /// Determines whether the comparison value strig is contained within the input value string
        /// </summary>
        /// <param name="inputValue">The input value.</param>
        /// <param name="comparisonValue">The comparison value.</param>
        /// <param name="comparisonType">Type of the comparison to allow case sensitive or insensitive comparison.</param>
        /// <returns>
        /// 	<c>true</c> if input value contains the specified value, otherwise, <c>false</c>.
        /// </returns>
        public static bool Contains( this string inputValue, string comparisonValue, StringComparison comparisonType )
        {
            return ( inputValue.IndexOf( comparisonValue, comparisonType ) != -1 );
        }

        /// <summary>
        /// Loads the string into a LINQ to XML XDocument
        /// </summary>
        /// <param name="xml">The XML string.</param>
        /// <returns>The XML document object model (XDocument)</returns>
        public static XDocument ToXDocument( this string xml )
        {
            return XDocument.Parse( xml );
        }

        /// <summary>
        /// Loads the string into a XML DOM object (XmlDocument)
        /// </summary>
        /// <param name="xml">The XML string.</param>
        /// <returns>The XML document object model (XmlDocument)</returns>
        public static XmlDocument ToXmlDOM( this string xml )
        {
            var document = new XmlDocument();
            document.LoadXml( xml );
            return document;
        }

        /// <summary>
        /// Loads the string into a XML XPath DOM (XPathDocument)
        /// </summary>
        /// <param name="xml">The XML string.</param>
        /// <returns>The XML XPath document object model (XPathNavigator)</returns>
        public static XPathNavigator ToXPath( this string xml )
        {
            var document = new XPathDocument( new StringReader( xml ) );
            return document.CreateNavigator();
        }

        /// <summary>
        /// Reverses / mirrors a string.
        /// </summary>
        /// <param name="value">The string to be reversed.</param>
        /// <returns>The reversed string</returns>
        public static string Reverse( this string value )
        {
            if ( value.IsEmpty() || ( value.Length == 1 ) ) return value;

            var chars = value.ToCharArray();
            Array.Reverse( chars );
            return new string( chars );
        }

        /// <summary>
        /// Ensures that a string starts with a given prefix.
        /// </summary>
        /// <param name="value">The string value to check.</param>
        /// <param name="prefix">The prefix value to check for.</param>
        /// <returns>The string value including the prefix</returns>
        /// <example>
        /// <code>
        /// var extension = "txt";
        /// var fileName = string.Concat(file.Name, extension.EnsureStartsWith("."));
        /// </code>
        /// </example>
        public static string EnsureStartsWith( this string value, string prefix )
        {
            if ( value.StartsWith( prefix ) )
                return value;
            return string.Concat( prefix, value );
        }

        /// <summary>
        /// Ensures that a string ends with a given suffix.
        /// </summary>
        /// <param name="value">The string value to check.</param>
        /// <param name="suffix">The suffix value to check for.</param>
        /// <returns>The string value including the suffix</returns>
        /// <example>
        /// <code>
        /// var url = "http://www.pgk.de";
        /// url = url.EnsureEndsWith("/"));
        /// </code>
        /// </example>
        public static string EnsureEndsWith( this string value, string suffix )
        {
            if ( value.EndsWith( suffix ) )
                return value;
            return string.Concat( value, suffix );
        }

        #endregion

        #region Regex based extension methods

        /// <summary>
        /// Uses regular expressions to determine if the string matches to a given regex pattern.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <returns>
        /// 	<c>true</c> if the value is matching to the specified pattern; otherwise, <c>false</c>.
        /// </returns>
        /// <example>
        /// <code>
        /// var s = "12345";
        /// var isMatching = s.IsMatchingTo(@"^\d+$");
        /// </code>
        /// </example>
        public static bool IsMatchingTo( this string value, string regexPattern )
        {
            return IsMatchingTo( value, regexPattern, RegexOptions.None );
        }

        /// <summary>
        /// Uses regular expressions to determine if the string matches to a given regex pattern.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <param name="options">The regular expression options.</param>
        /// <returns>
        /// 	<c>true</c> if the value is matching to the specified pattern; otherwise, <c>false</c>.
        /// </returns>
        /// <example>
        /// <code>
        /// var s = "12345";
        /// var isMatching = s.IsMatchingTo(@"^\d+$");
        /// </code>
        /// </example>
        public static bool IsMatchingTo( this string value, string regexPattern, RegexOptions options )
        {
            return Regex.IsMatch( value, regexPattern, options );
        }

        /// <summary>
        /// Uses regular expressions to replace parts of a string.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <param name="replaceValue">The replacement value.</param>
        /// <returns>The newly created string</returns>
        /// <example>
        /// <code>
        /// var s = "12345";
        /// var replaced = s.ReplaceWith(@"\d", m => string.Concat(" -", m.Value, "- "));
        /// </code>
        /// </example>
        public static string ReplaceWith( this string value, string regexPattern, string replaceValue )
        {
            return ReplaceWith( value, regexPattern, replaceValue, RegexOptions.None );
        }

        /// <summary>
        /// Uses regular expressions to replace parts of a string.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <param name="replaceValue">The replacement value.</param>
        /// <param name="options">The regular expression options.</param>
        /// <returns>The newly created string</returns>
        /// <example>
        /// <code>
        /// var s = "12345";
        /// var replaced = s.ReplaceWith(@"\d", m => string.Concat(" -", m.Value, "- "));
        /// </code>
        /// </example>
        public static string ReplaceWith( this string value, string regexPattern, string replaceValue, RegexOptions options )
        {
            return Regex.Replace( value, regexPattern, replaceValue, options );
        }

        /// <summary>
        /// Uses regular expressions to replace parts of a string.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <param name="evaluator">The replacement method / lambda expression.</param>
        /// <returns>The newly created string</returns>
        /// <example>
        /// <code>
        /// var s = "12345";
        /// var replaced = s.ReplaceWith(@"\d", m => string.Concat(" -", m.Value, "- "));
        /// </code>
        /// </example>
        public static string ReplaceWith( this string value, string regexPattern, MatchEvaluator evaluator )
        {
            return ReplaceWith( value, regexPattern, RegexOptions.None, evaluator );
        }

        /// <summary>
        /// Uses regular expressions to replace parts of a string.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <param name="options">The regular expression options.</param>
        /// <param name="evaluator">The replacement method / lambda expression.</param>
        /// <returns>The newly created string</returns>
        /// <example>
        /// <code>
        /// var s = "12345";
        /// var replaced = s.ReplaceWith(@"\d", m => string.Concat(" -", m.Value, "- "));
        /// </code>
        /// </example>
        public static string ReplaceWith( this string value, string regexPattern, RegexOptions options, MatchEvaluator evaluator )
        {
            return Regex.Replace( value, regexPattern, evaluator, options );
        }

        /// <summary>
        /// Uses regular expressions to determine all matches of a given regex pattern.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <returns>A collection of all matches</returns>
        public static MatchCollection GetMatches( this string value, string regexPattern )
        {
            return GetMatches( value, regexPattern, RegexOptions.None );
        }

        /// <summary>
        /// Uses regular expressions to determine all matches of a given regex pattern.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <param name="options">The regular expression options.</param>
        /// <returns>A collection of all matches</returns>
        public static MatchCollection GetMatches( this string value, string regexPattern, RegexOptions options )
        {
            return Regex.Matches( value, regexPattern, options );
        }

        /// <summary>
        /// Uses regular expressions to determine all matches of a given regex pattern and returns them as string enumeration.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <returns>An enumeration of matching strings</returns>
        /// <example>
        /// <code>
        /// var s = "12345";
        /// foreach(var number in s.GetMatchingValues(@"\d")) {
        ///  Console.WriteLine(number);
        /// }
        /// </code>
        /// </example>
        public static IEnumerable<string> GetMatchingValues( this string value, string regexPattern )
        {
            return GetMatchingValues( value, regexPattern, RegexOptions.None );
        }

        /// <summary>
        /// Uses regular expressions to determine all matches of a given regex pattern and returns them as string enumeration.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <param name="options">The regular expression options.</param>
        /// <returns>An enumeration of matching strings</returns>
        /// <example>
        /// <code>
        /// var s = "12345";
        /// foreach(var number in s.GetMatchingValues(@"\d")) {
        ///  Console.WriteLine(number);
        /// }
        /// </code>
        /// </example>
        public static IEnumerable<string> GetMatchingValues( this string value, string regexPattern, RegexOptions options )
        {
            foreach ( Match match in GetMatches( value, regexPattern, options ) )
            {
                if ( match.Success ) yield return match.Value;
            }
        }

        /// <summary>
        /// Uses regular expressions to split a string into parts.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <returns>The splitted string array</returns>
        public static string[] Split( this string value, string regexPattern )
        {
            return value.Split( regexPattern, RegexOptions.None );
        }

        /// <summary>
        /// Uses regular expressions to split a string into parts.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="regexPattern">The regular expression pattern.</param>
        /// <param name="options">The regular expression options.</param>
        /// <returns>The splitted string array</returns>
        public static string[] Split( this string value, string regexPattern, RegexOptions options )
        {
            return Regex.Split( value, regexPattern, options );
        }

        /// <summary>
        /// Splits the given string into words and returns a string array.
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <returns>The splitted string array</returns>
        public static string[] GetWords( this string value )
        {
            return value.Split( @"\W" );
        }

        /// <summary>
        /// Gets the nth "word" of a given string, where "words" are substrings separated by a given separator
        /// </summary>
        /// <param name="value">The string from which the word should be retrieved.</param>
        /// <param name="index">Index of the word (0-based).</param>
        /// <returns>
        /// The word at position n of the string.
        /// Trying to retrieve a word at a position lower than 0 or at a position where no word exists results in an exception.
        /// </returns>
        /// <remarks>Originally contributed by MMathews</remarks>
        public static string GetWordByIndex( this string value, int index )
        {
            var words = value.GetWords();

            if ( ( index < 0 ) || ( index > words.Length - 1 ) )
            {
                throw new IndexOutOfRangeException( "The word number is out of range." );
            }

            return words[ index ];
        }

        #endregion

        #region Bytes & Base64

        /// <summary>
        /// Converts the string to a byte-array using the default encoding
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <returns>The created byte array</returns>
        public static byte[] ToBytes( this string value )
        {
            return value.ToBytes( null );
        }

        /// <summary>
        /// Converts the string to a byte-array using the supplied encoding
        /// </summary>
        /// <param name="value">The input string.</param>
        /// <param name="encoding">The encoding to be used.</param>
        /// <returns>The created byte array</returns>
        /// <example><code>
        /// var value = "Hello World";
        /// var ansiBytes = value.ToBytes(Encoding.GetEncoding(1252)); // 1252 = ANSI
        /// var utf8Bytes = value.ToBytes(Encoding.UTF8);
        /// </code></example>
        public static byte[] ToBytes( this string value, Encoding encoding )
        {
            encoding = ( encoding ?? Encoding.Default );
            return encoding.GetBytes( value );
        }

        /// <summary>
        /// Encodes the input value to a Base64 string using the default encoding.
        /// </summary>
        /// <param name="value">The input value.</param>
        /// <returns>The Base 64 encoded string</returns>
        public static string EncodeBase64( this string value )
        {
            return value.EncodeBase64( null );
        }

        /// <summary>
        /// Encodes the input value to a Base64 string using the supplied encoding.
        /// </summary>
        /// <param name="value">The input value.</param>
        /// <param name="encoding">The encoding.</param>
        /// <returns>The Base 64 encoded string</returns>
        public static string EncodeBase64( this string value, Encoding encoding )
        {
            encoding = ( encoding ?? Encoding.UTF8 );
            var bytes = encoding.GetBytes( value );
            return Convert.ToBase64String( bytes );
        }

        /// <summary>
        /// Decodes a Base 64 encoded value to a string using the default encoding.
        /// </summary>
        /// <param name="encodedValue">The Base 64 encoded value.</param>
        /// <returns>The decoded string</returns>
        public static string DecodeBase64( this string encodedValue )
        {
            return encodedValue.DecodeBase64( null );
        }

        /// <summary>
        /// Decodes a Base 64 encoded value to a string using the supplied encoding.
        /// </summary>
        /// <param name="encodedValue">The Base 64 encoded value.</param>
        /// <param name="encoding">The encoding.</param>
        /// <returns>The decoded string</returns>
        public static string DecodeBase64( this string encodedValue, Encoding encoding )
        {
            encoding = ( encoding ?? Encoding.UTF8 );
            var bytes = Convert.FromBase64String( encodedValue );
            return encoding.GetString( bytes );
        }

        #endregion

        public static T FromJSONTo<T>(this string raw) where T : new()
        {
            try
            {
                return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(raw);
            }
            catch
            {
                return default(T);
            }
        }
    }
}
