using System;
using System.ComponentModel;
using System.Web.UI;


namespace BIACore.Web.Controls
{
    /// <summary>
    /// ASPx control for adding a server-invariant &lt;script&gt; html item.
    /// </summary>
    [ToolboxData("<{0}:script runat=\"server\"></{0}:script>")]
    [Description("Smart script tag.")]
    [ToolboxItem(true)]
    [Obsolete("Use BIACore.Web.Optimization.Scripts.Render() instead")]
    public class Script : Resource
    {
        public Script() { }

        public string Render()
        {
            return string.Format(@"<script type='application/javascript' src='{0}'></script>", Uri);
        }

        protected override void Render(HtmlTextWriter writer)
        {
            writer.Write(Render());

            base.Render(writer);
        }
    }
}