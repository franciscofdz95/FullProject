<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UploadValidationTest.aspx.cs" Inherits="BIACore.Website.UploadValidationTest" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        .resultTitle {
            font-size: x-large;
            padding: 15px 0px;
        }
        .result {
            color: red;
            white-space: pre;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            Extension:
            <br />
            <asp:DropDownList runat="server" ID="listFileExtension" Width="150"></asp:DropDownList>
<%--            Valid Extension List:
            <br />
            <asp:TextBox runat="server" ID="txtValidExtensions" Text="xls,xlsx,doc,txt,csv" />--%>
            <br />
            <br />
            Max File Bytes:
            <br />
            <asp:TextBox runat="server" ID="txtMaxFileBytes" Width="150" Text="10000000" />
            <br />
            <br />
            <asp:FileUpload runat="server" ID="uplFileUpload" />
            <br />
            <asp:Button runat="server" ID="btnUpload" OnClick="btnUpload_Click" Text="Upload" />
            <asp:Panel runat="server" ID="pnlResult" Visible="false">
                <div class="resultTitle">Result:</div>
                <asp:label runat="server" ID="lblResult" CssClass="result"></asp:label>
            </asp:Panel>
        </div>
    </form>
</body>
</html>
