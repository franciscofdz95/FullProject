using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Flote.WebAPI.WebAPI.Controller
{
    public class Validate_Model
    {
        public int ROW_ID { get; set; }
        public int INVOICE_ID { get; set; }
        public DateTime DATE { get; set; }
        public int SSROWNUMBER { get; set; }
        public string UserID { get; set; }
        public string CONTAINER_NBR { get; set; }
        public string CONTAINER_NBR_ERR { get; set; }
        public string CONTAINER_NBR_ERR_MSG { get; set; }
        public string CARRIER_BOL { get; set; }
        public string ORIGINAL_CARRIER_BOL { get; set; }
        public string CARRIER_BOL_ERR { get; set; }
        public string CARRIER_BOL_ERR_MSG { get; set; }
        public string JOB_NBR { get; set; }
        public string JOB_NBR_ERR { get; set; }
        public string JOB_NBR_ERR_MSG { get; set; }
        public string HBL { get; set; }
        public string HBL_ERR { get; set; }
        public string HBL_ERR_MSG { get; set; }
        public string CONTAINER_TYPE { get; set; }
        public string CONTAINER_TYPE_ERR { get; set; }
        public string CONTAINER_TYPE_ERR_MSG { get; set; }
        public string CHARGE_DESCRIPTION { get; set; }
        public string CHARGE_DESCRIPTION_ERR { get; set; }
        public string CHARGE_DESCRIPTION_ERR_MSG { get; set; }
        public decimal AMOUNT { get; set; }
        public string AMOUNT_ERR { get; set; }
        public string AMOUNT_ERR_MSG { get; set; }
        public decimal VERIFIED_AMOUNT { get; set; }
        public string VERIFIED_AMT_ERR { get; set; }
        public string VERIFIED_AMT_ERR_MSG { get; set; }
        public string RATES_MATCH { get; set; }
        public string RATES_MATCH_ERR { get; set; }
        public string RATES_MATCH_ERR_MSG { get; set; }
        public string CHARGE_CODE { get; set; }
        public string CHARGE_CODE_ERR { get; set; }
        public string CHARGE_CODE_ERR_MSG { get; set; }
        public string COMMENT { get; set; }
        public string COMMENT_ERR { get; set; }
        public string COMMENT_ERR_MSG { get; set; }
        public int CONTAINER_COUNT { get; set; }
        public string CONTAINER_COUNT_ERR { get; set; }
        public string CONTAINER_COUNT_ERR_MSG { get; set; }
        public int TotalCount { get; set; }
        public int ErrorCount { get; set; }
        public int WarningCount { get; set; }
        public int ActionCount { get; set; }
        public int CBOLNCount { get; set; }
        public int CBOLRCount { get; set; }
        public int CHGCDCount { get; set; }
        public string ErrType { get; set; }
        public string ErrorMessage { get; set; }
        public Boolean Error { get; set; }
        public Boolean Warning { get; set; }
        public Boolean ACTION { get; set; }
        public Boolean DUPLICATE_FLAG { get; set; }
        public string SortProperty { get; set; }
        public int START { get; set; }
        public int LIMIT { get; set; }
    }
}
