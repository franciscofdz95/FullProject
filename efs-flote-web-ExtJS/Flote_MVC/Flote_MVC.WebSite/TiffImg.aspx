<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TiffImg.aspx.cs" Inherits="Flote.WebSite.TiffImg" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<script language="javascript" type="text/javascript" src="https://BIAAlpha.inside.ups.com/Library/jquery/3.6/jquery-3.6.4.min.js"></script>
<script language="javascript" type="text/javascript" src="tiffImg.js"></script>
<head runat="server">
    <title>View Scanned Document</title>
</head>
<body>
    <form id="form1" runat="server" method="post">
        <div>
            <asp:Table runat="server" ID="_tblImgs" Height="100%" Width="100%">
                <asp:TableRow>
                    <asp:TableCell Width="15%" BorderColor="Black" BorderStyle="Solid" BorderWidth="2">
                        <asp:Label runat="server" ID="_lblClickNote" Text="Click to view bigger" Font-Size="Small" /><br />
                        <asp:PlaceHolder runat="server" ID="_plcImgsThumbs" />
                        <br />
                        <asp:PlaceHolder runat="server" ID="_plcImgsThumbsPager" />
                    </asp:TableCell>
                    <asp:TableCell Width="85%">
                        <asp:PlaceHolder runat="server" ID="_plcBigImg" />
                        <br />
                    </asp:TableCell>
                </asp:TableRow>
            </asp:Table>
        </div>
    </form>

    <%--<script language="javascript" type="text/javascript">
         
        function ChangePg(Pg) {
            Src = 'ViewImg.aspx?View=1&FilePath=' + GetBigSrc("FilePath") + "&Pg=" + Pg + "&Height=" + GetBigSrc("Height") + "&Width=" + GetBigSrc("Width");
            SrcBig = 'ViewImg.aspx?View=1&FilePath=' + GetBigSrc("FilePath") + "&Pg=" + Pg + "&Height=" + 1000 + "&Width=" + 1000;
            SrcRevert = 'ViewImg.aspx?View=1&FilePath=' + GetBigSrc("FilePath") + "&Pg=" + Pg + "&Height=" + 600 + "&Width=" + 600;
            document.getElementById('_imgBig').src = SrcBig;            
        }

        function GetBigSrc(Qrystr) 
        {
            var Qry = document.getElementById('_imgBig').src;
            //alert(Qry);
            gy = Qry.split("&");
            for (i=0;i<gy.length;i++) 
            {
                ft = gy[i].split("=");
                if (ft[0] == Qrystr) 
                    return ft[1];
            }
        }
        
    </script>--%>
</body>
</html>
