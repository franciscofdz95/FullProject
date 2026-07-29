namespace Keystone.DAL.Model
{
    public class ValuePayLocationInfo
    {
        public string req_location { get; set; }
        public string invoice_type_code { get; set; }
        public string value_pay_location { get; set; }
    }

    public class ValuePayLocationUpdateRequest
    {
        public string ReqLocation { get; set; }
        public string InvoiceTypeCode { get; set; }
        public string ValuePayLocation { get; set; }
    }
}
