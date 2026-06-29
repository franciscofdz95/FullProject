using System;
using System.Linq;
using System.Text;

namespace BIACore.Utility
{
    public static class Randomizer
    {
        public static string GetAlphaNumericSymbol(int length)
        {
            StringBuilder randString = new StringBuilder();
            string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~_:.$!";
            Random rand = new Random();

            for (var i = 0; i < length; i++) randString.Append(chars.ToArray()[rand.Next(0, 67)].ToString());

            return randString.ToString();
        }

        public static string GetRandomID(int length = 15)
        {
            StringBuilder builder = new StringBuilder();
            Enumerable
            .Range(65, 26)
            .Select(e => ((char)e).ToString())
            .Concat(Enumerable.Range(97, 26).Select(e => ((char)e).ToString()))
            .Concat(Enumerable.Range(0, 10).Select(e => e.ToString()))
            .OrderBy(e => Guid.NewGuid())
            .Take(length)
            .ToList().ForEach(e => builder.Append(e));
            string id = builder.ToString();

            return id;
        }
    }
}
