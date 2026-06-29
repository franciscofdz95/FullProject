<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Spreadsheet.aspx.cs" Inherits="BIACore.Website.Exporter.Spreadsheet" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=10" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title></title>

    <!-- BIACore -->
    <%: BIACore.Web.Optimization.Scripts.Render("{server}{baseurl}BIACore.min.js", "{server}{baseurl}/BIACore.js") %>
    <!-- Ext5 -->
    <%: BIACore.Web.Optimization.Scripts.Render("{server}/Library/extjs/5.1/ext-all.js", "{server}/Library/extjs/5.1/ext-all-debug.js") %>
    <!-- Ext5 Theme -->
    <%: BIACore.Web.Optimization.Scripts.Render("{server}/Library/extjs/5.1/packages/ext-theme-neptune/build/ext-theme-neptune.js") %>
    <%: BIACore.Web.Optimization.Links.Render("{server}/Library/extjs/5.1/packages/ext-theme-neptune/build/resources/ext-theme-neptune-all.css") %>
    <!-- BIACore.Ext requires -->
    <%: BIACore.Web.Optimization.Links.Render("{server}{baseurl}BIACore.Ext.css") %>
    <%: BIACore.Web.Optimization.Scripts.Render("{server}{baseurl}BIACore.Ext.min.js", "{server}{baseurl}BIACore.Ext.js") %>

    <!-- Bundles! -->
    <%: System.Web.Optimization.Styles.Render( "~/bundle/css" )%>
    <%: System.Web.Optimization.Styles.Render( "~/Exporter/bundle/css" )%>
    <%: System.Web.Optimization.Scripts.Render( "~/Exporter/bundle/app" )%>

</head>
<body>
    <form id="form1" runat="server">
        <asp:HiddenField ID="fld_type" Value="" runat="server" />
        <asp:HiddenField ID="fld_filename" Value="" runat="server" />
        <asp:HiddenField ID="fld_sheetTitle" Value="" runat="server" />
        <asp:HiddenField ID="fld_appUrlBase" Value="" runat="server" />
        <asp:HiddenField ID="fld_filterDisplay" Value="" runat="server" />
        <asp:HiddenField ID="fld_storeUrl" Value="" runat="server" />
        <asp:HiddenField ID="fld_storeExtraParams" Value="" runat="server" />
        <asp:HiddenField ID="fld_columns" Value="" runat="server" />
        <asp:HiddenField ID="fld_dataTypeFormats" Value="" runat="server" />
        <asp:HiddenField ID="fld_downloadId" Value="" runat="server" />
        <asp:HiddenField ID="fld_downloadAttempt" Value="" runat="server" />
    </form>
</body>
</html>
