using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;

using BIACore.Extensions;
using BIACore.Log;
using BIACore.Model;
using BIACore.Provider;
using biasec = BIACore.Security;

using BIACore.Agent.Export;

namespace BIACore.Agent.Task
{
    public class ExportReport : BaseTask
    {
        internal class ExportType
        {
            internal string Assembly { get; set; }
            internal Type Type { get; set; }
            internal string Name { get; set; }
        }

        internal static List<ExportType> TypeCache = new List<ExportType>();

        public ExportReport() : this(new TimeSpan(0, 5, 0)) { }

        public ExportReport(TimeSpan interval)
        {
            Interval = interval;
        }

        private List<MyReport> Reports
        {
            get
            {
                return BIACore.Web.Client.Post<List<MyReport>>(API.URL(API.LIST) + "?AppCode=" + Settings.Config.AppCode, null);
            }
        }

        #region Job
        public override TimeSpan Interval { get; set; }

        public override void Run()
        {
            int success = 0, failure = 0;

            // prime the loop
            List<MyReport> reports = Sort(Reports);
            while (reports.Count > 0)
            {
                UpdateStatus(reports);
                // and start processing the first item in the queue.
                MyReport report = reports[0];
                try
                {
                    // Run as the report's user
                    biasec.User.StandAlone(report.UserId);
                    string detail = null;

                    try
                    {
                        if (string.IsNullOrWhiteSpace(BIACore.Security.User.userId) || BIACore.Security.User.permissions == null
                            || BIACore.Security.User.permissions.Count == 0)
                            throw new Exception("User does not have permissions for the app");

                        ExportStart(report);
                        LogFactory.Debug("Agent: Generating report {0} for {1}", report.ReportType, report.UserId);

                        BaseExport item = CreateReport(report);
                        Stream data = item.Generate();

                        if (data.Length == 0) throw new Exception("output size 0 bytes");

                        LogFactory.Debug("Agent: Report generated, Sending {0} bytes as {1}", data.Length, report.FileName);

                        UploadFile(report.ReportId.Value, report.FileName, data);
                        ReportComplete(report);
                        ++success;
                        ExportEnd(report);
                    }
                    catch (Exception e)
                    {
                        LogFactory.Exception(e);
                        ReportFail(report, e);
                        ++failure;
                        detail = string.Format("{0}:{1}", e.Message, e.InnerException);
                    }
                    GC.Collect();
                }
                catch { }
                finally
                {
                    // Reset the user
                    biasec.User.StandAlone(null);
                }

                reports = Sort(Reports);
            }
            LogFactory.Message("Agent: Exported {0} successfully and {1} failed", success, failure);
        }

        private void UpdateStatus(List<MyReport> reports)
        {
            List<object> updates = new List<object>();
            long EstimateMS = 0;
            // update the status of all the reports as to their position in the queue.
            for (int i = 1; i < reports.Count; ++i)
            {
                EstimateMS += EstimateProcessingTime(reports[i]);
                updates.Add(new
                {
                    ReportId = reports[i].ReportId.Value,
                    Status = "Q",
                    Comments = string.Format("Position {0}, ETA: {1}", i, Prettify(TimeSpan.FromMilliseconds(EstimateMS)))
                });
            }

            updates.Add(new
            {
                ReportId = reports[0].ReportId.Value,
                Status = "P",
                Comments = "Report is processing"
            });

            //BIACore.Web.Client.Post(API.URL(API.UPDATE), updates.ToArray());
            System.Threading.Tasks.Task.Factory.StartNew((l) => {
                BIACore.Web.Client.Post(API.URL(API.UPDATE), ((List<object>)l).ToArray(), false);
            }, updates);
        }

        private void ReportFail(MyReport report, Exception e)
        {
            //BIACore.Web.Client.Post(API.URL(API.UPDATE), new[] {
            //    new {
            //        ReportId = report.ReportId.Value,
            //        Status = "E",
            //        Comments = e.Message
            //    }
            //});

            System.Threading.Tasks.Task.Factory.StartNew((l) => {
                BIACore.Web.Client.Post(API.URL(API.UPDATE), new[] { l }, false);
            }, new
            {
                ReportId = report.ReportId.Value,
                Status = "E",
                Comments = e.Message
            });
        }

        private void ReportComplete(MyReport report)
        {
            //BIACore.Web.Client.Post(API.URL(API.UPDATE), new[] {
            //    new {
            //        ReportId = report.ReportId.Value,
            //        Status = "C",
            //        Comments = string.Empty
            //    }
            //});

            System.Threading.Tasks.Task.Factory.StartNew((l) => {
                BIACore.Web.Client.Post(API.URL(API.UPDATE), new[] { l }, false);
            }, new
            {
                ReportId = report.ReportId.Value,
                Status = "C",
                Comments = string.Empty
            });
        }

