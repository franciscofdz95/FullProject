using Newtonsoft.Json;
using System.Collections.Generic;

namespace BIACore.Web.Model.ExtJS
{
    /// <summary>
    /// Defines the ExtJS store based result set.
    /// Automatically includes metaData/data/total/dataTotal/success properties.
    /// Meant to be used with the 'webapi' proxy type.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class StoreResult<T> : ClientResult
    {
        #region Fields & Properties
        [JsonProperty(PropertyName = "metaData", NullValueHandling = NullValueHandling.Ignore)]
        public MetaData MetaData { get; set; }

        [JsonProperty(PropertyName = "data", NullValueHandling = NullValueHandling.Ignore)]
        public List<T> Data { get; set; }

        [JsonProperty(PropertyName = "total", NullValueHandling = NullValueHandling.Ignore)]
        public int? Total { get; set; }

        [JsonProperty(PropertyName = "dataTotal", NullValueHandling = NullValueHandling.Ignore)]
        public object DataTotal { get; set; }

        [JsonProperty(PropertyName = "success", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Success { get; set; }

        [JsonProperty(PropertyName = "debug", NullValueHandling = NullValueHandling.Ignore)]
        public DebugData Debug { get; set; }
        #endregion

        #region Constructors
        public StoreResult()
            : base()
        {
            Success = true;
            MetaData = null;
            Debug = null;
        }
        #endregion

        #region Methods
        public override System.Collections.IList GetData()
        {
            return Data;
        }
        #endregion
    }
}
