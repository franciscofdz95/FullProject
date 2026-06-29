<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="BIACore.Website.Router.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        .Card {
            box-shadow: rgba(0, 0, 0, 0.137255) 0px 2px 2px 1px, rgba(0, 0, 0, 0.117647) 0px 1px 5px 2px, rgba(0, 0, 0, 0.2) 0px 3px 1px 0px;    
            border-radius: 3px;
            padding: 8px;
        }
        .BIASecurityContainer {
            text-align: center;
            font-size: 16px;
        }
        .BIASecurityContainer > * {
            text-align: left;
            width: 600px;
            margin-left: auto;
            margin-right: auto;
            word-break: break-word;
        }
        .BIASecurityErrorContainer {
            background-color: #e6e6e6;
            padding: 5px;
            position: relative;
            height: 300px;
        }
        .BIASecurityErrorHeader {
            padding: 10px;
            font-size: 18px;
            color: white;
            background-color: #672B08;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
            padding: 5px 10px;
            line-height: 30px;
        }
        .BIASecurityErrorText {
            margin: 10px 20px;
            line-height: 24px;
        }
        .BIASecurityErrorCloseWindow {
            background-color: #157fcc;
            color: #fff;
            border-radius: 10px;
            padding: 5px 20px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            width: 200px;
            position: absolute;
            bottom: 10px;
            left: 180px;
        }
        .BIASecurityErrorMoreDetails, .BIASecurityErrorLessDetails {
            color: #157fcc;
            text-decoration: underline;
            margin-top: 10px;
            margin-bottom: 10px;
            text-align: center;
            cursor: pointer;
        }
        .BIASecurityMessage, .BIASecurityRedirectMessage {
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="BIASecurityContainer">
        <div class="BIASecurityErrorContainer Card" id="BIASecurityErrorContainer" runat="server" visible="false">
            <div class="BIASecurityErrorHeader">BIA Security - Error (Router)</div>
            <div class="BIASecurityErrorText" id="BIASecurityErrorText" runat="server"></div>
            <div class="BIASecurityErrorCloseWindow" onclick="window.close();">Close Window</div>
        </div>
        <div class="BIASecurityErrorMoreDetails" id="BIASecurityErrorMoreDetails" onclick="ShowHideErrorDetails()" runat="server" visible="false">More Detail</div>
        <div class="BIASecurityErrorLessDetails" id="BIASecurityErrorLessDetails" onclick="ShowHideErrorDetails()" runat="server" style="display:none;">Less Detail</div>
        <div id="BIASecurityMessage" runat="server" visible="false" style="display:none;"></div>
        <br />
        <form id="form2" runat="server" target="_blank">
            <asp:Button ID="btnRedirect" runat="server" Text="Redirect to URL" Visible="false" value="submit"/>
        </form>
        <div id="BIASecurityRedirectMessage" runat="server" visible="false"></div>
    </div>
    <script>
        function ShowHideErrorDetails() {
            document.getElementById('<%= BIASecurityMessage.ClientID %>').style.display = (document.getElementById('<%= BIASecurityMessage.ClientID %>').style.display == 'block' ? 'none' : 'block');
            document.getElementById('<%= BIASecurityErrorMoreDetails.ClientID %>').style.display = (document.getElementById('<%= BIASecurityMessage.ClientID %>').style.display == 'block' ? 'none' : 'block');
            document.getElementById('<%= BIASecurityErrorLessDetails.ClientID %>').style.display = (document.getElementById('<%= BIASecurityMessage.ClientID %>').style.display == 'block' ? 'block' : 'none');
        }
    </script>
</body>
</html>
