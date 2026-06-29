using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;

namespace BIACore.Server.Controller
{
    public partial class CodeReviewController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("CodeReviewTests")]
        public object CodeReviewTests_Post([FromBody] dynamic request)
        {
            //DateTime start = DateTime.UtcNow;
            try
            {
                return Uncached.CodeReviewTests();
            }
            catch (Exception e)
            {
                LogFactory.Message(String.Format("CodeReviewTests = Request: {0}", Newtonsoft.Json.JsonConvert.SerializeObject(request)));
                LogFactory.Exception(e);
                throw;
            }
            //finally { LogFactory.Performance("biacore/api/application", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("LogCodeReview")]
        public void LogCodeReview_Post([FromBody] dynamic request)
        {
            //DateTime start = DateTime.UtcNow;
            try
            {
                if (request != null)
                {
                    if (request.records != null)
                    {
                        foreach (dynamic record in request.records)
                        {
                            LogCodeReview_Save(record);
                        }
                    }
                    else
                    {
                        LogCodeReview_Save(request);
                    }
                }
            }
            catch (Exception e)
            {
                LogFactory.Message(String.Format("LogCodeReview = Request: {0}", Newtonsoft.Json.JsonConvert.SerializeObject(request)));
                LogFactory.Exception(e);
                throw;
            }
            //finally { LogFactory.Performance("biacore/api/application", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        private void LogCodeReview_Save(dynamic record)
        {
            if (record != null)
            {
                Uncached.LogCodeReview(record.ProjectName != null ? record.ProjectName.Value.ToString() : null,
                        record.UserId != null ? record.UserId.Value.ToString() : null,
                        record.CodeReviewDT != null ? record.CodeReviewDT.Value.ToString() : null,
                        record.CRCode != null ? record.CRCode.Value.ToString() : null,
                        record.Description != null ? record.Description.Value.ToString() : null,
                        record.FileName != null ? record.FileName.Value.ToString() : null,
                        record.LineNumber != null ? record.LineNumber.Value.ToString() : null
                    );
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("CodeReviewReferences")]
        public object CodeReviewReferences([FromBody] dynamic request)
        {
            try
            {
                return Uncached.CodeReviewReferences();
            }
            catch (Exception e)
            {
                LogFactory.Message(String.Format("CodeReviewReferences = Request: {0}", Newtonsoft.Json.JsonConvert.SerializeObject(request)));
                LogFactory.Exception(e);
                throw;
            }
        }
    }
}