using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace BIACore.Web.Model.ExtJS
{
    /// <summary>
    /// Class for handling the 'sort' parameters on store posts.
    /// </summary>
    public class Sorter
    {
        private string _property;
        public string property
        {
            get { return _property; }
            set
            {
                string prop = value;

                //Remove from property all characters not Alpha,Numeric,Underscore,Space,Open/Close Brackets
                prop = Regex.Replace(prop, "[^a-zA-Z0-9 .@$#_]", "");
                if (Regex.IsMatch(prop[0].ToString(), "[^a-zA-Z@#_]")) prop = prop.Substring(1, prop.Length - 1);

                //If property has spaces outside Open/Close brackets, null property and direction
                _property = prop.Trim();
            }
        }

        private string _direction;
        public string direction
        {
            get { return _direction; }
            set
            {
                string dir = value.ToUpper();

                //Validate direction is ASC or DESC, if not clear value
                if ((new List<string>() { "ASC", "DESC" }).IndexOf(dir) == -1) dir = "ASC";

                _direction = dir;
            }
        }

        public Sorter() { }

        public string Value
        {
            get { return property != "" && property != null ? string.Format("[{0}] {1}", property, direction) : ""; }
        }

        public override string ToString()
        {
            return property != "" && property != null ? string.Format("[{0}] {1}", property, direction) : "";
        }
    }
}