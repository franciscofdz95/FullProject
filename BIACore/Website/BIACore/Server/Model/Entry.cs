using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Threading.Tasks;

namespace BIACore.Server.Model
{
    public abstract class Entry
    {
        public void Insert()
        {
            Task.Factory.StartNew(Insert_SQL);
        }

        internal abstract void Insert_SQL();
    }
}