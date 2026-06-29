using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace BIACore.Web.Model.ExtJS
{
    public class DebugData
    {
        [JsonProperty(PropertyName = "CallString")]
        public string CallString { get; set; }
        [JsonProperty(PropertyName = "DBTime")]
        public double? DBTime { get; set; }
        [JsonProperty(PropertyName = "DataLoadTime")]
        public double? DataLoadTime { get; set; }
        [JsonProperty(PropertyName = "BIAWebAPITime")]
        public double? BIAWebAPITime { get; set; }
        [JsonProperty(PropertyName = "TransactionId")]
        public Guid TransactionId { get; set; }
        [JsonProperty(PropertyName = "Start")]
        public DateTime? Start { get; set; }
        [JsonProperty(PropertyName = "End")]
        public DateTime? End { get; set; }
        [JsonProperty(PropertyName = "WebAPIRoute")]
        public string WebAPIRoute { get; set; }

        public DebugData() { }
        public DebugData(string callString, DateTime start, DateTime end, double dbtime)
        {
            CallString = callString;
            DBTime = dbtime;
            DataLoadTime = end != null ? end.Subtract(start).TotalMilliseconds - dbtime : 0;
            BIAWebAPITime = end != null ? end.Subtract(start).TotalMilliseconds : 0;
            Start = start;
            End = end;
            TransactionId = Log.LogFactory.TransactionId;
            if (System.Web.HttpContext.Current != null && System.Web.HttpContext.Current.Request != null)
                WebAPIRoute = System.Web.HttpContext.Current.Request.FilePath;
        }

        public static DebugData LoadFromDictionary(Dictionary<string, object> data)
        {
            DebugData debugData = null;
            DateTime tryParse = new DateTime();

            string callString = data.ContainsKey("CallString") ? data["CallString"].ToString() : "";
            DateTime start = data.ContainsKey("Start") && DateTime.TryParse(data["Start"].ToString(), out tryParse) ? tryParse : new DateTime(1, 1, 1);
            DateTime end = data.ContainsKey("End") && DateTime.TryParse(data["End"].ToString(), out tryParse) ? tryParse : new DateTime(1, 1, 1);
            double? dbtime = data.ContainsKey("DBTime") ? (double?)double.Parse(data["DBTime"].ToString()) : null;
            double? biaWebAPITime = data.ContainsKey("BIAWebAPITime") ? (double?)double.Parse(data["BIAWebAPITime"].ToString()) : null;
            Guid transactionId = data.ContainsKey("TransactionId") ? Guid.Parse(data["TransactionId"].ToString()) : Log.LogFactory.TransactionId;
            string webAPIRoute = data.ContainsKey("WebAPIRoute") ? data["WebAPIRoute"].ToString() : "";

            try
            {
                debugData = new DebugData()
                {
                    CallString = callString,
                    DBTime = dbtime,
                    BIAWebAPITime = biaWebAPITime,
                    TransactionId = transactionId,
                    Start = start,
                    End = end,
                    WebAPIRoute = webAPIRoute
                };
            }
            catch (Exception ex) { }

            return debugData;
        }

        public Dictionary<string, object> ToSerizlizable()
        {
            return (new Dictionary<string, object> { { "CallString", CallString }, { "DBTime", DBTime }, { "BIAWebAPITime", BIAWebAPITime }, { "Start", Start }, { "End", End }, { "TransactionId", TransactionId }, { "WebAPIRoute", WebAPIRoute } });
        }
    }
}
