namespace Keystone.DAL.Model.Results
{
    public class CbolSummaryRowModel
    {
        public string Carrier_BOL { get; set; }
        public string Containers { get; set; }
        public string Status { get; set; }
        public string Ver_Charge_Code { get; set; }
        public string NonVer_charge_code { get; set; }
        public string Processed_charge_code { get; set; }
        public string Shipment_Count { get; set; }
        public string Container_Count { get; set; }
        public string Invoice_Amt { get; set; }
        public string E2K_Buy_Amt { get; set; }
        public string Buy_Cid_Orig { get; set; }
        public string Diff_Amt { get; set; }
        public string Sell_Amt { get; set; }
        public string Net_Amt { get; set; }
        public string Processed_Amt { get; set; }
        public string Comment { get; set; }
        public string ChargeUsed { get; set; }
        public string TotalRows { get; set; }
    }

    public class CbolAggregateModel
    {
        public string All { get; set; }
        public string Matched { get; set; }
        public string NonMatched { get; set; }
        public string Selected { get; set; }
    }
}
