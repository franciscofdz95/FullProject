using System;
using System.ComponentModel;
using System.Web.UI;

namespace BIACore.Web.Controls
{
    /// <summary>
    /// ASPx control for adding a server-invariant &lt;link&gt; html item.
    /// </summary>
    [ToolboxData("<{0}:link runat=\"server\"></{0}:link>")]
    [Description("Smart link tag.")]
    [ToolboxItem(true)]
    [Obsolete("Use BIACore.Web.Optimization.Links.Render() instead")]
    public class Link : Resource
    {
        public Link() { }

        public string Render()
        {
            return string.Format(@"<link rel='stylesheet' type='text/css' href='{0}'>", Uri);
        }

        protected override void Render(HtmlTextWriter writer)
        {
            writer.Write(Render());
            base.Render(writer);
        }
    }
}