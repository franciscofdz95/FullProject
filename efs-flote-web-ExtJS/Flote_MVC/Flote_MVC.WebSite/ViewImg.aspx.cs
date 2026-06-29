using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Flote.WebSite
{
    public partial class ViewImg : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            System.Drawing.Image TheImg = new App.Files.TIF(Request.QueryString["FilePath"]).GetTiffImageThumb(System.Convert.ToInt16(Request.QueryString["Pg"]), System.Convert.ToInt16(Request.QueryString["Height"]), System.Convert.ToInt16(Request.QueryString["Width"]));
            if (TheImg != null)
            {
                switch (Request.QueryString["Rotate"])
                {
                    case "90":
                        TheImg.RotateFlip(System.Drawing.RotateFlipType.Rotate90FlipNone);
                        break;
                    case "180":
                        TheImg.RotateFlip(System.Drawing.RotateFlipType.Rotate180FlipNone);
                        break;
                    case "270":
                        TheImg.RotateFlip(System.Drawing.RotateFlipType.Rotate270FlipNone);
                        break;
                }

                Response.ContentType = "image/jpeg";
                TheImg.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                TheImg.Dispose();
            }
        }
    }
}