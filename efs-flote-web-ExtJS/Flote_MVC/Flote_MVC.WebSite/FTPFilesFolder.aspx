<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="FTPFilesFolder.aspx.cs" Inherits="Flote.WebSite.FTPFilesFolder" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <h2>Click region to view APUT files</h2>                    
            <asp:PlaceHolder ID="FTPFolderPlaceHolder" runat="server"></asp:PlaceHolder>  
        </div>
    </form>
</body>
</html>
