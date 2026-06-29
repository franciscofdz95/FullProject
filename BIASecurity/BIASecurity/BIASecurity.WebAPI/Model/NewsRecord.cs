using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;


namespace BIASecurity.WebAPI.Model
{
    public class NewsRecord : extjs.Parameter
    {
        public int? NewsId { get; set; }
        public string MessageText { get; set; }
        public bool Active { get; set; }
        public int MessageTypeId { get; set; }
        public string MessageDate { get; set; }

        public NewsRecord() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (NewsId != null) args.Add(new DBParameter("@newsId", DbType.AnsiString, NewsId));
            if (!string.IsNullOrEmpty(MessageDate)) args.Add(new DBParameter("@messageDate", DbType.AnsiString, Convert.ToDateTime(MessageDate).ToString("MM/dd/yyyy")));
            args.Add(new DBParameter("@messageTypeId", DbType.AnsiString, MessageTypeId));
            args.Add(new DBParameter("@messageText", DbType.AnsiString, MessageText));
            
            args.Add(new DBParameter("@active", DbType.AnsiString, Active));          

            return args.ToArray();
        }
    }
}
