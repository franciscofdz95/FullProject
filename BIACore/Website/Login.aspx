<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="BIACore.Website.Login" %>

<!DOCTYPE html>
<html>
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name = "viewport" content = "user-scalable = no, width = 550">
    <title>BIA Secure Router</title>

    <!-- BIACore -->
    <%: BIACore.Web.Optimization.Scripts.Render("{server}{baseurl}BIACore.min.js", "BIACore.js") %>

    <!-- page css -->
    <%: BIACore.Web.Optimization.Links.Render("css/Login.css", null, false) %>
    <!-- page javascript -->
    <%: BIACore.Web.Optimization.Scripts.Render("js/Login.js","js/Login.js", false) %>

<%--    <script type="text/javascript">
        BIACore.Header.inject('BIAHeader', { showButtonBar: false });
    </script>--%>
</head>
<body class="biacore2">
    <div style="width:100%;height:62px;">
        <div id="BIAHeader"></div>
    </div>

    <div runat="server" id="loginWindow" class="loginContents">
        <div class="Card loginBox" style="">        
            <div class="newLogin">
                <div class="newHeader">BIA Secured Login</div>
                <div style="height:10px;">&nbsp;</div>
                <div id="BIA_AppCode"></div>
                <div class="idField">
                    <label for="BIA_Login">ID</label>
                    <input id="BIA_Login" type="text" autofocus disabled /><br />
                    <i id="BIA_Login_Bad" class="fa fa-times-circle errorColor" style="float:right; display:none;"></i>
                    <i id="BIA_Login_Warning" class="fa fa-exclamation-triangle warningColor" style="float:right; display:none; cursor:pointer;"></i>
                    <i id="BIA_Login_Good" class="fa fa-check-circle" style="color:green; float:right; display:none;"></i>
                    <i id="BIA_Login_Loading" class="fa fa-spinner fa-pulse" style="color:#3386c2; float:right; display:none;"></i>
                </div>
                <div class="pwField">
                    <label for="BIA_Pass">Password</label>
                    <input id="BIA_Pass" type="password" disabled /><br />
                    <i id="BIA_Pass_Bad" class="fa fa-times-circle errorColor" style="float:right; display:none;"></i>
                </div>
                <div style="clear:both;"></div>
                <button id="login" type="button" disabled class="ContainerButton">Login</button>
            </div>
            <div class="messages">
                <div class="newError errorColor"></div>
                <div class="info"></div>
            </div>
            <div class="information">
                <!--<a href="#" id="RequestIdTrigger">Request User ID</a> | -->
                <a href="#" id="ForgotIdTrigger">Forgot ID</a> | 
                <a href="#" id="ForgotPassTrigger">Forgot Password</a> | 
                <a href="https://compliance.inside.ups.com/compliance/apps/web_content/b_IUSC.cfm" target="_seccomp" style="color: maroon;">UPS Information Use and Security Compliance</a>
            </div>
        </div>
        <div class="Card tempMessage infoMessageBox" >
            <i class="fa fa-exclamation-triangle" style="float:left; color: orange; padding-right: 10px; font-size:3.5em;"></i>
            <span>Please login with your Active Directory (AD) ID unless you are using a known shared profile.</span>
            <ul style="font-weight:normal; line-height: 18px; margin-top: 15px;">            
                <li style="margin-bottom:5px;">Use your AD ID and Password to login to BIA</li>
                <li style="margin-bottom:5px;">Using your Employee ID or old BIA User ID will no longer work</li>                
            </ul>
            If you have problems logging in with your AD ID contact <a href="/bia/apps/biasupport.cfm">BIA Support</a>.
        </div>
    </div>
    
    <div class="newFooter">
        Copyright ©<%= DateTime.Now.Year %>, United Parcel Service of America, Inc. All Rights Reserved.
    </div>
    <div id="RequestId" class="login-dialog">
        To access BIA applications, you must first create a BIA user profile.
        <ol>
            <li>Login with your Active Directory(AD)/Email login.</li>
            <li>On the second login screen click on the "Create New User Profile" link.</li>
            <li>Complete the New User Profile screen and then click submit.</li>
            <li>Request application access, click on the application from the BIA Reports page and complete the access request form.</li>
        </ol>
        <i>Access to BIA is granted by requesting permission to each individual application.</i>
    </div>

    <div id="ForgotId" class="login-dialog">
        BIA applications use your Active Directory(AD)/Email login for authentication.<br />
        <br />
        Hint: If your Email ID is <b>US/nat1ups</b> then use <b>nat1ups</b> as your ID.
    </div>

    <div id="ForgotPass" class="login-dialog">
        BIA applications use your Active Directory(AD)/Email login for authentication.<br />
        <br />
        If you have forgotten your AD password go to the <a href="https://datasec.inside.ups.com/datasecurity/content/" target="_datasec" style="color: darkblue;">Data Security Page</a>.<br />
        <br />
        <%--If you have not migrated to AD yet, please go to the <a href="javascript:ForgotPasswordLegacy();" onMouseOver="fnMaskStatus('Forgot Password');return true;" onMouseOut="fnMaskStatus('');return true;" style="color:darkblue;">Forgot Password Page</a>.--%>
    </div>
    
    <div id="RequestAccess" class="login-dialog">
        1. You have completed the first step of requesting access via APRS<br />
        2. You must now request further access within the BIA security application<br />
        <p><b>OR</b></p>
        1. You are a Freight user who is no longer allowed to view this application.<br />

        Would you like to request access?<br />
    </div>
    
    <div id="AccessRequested" class="login-dialog">
        1. You have completed the first step of requesting access via APRS<br />
        2. The second step is to get approval from the BIA security application and that request is pending<br />
        <p><b>OR</b></p>
        1. You are a Freight user who is no longer allowed to view this application.<br />
    </div>

    <div id="Offline" class="login-dialog">
        The requested application is currently offline:<br />
        <div id="AppOfflineMsg" style="display:none; color: red; margin: 10px 0px 10px 20px;"></div>
        Press 'OK' to be redirected to the reports page.<br />
    </div>

    <div id="NewUser" class="login-dialog">
        You appear to be a new user.<br />
        Press 'OK' to be redirected to the New User Profile page.<br />
    </div>

    <div id="ProblemMessage" class="login-dialog">
        We experienced an error during authentication.<br />
        Please contact <a href="mailto:bia@ups.com?subject=Azure Employee ID Error">bia@ups.com</a>.<br />
    </div>

    <form id="frm_postback" runat="server" ClientIDMode="Static" class="infoMessageBox">
        <asp:ScriptManager ID="ScriptManager1" runat="server" ClientIDMode="Static"></asp:ScriptManager>
        <asp:UpdatePanel runat="server" ID="udp_AuthForm" ClientIDMode="Static" EnableViewState="true" ViewStateMode="Enabled" UpdateMode="Conditional">
            <ContentTemplate>
                <%-- Fields for Init Status & Info --%>
                <asp:HiddenField ID="fld_rt" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_appcode" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_appcodealt" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_st" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_islh" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_sstatus" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_usessl" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_apponline" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_includeRedirectInfo" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_appRedirectURI" Value="" runat="server" ClientIDMode="Static" />

                <%-- Fields for Login Auth --%>
                <asp:HiddenField ID="fld_un" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_ac" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_source" Value="" runat="server" ClientIDMode="Static" />

                <%-- Fields for Auth Result --%>
                <%-- Error, Lockout, Timeout, LoginAs, NoAccess, Pending, Offline, AppOfflineMsg, NewUser --%>
                <asp:HiddenField ID="fld_Error" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_Lockout" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_Timeout" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_LoginAs" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_NoAccess" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_FirstName" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_LastName" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_User" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_Pending" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_Offline" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_AppOfflineMsg" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_NewUser" Value="" runat="server" ClientIDMode="Static" />
                <asp:HiddenField ID="fld_adid" Value="" runat="server" ClientIDMode="Static" />
            </ContentTemplate>
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="lnk_FormSubmit" EventName="Click" />
            </Triggers>
        </asp:UpdatePanel>
        <asp:Button ID="lnk_FormSubmit" runat="server" OnClick="lnk_FormSubmit_Click" style="display:none;" />
        <%--<div class="Card infoMessageBox BIAMessageContainer">
            <div class="BIAMessageTitle newHeader">BIA News and Alerts</div>
            <div class="BIAMessages">
                <asp:Repeater ID="rpt_BIAMessages" runat="server" ClientIDMode="Static">                
                    <ItemTemplate>
                        <div class="BIAMessageItem BIAMessage<%# ((BIACore.Server.Model.BIAMessage)Container.DataItem).MessageTypeClass %>">
                            <span class="BIAMessageItemType"><%# ((BIACore.Server.Model.BIAMessage)Container.DataItem).MessageTypeString %></span> <%# ((BIACore.Server.Model.BIAMessage)Container.DataItem).MessageDateDisplay %><%# ((BIACore.Server.Model.BIAMessage)Container.DataItem).MessageDateDisplay != "" ? " " : "" %>- <%# ((BIACore.Server.Model.BIAMessage)Container.DataItem).MessageText %>
                        </div>
                    </ItemTemplate>
                    <SeparatorTemplate><hr /></SeparatorTemplate>
                </asp:Repeater>
            </div>
        </div>--%>
    </form>
</body>
</html>
