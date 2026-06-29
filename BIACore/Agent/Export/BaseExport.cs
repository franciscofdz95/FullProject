using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace BIACore.Agent.Export
{
    public abstract class BaseExport
    {
        internal int ReportId { get; set; }
        public string ReportName { get; set; }
        public string ReportTitle { get; set; }
        public string[] ReportParam { get; set; }
        public abstract string ReportType { get; }

        public abstract Stream Generate();

        public void StatusUpdate(string message)
        {
            //BIACore.Web.Client.Post(API.URL(API.UPDATE), new[] {
            //    new {
            //        ReportId = ReportId,
            //        Comments = message
            //    }
            //},true);

            System.Threading.Tasks.Task.Factory.StartNew((l) => {
                BIACore.Web.Client.Post(API.URL(API.UPDATE), new[] { l }, false);
            }, new
            {
                ReportId = ReportId,
                Comments = message
            });
        }
    }
}
