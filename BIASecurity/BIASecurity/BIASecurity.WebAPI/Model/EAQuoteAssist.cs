using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIASecurity.WebAPI.Model
{
    public struct EAQuoteAssistUserAccess
    {
        public string USRSYSM { get; set; }
        public string SUPER_USER { get; set; }
        public string COST_VIEW { get; set; }
        public string BILLING_VIEW { get; set; }
        public string EZQUOTE { get; set; }
        public string CPD { get; set; }
        public string CPD_ADMIN { get; set; }
        public string CUSTOM_RATE { get; set; }
        public string TLI_ADJUSTER { get; set; }
        public string TLI_ADMIN { get; set; }
        public string EXTRACT_RATES { get; set; }
        public string QA_INSIGHT { get; set; }
        public string TLI_SA { get; set; }
        public string IS_TDO { get; set; }
        public string EDIT_XSURCHARGE { get; set; }
        public string MARGIN_FLOOR_USER { get; set; }
        public string QA_INSIGHT_GRANTOR { get; set; }
        public string EDIT_ADDITIONAL_CHARGES { get; set; }
        public string REQUOTE_REQUESTOR_REG { get; set; }
        public string REQUOTE_APPROVER_REG { get; set; }
        public string REQUOTE_APPROVER_NONREG { get; set; }
        public string REQUOTE_ADMIN_REG { get; set; }
        public string GRI_EXEMPT_ADMIN { get; set; }
        public string QA_INSIGHT_LCL { get; set; }
        public string LCL_CALC_USER { get; set; }
        public string CARRIER_CONTRACT_AUDIT { get; set; }
        public string QA_INSIGHT_USERVIEW { get; set; }
        public string QA_INSIGHT_AUTORATEVIEW { get; set; }
        public string IS_E2K_USER { get; set; }
    }

    public class ResponseText
    {
        public bool ResponseType { get; set; }
        public string Response { get; set; }
    }
}
