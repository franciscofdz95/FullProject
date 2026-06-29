namespace Keystone.DAL.Model
{
    public class EmailNotificationConfig
    {
        public int Email_Notification_ID { get; set; }
        public int Email_Configuration_ID { get; set; }
        public string Recipient_Type { get; set; }
        public string Recipient_Type_Name { get; set; }
        public int User_ID { get; set; }
        public string User_Name { get; set; }
        public string User_Email { get; set; }
        public string User_Detail { get; set; }
        public int CreatedBy_ID { get; set; }
        public string CreatedBy_Name { get; set; }
        public string CreatedBy_Email { get; set; }
        public string CreatedBy_Detail { get; set; }
    }


    public class NotificationEmailConfigRequest
    {
        public int? NotificationConfigurationId { get; set; }
        public int EmailConfigurationId { get; set; }
        public int UserId { get; set; }
        public int RecipientTypeId { get; set; }
    }
}
