using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Diagnostics;
using System.IO;

using BIACore.Log;

namespace BIACore.Agent.Export
{
    public abstract class PhantomExport : BaseExport
    {
        public override string ReportType { get { return "pdf"; } }

        public virtual string ViewportSize { get { return "1100*1605"; } }
        public virtual string PaperSize { get { return "A4"; } }

        public abstract string URL { get; }

        private string _file = Path.GetTempFileName();
        internal string TempFile { get { return _file; } }

        public override Stream Generate()
        {
            MemoryStream result = new MemoryStream();
            try
            {
                LoadData();
                ConvertToPDF();

                using (FileStream input = new FileStream(TempFile, FileMode.Open))
                {
                    input.CopyTo(result);
                }

                result.Position = 0;
                return result;
            }
            catch (Exception e)
            {
                result.Dispose();
                LogFactory.Exception(e);
                throw;
            }
            finally
            {
                File.Delete(TempFile);
            }
        }

        public abstract void LoadData();

        public void ConvertToPDF()
        {
            LogFactory.Debug("Agent: starting phantomjs export {0}", ReportName);
            try
            {
                string path = Path.GetTempPath(),
                    phantom = Path.Combine(path, "phantomjs.exe"),
                    pdfize = Path.Combine(path, "pdfize.js");
                // write out our webkit renderer
                File.WriteAllBytes(phantom, BIACore.Agent.Properties.Resources.phantomjs);
                File.WriteAllText(pdfize, BIACore.Agent.Properties.Resources.pdfize);

                // spin up the process to snag the pdf
                Process p = new Process();
                // start from the correct working directory.
                p.StartInfo.FileName = phantom;
                p.StartInfo.Arguments = string.Format("\"{0}\" \"{1}\" \"{2}\" {3} {4}", pdfize, URL, TempFile, ViewportSize, PaperSize);
                p.StartInfo.UseShellExecute = false;
                p.Start();
                p.WaitForExit();

                // clean up after ourself
                File.Delete(phantom);
                File.Delete(pdfize);
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
            finally { LogFactory.Debug("Agent: completed phantomjs export {0}", ReportName); }
        }
    }
}
