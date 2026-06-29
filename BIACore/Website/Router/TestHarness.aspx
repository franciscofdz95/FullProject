<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TestHarness.aspx.cs" Inherits="BIACore.Website.Router.TestHarness" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body runat="server">
    <%--<form id="form1" runat="server">
        <asp:TextBox ID="txtPostData" runat="server" TextMode="MultiLine" Rows="40" Width="600px"></asp:TextBox>
        <br />
        <input type="hidden" name="SignedRequest" value="" runat="server" id="SignedRequest" />
        <asp:Button ID="BuildFormData" runat="server" OnClick="BuildFormData_Click" Text="Build Test Data" PostBackUrl="./TestHarness.aspx" />
        <input type="submit" value="submit" />        
        <br />
        <asp:TextBox ID="txtDisplayPostData" runat="server" Enabled="false" Width="100%" TextMode="MultiLine" Wrap="true" Rows="10"></asp:TextBox>
    </form>--%>
    <form id="form2" runat="server">
        <input type="hidden" name="signed_request" value="" runat="server" id="signed_request" />
        <input type="submit" value="Test Salesforce Canvas Router" />        
    </form>
</body>
</html>
