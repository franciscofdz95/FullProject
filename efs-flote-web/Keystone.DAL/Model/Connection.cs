namespace Keystone.DAL.Model
{
    public class Connection
    {
        public string ConnectionName { get; set; }
        public string ServerType { get; set; }
        public string ServerVersion { get; set; }
        public string ServerName { get; set; }
        public string InstanceName { get; set; }
        public string Port { get; set; }
        public string DatabaseName { get; set; }
        public string GlobalName { get; set; }
        public string Username { get; set; }
        public string AuthKey { get; set; }
        public string Provider { get; set; }
        public bool IncludeProvider { get; set; }
        public bool Raw { get; set; }

        public Connection()
        {

        }
    }
}