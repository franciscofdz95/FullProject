<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="BIACore.Website.Default" %>

<!DOCTYPE html>
<html>
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=10" />
    <title>BIACore Utilities</title>
    <!-- BIACore -->
    <%: BIACore.Web.Optimization.Scripts.Render("{server}{baseurl}BIACore.min.js", "BIACore.js", BIACore.Web.CurrentContext.IsLocalHost()) %>
    <!-- Ext5 -->
    <%: BIACore.Web.Optimization.Scripts.Render("{server}/Library/extjs/5.1/ext-all.js", "{server}/Library/extjs/5.1/ext-all-debug.js") %>
    <!-- Ext5 Theme -->
    <%: BIACore.Web.Optimization.Scripts.Render("{server}/Library/extjs/5.1/packages/ext-theme-classic/build/ext-theme-classic.js") %>
    <%: BIACore.Web.Optimization.Links.Render("{server}/Library/extjs/5.1/packages/ext-theme-classic/build/resources/ext-theme-classic-all.css") %>
    <!-- Ext5 Charts -->
    <%: BIACore.Web.Optimization.Scripts.Render("{server}/Library/extjs/5.1/packages/sencha-charts/build/sencha-charts.js", "{server}/Library/extjs/5.1/packages/sencha-charts/build/sencha-charts-debug.js") %>
    <%: BIACore.Web.Optimization.Links.Render("{server}/Library/extjs/5.1/packages/sencha-charts/build/classic/resources/sencha-charts-all.css") %>
    <!-- BIACore.Ext requires -->
    <%: BIACore.Web.Optimization.Links.Render("{server}{baseurl}BIACore.Ext.css") %>
    <%: BIACore.Web.Optimization.Scripts.Render("{server}{baseurl}BIACore.Ext.min.js", "BIACore.Ext.js", BIACore.Web.CurrentContext.IsLocalHost()) %>

    <!-- Bundles! -->
    <%: System.Web.Optimization.Styles.Render( "~/bundle/css" )%>
    <%: System.Web.Optimization.Scripts.Render( "~/bundle/app" )%>

    <!-- Silk Icon Library -->
    <%: BIACore.Web.Optimization.Links.Render("{server}/Library/silkIcon/icon.css") %>
</head>
<body style="background-color: black;">
</body>
</html>
