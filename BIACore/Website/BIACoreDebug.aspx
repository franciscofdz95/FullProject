<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="BIACoreDebug.aspx.cs" Inherits="BIACore.Website.BIACoreDebug" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <h1>Cache Variables</h1>
        <div>
            <asp:Label ID="lbl_Cache_Exists" runat="server" Text="Cache Exists: " />
            <asp:Label ID="val_Cache_Exists" runat="server" Text="" />
        </div>
        <div>
            <asp:Label ID="lbl_Cache_Count" runat="server" Text="Item Count: " />
            <asp:Label ID="val_Cache_Count" runat="server" Text="" />
        </div>
        <div>
            <asp:Label ID="lbl_Cache_PercMemLim" runat="server" Text="EffectivePercentagePhysicalMemoryLimit: " />
            <asp:Label ID="val_Cache_PercMemLim" runat="server" Text="" />
        </div>
        <div>
            <asp:Label ID="lbl_Cache_PrivByteLim" runat="server" Text="EffectivePrivateBytesLimit: " />
            <asp:Label ID="val_Cache_PrivByteLim" runat="server" Text="" />
        </div>
        <div runat="server" id="div_Cache_Items"></div>
    </form>
</body>
</html>