        public virtual void ExportStart(MyReport report)
        {
        }

        public virtual void ExportEnd(MyReport report)
        {
        }

        /// <summary>
        /// Allows for custom sorting of all unprocessed reports by custom parameters.
        /// Defaults to FIFO.
        /// Note that this method will be run between every report.
        /// </summary>
        /// <param name="reports"></param>
        /// <returns></returns>
        public virtual List<MyReport> Sort(List<MyReport> reports)
        {
            return reports;
        }

        /// <summary>
        /// Guess at how long the report will take to generate, in milliseconds.
        /// </summary>
        /// <param name="report"></param>
        /// <returns></returns>
        public virtual int EstimateProcessingTime(MyReport report)
        {
            return 60 * 1000;
        }
        #endregion

        private string Prettify(TimeSpan time)
        {
            string result = string.Empty;

            if (time.TotalHours > 1)
                result += (int)time.TotalHours + "h ";
            if (time.Minutes > 0)
                result += time.Minutes + "m ";
            if (time.Seconds > 0)
                result += time.Seconds + "s ";

            return result.Trim();
        }

        private static ExportType FullyQualify(string name)
        {
            string type = name.Replace(" ", "");
            // check our type cache
            foreach (ExportType e in TypeCache)
            {
                if (string.Equals(e.Name, type))
                    return e;
            }

            // not in the cache, check the assemblies
            foreach (System.Reflection.Assembly a in AppDomain.CurrentDomain.GetAssemblies())
            {
                foreach (Type t in a.GetTypes())
                {
                    // if we see any of these values, it's a good bet we're not in the right assembly.
                    if (t.FullName.StartsWith("BIACore", StringComparison.InvariantCultureIgnoreCase)) break;
                    if (t.FullName.StartsWith("ClosedXML", StringComparison.InvariantCultureIgnoreCase)) break;
                    if (t.FullName.StartsWith("DocumentFormat", StringComparison.InvariantCultureIgnoreCase)) break;
                    if (t.FullName.StartsWith("Microsoft", StringComparison.InvariantCultureIgnoreCase)) break;
                    if (t.FullName.StartsWith("Newtonsoft", StringComparison.InvariantCultureIgnoreCase)) break;
                    if (t.FullName.StartsWith("System", StringComparison.InvariantCultureIgnoreCase)) break;
                    if (t.FullName.StartsWith("SpreadsheetLight", StringComparison.InvariantCultureIgnoreCase)) break;
                    // hey, check it out!
                    if (t.FullName.EndsWith(type))
                    {
                        ExportType e = new ExportType() { Assembly = a.FullName, Type = t, Name = type };
                        TypeCache.Add(e);
                        return e;
                    }
                }
            }
            return new ExportType() { Assembly = null, Type = null, Name = type };
        }

        private static BaseExport CreateReport(MyReport report)
        {
            try
            {
                ExportType type = FullyQualify(report.ReportType);

                BaseExport result = (BaseExport)Activator.CreateInstance(type.Type);

                result.ReportId = report.ReportId.Value;
                result.ReportParam = report.Parameters;
                result.ReportTitle = report.Description;

                if (string.IsNullOrEmpty(report.FileName))
                    report.FileName = string.Format("{0}_{3}_{1}.{2}", type.Name, report.ReportId, result.ReportType, DateTime.Now.ToString("yyyyMMddhhmm"));
                report.FileType = result.ReportType;
                return result;
            }
            catch (Exception e)
            {
                LogFactory.Error("Unable to create report of type {0}", report.ReportType);
                LogFactory.Exception(e);
                throw;
            }
        }

        public void UploadFile(int ReportId, string Filename, Stream file)
        {
            //BIACore.Web.Client.Post(API.URL(API.UPDATE), new[] {
            //    new {
            //        ReportId = ReportId,
            //        Comments = "Uploading..."
            //    }
            //});

            System.Threading.Tasks.Task.Factory.StartNew((l) => {
                BIACore.Web.Client.Post(API.URL(API.UPDATE), new[] { l }, false);
            }, new
            {
                ReportId = ReportId,
                Comments = "Uploading..."
            });

            BIACore.Web.Client.Upload(API.URL(API.UPLOAD) + "?ReportId=" + ReportId, Filename, file);
        }

    }
}
