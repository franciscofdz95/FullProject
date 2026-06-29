using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Web.Caching;

namespace BIACore.Website
{
    public partial class BIACoreDebug : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Cache _cache = System.Web.HttpRuntime.Cache;
            if(_cache == null)
            {
                val_Cache_Exists.Text = "FALSE";
                val_Cache_Count.Text = "";
                val_Cache_PercMemLim.Text = "";
                val_Cache_PrivByteLim.Text = "";
                div_Cache_Items.InnerHtml = "";
                return;
            }

            val_Cache_Exists.Text = "TRUE";
            val_Cache_Count.Text = _cache.Count.ToString();
            val_Cache_PercMemLim.Text = _cache.EffectivePercentagePhysicalMemoryLimit.ToString() + "% memory left for application";
            val_Cache_PrivByteLim.Text = _cache.EffectivePrivateBytesLimit.ToString() + " bytes available to cache";



            if(BIACore.Settings.Config.Debug) {
                string item_string = "";
                System.Collections.IDictionaryEnumerator en = _cache.GetEnumerator();
                while(en.MoveNext())
                {
                    item_string += en.Key + ": " + en.Value + "<br>";
                }
                div_Cache_Items.InnerHtml = item_string;
            }
            else
            {
                div_Cache_Items.InnerHtml = "Cache items not shown in production..";
            }
        }
    }
}