namespace Keystone.DAL.Model
{
    public class EmailConfig
    {
        public int Email_Configuration_ID { get; set; }
        public string Process_Keyword { get; set; }
        public string Process_Name { get; set; }
        public string From_Email { get; set; }
        public string Sub { get; set; }
        public string To_Email { get; set; }
        public string CC_Email { get; set; }
        public string BCC_Email { get; set; }
        public string Body_Content { get; set; }
        public string ProcessOwner { get; set; }
        public int? total_count { get; set; }
    }

    public class EmailConfigPagination
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
