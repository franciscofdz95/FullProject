using Keystone.DAL.Model;
using System.Xml.Linq;

namespace Keystone.Server.Utility
{
    public class ReportFormatter
    {
        public ReportFormatter()
        {

        }

        public List<Dictionary<string, (object, string)>> RowsFormatter(IEnumerable<Dictionary<string, object>> _queryResult, string _schema)
        {
            List<Dictionary<string, (object, string)>> _reportSkeleton = new List<Dictionary<string, (object, string)>>();
            XDocument _xdoc = XDocument.Parse(_schema);
            var _typesList = _xdoc.Root.Elements("field").ToList();
            foreach (var itemList in _queryResult)
            {
                Dictionary<string, (object, string)> _rep = new Dictionary<string, (object, string)>();

                foreach (var item in itemList)
                {
                    var type = _typesList.SingleOrDefault(x => x.Element("columnName")?.Value.ToLower() == item.Key.ToLower());
                    string typeStr = "";
                    if (type != null)
                        typeStr = (type.Element("type").Value != null ? type.Element("type").Value : "");

                    if(item.Value != null)
                    {
                        _rep.Add(item.Key, (TypeParser(item.Value.ToString(), typeStr), typeStr));
                    }
                    else
                    {
                        _rep.Add(item.Key, (TypeParser("", typeStr), typeStr));
                    }
                    
                }

                _reportSkeleton.Add(_rep);
            }

            return _reportSkeleton;
        }

        private object TypeParser(string _value, string _type)
        {
            object valueRes = null;

            if (!string.IsNullOrEmpty(_type))
            {
                switch (_type)
                {
                    case "date":
                        DateTime tempDate;
                        DateTime.TryParse(_value, out tempDate);
                        valueRes = tempDate;
                        break;
                    case "number":
                        int tempInt;
                        int.TryParse(_value, out tempInt);
                        valueRes = tempInt;
                        break;
                    case "money":
                        double tempDou;
                        double.TryParse(_value, out tempDou);
                        valueRes = tempDou;
                        break;
                    case "text":
                        valueRes = _value.ToString();
                        break;
                    case "bool":
                        bool tempBool;
                        bool.TryParse(_value, out tempBool);
                        valueRes = (tempBool == true ? "true" : "false");
                        break;
                    default:
                        valueRes = _value.ToString();
                        break;
                }
            }

            return valueRes;
        }

        public string LoadSchema(string report)
        {
            string schema = @"
                <fields>
                  <field>
                    <columnName>id</columnName>
                    <type>number</type>
                  </field>
                  <field>
                    <columnName>text</columnName>
                    <type>text</type>
                  </field>
                  <field>
                    <columnName>flag</columnName>
                    <type>text</type>
                  </field>
                </fields>
                ";

            return schema;
        }

        public List<DBParameter> GetParameters(List<string> _parametersList, string paramSchema)
        {

            if (_parametersList.Count == 0)
                return new List<DBParameter>();

            //Added in case paramSchema is null
            if (string.IsNullOrEmpty(paramSchema))
                return new List<DBParameter>();

            var parameters = new List<DBParameter>();
            DBParameter dbParam;
            XDocument _xdoc = XDocument.Parse(paramSchema);
            var _typesList = _xdoc.Root.Elements("parameter").ToList();
            int paramindex = 0;
            foreach (var xItems in _typesList)
            {
                var elements = xItems.Elements();
                string type = elements.LastOrDefault().Value;
                string paramName = elements.FirstOrDefault().Value;
                switch (type)
                {
                    case "string":
                        dbParam = new DBParameter("@" + paramName, System.Data.DbType.String, _parametersList[paramindex]);
                        break;
                    case "number":
                        dbParam = new DBParameter("@" + paramName, System.Data.DbType.Int32, _parametersList[paramindex]);
                        break;
                    case "date":
                        //ESE-0226-2
                        DateTime dtTemp = new DateTime();
                        DateTime.TryParse(_parametersList[paramindex], out dtTemp);
                        dbParam = new DBParameter("@" + paramName, System.Data.DbType.DateTime, dtTemp);
                        break;
                    default:
                        dbParam = new DBParameter("@" + paramName, System.Data.DbType.String, _parametersList[paramindex]);
                        break;
                }
                parameters.Add(dbParam);
                paramindex++;

            }


            return parameters;
        }
    }
}
