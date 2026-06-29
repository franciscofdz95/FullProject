<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Support.aspx.cs" Inherits="BIACore.Website.Support" %>

<!DOCTYPE html>
<html>
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name = "viewport" content = "user-scalable = no, width = 1280">
    <title>BIA Support</title>

    <!-- page css -->
    <%: BIACore.Web.Optimization.Links.Render("css/Support.css") %>
    <!-- page javascript -->
    <!--<%: BIACore.Web.Optimization.Scripts.Render("js/Support.js") %>-->

    <script type="text/javascript">
      var jsver = 1.0;
    </script>
    <script language="Javascript1.1">
      jsver = 1.1;
    </script>
    <script language="Javascript1.2">
      jsver = 1.2;
    </script>
    <script language="Javascript1.3">
      jsver = 1.3;
    </script>
    <script language="Javascript1.4">
      jsver = 1.4;
    </script>
    <script language="Javascript1.5">
      jsver = 1.5;
    </script>
    <script language="Javascript1.6">
      jsver = 1.6;
    </script>
    <script language="Javascript1.7">
      jsver = 1.7;
    </script>
    <script language="Javascript1.8">
      jsver = 1.8;
    </script>
    <script language="Javascript1.9">
      jsver = 1.9;
    </script>
</head>
<body>
    <div class="Card">
        <div class="Title">
            BIA Troubleshooting Support Page
        </div>
        <div class="Description">
            This page is designed to assist BIA in troubleshooting application support issues. You will be requested by BIA to run this page and then extract a screenshot to either email or attach to a BIA Support Submission.
            To create a screenshot, you can press ALT+PrtSc, open a new Word or Powerpoint file and press CTRL+V to paste the image.
        </div>
    </div>
    <div class="TestInfo">
        <div class="Card FloatLeft General">
            <div class="CardTitle">General</div>
            <div class="InfoField">
                <div class="Label">BIA Server</div>
                <div class="Value" runat="server" id="GeneralBIAServer">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Server Date/Time</div>
                <div class="Value" runat="server" id="GeneralServerDateTime">Testing</div>   
                <div class="ClearFloat"></div>             
            </div>
            <div class="InfoField">
                <div class="Label">Client Date/Time</div>
                <div class="Value" runat="server" id="GeneralClientDateTime">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Client IP Address</div>
                <div class="Value" runat="server" id="GeneralIP">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Referrer</div>
                <div class="Value" runat="server" id="GeneralReferrer">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">User Agent</div>
                <div class="Value" runat="server" id="GeneralBrowserUserAgent">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Browser Version</div>
                <div class="Value" runat="server" id="GeneralBrowserVersion">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Compatibility</div>
                <div class="Value" runat="server" id="GeneralCompatibility">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Document Mode</div>
                <div class="Value" runat="server" id="GeneralDocumentMode">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField DeviceProperty">
                <div class="Label">Viewport Resolution</div>
                <div class="Value" runat="server" id="GeneralViewportResolution">Testing</div>
                <div class="ClearFloat"></div>
            </div>
        </div>
        <div class="Card FloatLeft Cookies">
            <div class="CardTitle">Cookies</div>
            <div class="InfoField">
                <div class="Label">BIASID</div>
                <div class="Value" runat="server" id="CookiesBIASession">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">BIACID</div>
                <div class="Value" runat="server" id="CookiesBIASecHash">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">CFID</div>
                <div class="Value" runat="server" id="CookiesCFID">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">CFToken</div>
                <div class="Value" runat="server" id="CookiesCFToken">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">BIA_VALIDATIONCOUNT</div>
                <div class="Value" runat="server" id="CookiesBIAValidationCount">Testing</div>
                <div class="ClearFloat"></div>
            </div>
        </div>
        <div class="ClearFloat"></div>
        <div class="Card FloatLeft Session">
            <div class="CardTitle">Session</div>
            <div class="InfoField">
                <div class="Label">SessionId</div>
                <div class="Value" runat="server" id="SessionId">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">UserId</div>
                <div class="Value" runat="server" id="SessionUserId">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <%--<div class="InfoField">
                <div class="Label">BIA Server</div>
                <div class="Value" runat="server" id="SessionBIAServer">Testing</div>
                <div class="ClearFloat"></div>
            </div>--%>
            <div class="InfoField">
                <div class="Label">Applications</div>
                <div class="Value" runat="server" id="SessionAppCode">Testing</div>
                <div class="ClearFloat"></div>
            </div>
        </div>
        <div class="Card FloatLeft BIACoreValidation">
            <div class="CardTitle">BIACore Validation</div>
            <div class="InfoField">
                <div class="Label">Version</div>
                <div class="Value" runat="server" id="BIACoreValidationVersion">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Loaded</div>
                <div class="Value" runat="server" id="BIACoreValidationLoaded">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">BIACore WebAPI</div>
                <div class="Value" runat="server" id="BIACoreValidationWebAPI">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">BIA.Ajax</div>
                <div class="Value" runat="server" id="BIACoreValidationAjax">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField DeviceProperty">
                <div class="Label">Device Type</div>
                <div class="Value" runat="server" id="BIACoreValidationDeviceType">Testing</div>
                <div class="ClearFloat"></div>
            </div>
        </div>
        <div class="ClearFloat"></div>
        <div class="Card FloatLeft JavascriptValidation">
            <div class="CardTitle">JavaScript Validation</div>
            <div class="InfoField">
                <div class="Label">Version</div>
                <div class="Value" runat="server" id="JavascriptVersion">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <%--<div class="InfoField">
                <div class="Label">ECMA Version</div>
                <div class="Value" runat="server" id="JavascriptECMAVersion">Testing</div>
                <div class="ClearFloat"></div>
            </div>--%>
            <div class="InfoField">
                <div class="Label">JavaScript Available</div>
                <div class="Value" runat="server" id="JavascriptLoaded">Testing</div>
                <div class="ClearFloat"></div>
            </div>            
            <div class="InfoField">
                <div class="Label">Object Create Test</div>
                <div class="Value" runat="server" id="JavascriptValidationObjectCreate">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Object Define Property Test</div>
                <div class="Value" runat="server" id="JavascriptValidationObjectDefineProperty">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Array IndexOf Test</div>
                <div class="Value" runat="server" id="JavascriptValidationArrayIndexOf">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Array isArray Test</div>
                <div class="Value" runat="server" id="JavascriptValidationArrayIsArray">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Strict Reserve Words Test</div>
                <div class="Value" runat="server" id="JavascriptValidationStrictReserverWords">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField LastRow">
                <div class="Label">JSON Type Test</div>
                <div class="Value" runat="server" id="JavascriptValidationJSONType">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">JavaScript ECMA5 Or Newer</div>
                <div class="Value" runat="server" id="JavascriptValidationECMA5">Testing</div>
                <div class="ClearFloat"></div>
            </div>
        </div>
        <div class="Card FloatLeft ExtJSValidation">
            <div class="CardTitle">ExtJS Validation</div>
            <div class="InfoField">
                <div class="Label">Version</div>
                <div class="Value" runat="server" id="ExtJSValidationVersion">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Loaded</div>
                <div class="Value" runat="server" id="ExtJSValidationLoaded">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">Create Component</div>
                <div class="Value" runat="server" id="ExtJSValidationCreateComponent">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField">
                <div class="Label">WebAPI</div>
                <div class="Value" runat="server" id="ExtJSValidationWebAPI">Testing</div>
                <div class="ClearFloat"></div>
            </div>
            <div class="InfoField DeviceProperty">
                <div class="Label">Device Type</div>
                <div class="Value" runat="server" id="ExtJSValidationDeviceType">Testing</div>
                <div class="ClearFloat"></div>
            </div>
        </div>
        <div class="ClearFloat"></div>
        <div class="Card Explanation" runat="server" id="FailureExplanationContainer" style="display:none;">
            <div class="CardTitle">Failure Explanation</div>
            <div class="FailureExplanation" runat="server" id="FailureExplanation" hidden="hidden"></div>
        </div>
    </div>
    
    <asp:PlaceHolder ID="GeneralJS" runat="server"></asp:PlaceHolder>
    <asp:PlaceHolder ID="JavascriptValidationJS" runat="server"></asp:PlaceHolder>
    <asp:PlaceHolder ID="BIACoreValidationJS" runat="server"></asp:PlaceHolder>
    <asp:PlaceHolder ID="ExtJSValidationJS" runat="server"></asp:PlaceHolder>
    <asp:PlaceHolder ID="FailreExplanationJS" runat="server"></asp:PlaceHolder>
</body>
</html>
