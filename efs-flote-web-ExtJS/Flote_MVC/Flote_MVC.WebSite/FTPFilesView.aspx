<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="FTPFilesView.aspx.cs" Inherits="Flote.WebSite.FTPFilesView" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
             <h2>Click <asp:Label ID="selectedFolderLable" Text="" runat="server"></asp:Label>  
                  - APUT files to download</h2>  
            <asp:PlaceHolder ID="FTPFilesPlaceHolder" runat="server"></asp:PlaceHolder>  
        </div>
    </form>
</body>
</html>
