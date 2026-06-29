using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Model.Results
{
    public class AccrualMonthlyReportModel
    {
        public string ROWNUMBER { get; set; }
        public string COMPANY { get; set; }
        public string RRDD { get; set; }
        public string CENTER { get; set; }
        public string OPERATION { get; set; }
        public string PRODUCT { get; set; }
        public string ACCOUNT { get; set; }
        public string LINE_DESCRIPTION { get; set; }
        public string Captured_Info_DFF { get; set; }
        public string ORA_CURRENCY_CODE { get; set; }
        public string DEBIT { get; set; }
        public string CREDIT { get; set; }
        public string STATAMOUNT { get; set; }
        public string cost_loc_code { get; set; }
    }

    public class AccrualMonthlyDetailReportModel
    {
        public string ROWNUMBER { get; set; }
        public string acctg_per_year { get; set; }
        public string acctg_per_month { get; set; }
        public string jrnl_date { get; set; }
        public string company_code { get; set; }
        public string rrdd_code { get; set; }
        public string center_code { get; set; }
        public string opstypecode { get; set; }
        public string product { get; set; }
        public string account_code { get; set; }
        public string ORA_LOCAL_AMOUNT_DR { get; set; }
        public string ORA_LOCAL_AMOUNT_CR { get; set; }
        public string STAT_AMOUNT { get; set; }
        public string Captured_Info_DEF { get; set; }
        public string ORA_CURRENCY_CODE { get; set; }
        public string shipment_dim_fk { get; set; }
        public string shipment_nbr { get; set; }
        public string RCVD_AT_DATE { get; set; }
        public string DEPART_DATE { get; set; }
        public string SERVICE_CODE { get; set; }
        public string ORIG_TP { get; set; }
        public string ORIG_CC { get; set; }
        public string DEST_TP { get; set; }
        public string DEST_CC { get; set; }
        public string CHARGE_CODE { get; set; }
        public string REV_SPLIT { get; set; }
        public string COST_LOC_CODE { get; set; }
        public string location_code { get; set; }
        public string SELL_AMT_LOCAL { get; set; }
        public string vendor_code { get; set; }
        public string vendor_name { get; set; }
        public string Carrier_Bol { get; set; }
        public string EPA_LOC { get; set; }
        public string EPA_CC { get; set; }
        public string Notes { get; set; }
        public string charge_Description { get; set; }
        public string Ship_period { get; set; }
        public string Invoice_Status { get; set; }
        public string TotalRows { get; set; }
    }

    public class AccrualAccuracyReportModel
    {
        public string ROWNUMBER { get; set; }
        public string acctg_per_year { get; set; }
        public string acctg_per_month { get; set; }
        public string Region { get; set; }
        public string District { get; set; }
        public string Location_code { get; set; }
        public string AmountPaid { get; set; }
        public string AmountAccrued { get; set; }
        public string DiffAmount { get; set; }
        public string OverallPercentageAccuracy { get; set; }
        public string ABSDiff { get; set; }
        public string ABSPercentageAccuracy { get; set; }
        public string TotalRows { get; set; }
    }
}
