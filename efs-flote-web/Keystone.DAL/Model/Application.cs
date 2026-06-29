using System;
using System.Net;

namespace Keystone.DAL.Model
{
    public class Application
    {
        public string date { get; set; }
        public string server { get; set; }

        public string name { get; set; }
        public string appCode { get; set; }
        public string logoPath { get; set; }
        public string returnPath { get; set; }

        public string lastName { get; set; }
        public string firstName { get; set; }
        public string userId { get; set; }

        public string authenticatedId { get; set; }

        public int pendingRequests { get; set; }

        public int notificationCount { get; set; }

        public int minutesRemaining { get; set; }        

        public Application()
        {
            date = DateTime.Now.ToString("MM/dd/yyyy HH:mm");
            server = Dns.GetHostName();
        }
    }
}
