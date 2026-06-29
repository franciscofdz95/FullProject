<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RequestAccess.aspx.cs" Inherits="BIACore.Website.RequestAccess" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=10" />
    <title>Request Access</title>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
        }
        li {
             text-align: left;
         }

        .header {
            height: 70px;
            width: 100%;
            background-color: #2C0000;
            color: white;
            border-bottom: solid 2px #DFB42C;
            position:absolute;
            top:0px;
        }

        .biaTitle {
            padding-left: 8px;
            display: table-cell;
            vertical-align: middle;
            font-size: 18.6667px;
            font-family: "Helvetica Neue", "Lucida Grande", "Segoe UI", Arial, Helvetica, Verdana, sans-serif;
        }

        .upsLogo {
            width: 60px;
            padding: 8px;
            vertical-align: middle;
            display: table-cell;
        }

        .biaLogo {
            padding-top: 4px;
            color: #EBEBE6;
            display: inline-block;
            float: right;
            padding-left: 10px;
            padding-right: 10px;
            padding-bottom: 2px;
            background-color: #D4CCBF;
        }

        .mainContainer {
            overflow: auto;
            position:absolute;
            top: 70px;
            left: 0px;
            right: 0px;
            bottom:0px;
        }
         
        .Card {
            box-shadow: rgba(0, 0, 0, 0.137255) 0px 2px 2px 1px, rgba(0, 0, 0, 0.117647) 0px 1px 5px 2px, rgba(0, 0, 0, 0.2) 0px 3px 1px 0px;
            border-radius: 3px;
        }

        .MessageBox {
            padding: 7px;
            font-size: 16px;
            line-height: 24px;
            font-weight: bold;
            background-color: rgba(255, 246, 179, 0.4);
            text-align: center;
        }

            .MessageBox .MessageHeader {
                font-size: 30px;
                margin-bottom: 10px;
                line-height: 36px;
            }

        .messageContainer {
            margin: auto;
            width: 800px;
            margin-top: 40px;
        }

        .instructionsContainer {
            margin-top: 25px;
            margin-left: auto;
            margin-right: auto;
            width: 800px;
            font-size: large;
            line-height: 40px;
        }
        .instructionsTitle {
            margin-top: 30px;
            margin-left: auto;
            margin-right: auto;
            width: 800px;
            font-weight: bold;
            font-size: large;
            line-height: 40px;
        }
        .instructionsContainer2 {
            margin-top: 25px;
            margin-left: auto;
            margin-right: auto;
            width: 800px;
            font-size: large;
            line-height: 40px;
        }
        .instructionsContainer2 {
            margin-top: 30px;
            margin-left: auto;
            margin-right: auto;
            width: 800px;
            font-weight: bold;
            font-size: large;
            line-height: 40px;
        }

        .imageContainer {
            width: 100%;
            text-align: center;
        }

            .imageContainer img {
                width: 700px;
            }
    </style>
</head>
<body>
    <%--<form id="form1" runat="server">--%>
        <div class="header">
            <span class="biaLogo">
                <img src="images/BIA_Logo.png" />
            </span>
            <span class="upsLogo">
                <img src="images/UPS_Logo.png" />
            </span>
            <span class="biaTitle">Business Intelligence &amp; Analysis</span>
        </div>
        <a href="#" id="scroll" style="display: none;"><span></span></a>
        <div class="mainContainer">
            <div id="Message" class="Card MessageBox messageContainer">
                
                <h2>BIA Application Request Access Process</h2>
                <span runat="server" id="ApplicationName"></span> Please follow these instructions to request a user role.
                <br />
                <a href="Downloads/BIA_Application_Access.pptx">Additional Information PowerPoint</a>
                <ol type="1">
                    <li runat="server" id="instructNewUser">Use BIA Security to create BIA profile<br /><a href="#requestNewUser">BIA New User Creation</a></li>
                    <li runat="server" id="instructIIQ">Use IIQ to request application access<br /><a href="#requestIIQ">IIQ Role Request Instructions</a></li>
                    <li runat="server" id="instructBIA">Use BIA Security to request detailed application access<br /><a href="#requestBIA">BIA Access Request Instructions</a></li>
                </ol>
                <span class="">NOTE: Application access requires both BIA Security and IIQ approval</span>
            </div>
            <div class="instructionsContainer" id="requestNewUser" runat="server">
                <span class="instructionsTitle">1 - Request BIA New User Profile</span>
                <br />
                <span class="instructions">1. Click OK to create a new BIA profile.</span>
                <div class="imageContainer">
                    <img src="images/bia_create_new.png" />
                </div>
                <span class="instructions">2. Select New User from the User dropdown button or the orange + button.</span>
                <div class="imageContainer">
                    <img src="images/security_user_create.png" />
                </div>
                <span class="instructions">3. Enter New User's ADID.  Hit Search.</span>
                <div class="imageContainer">
                    <img src="images/security_user_adid.png" />
                </div>
                <span class="instructions">4. User info fields will be auto populated. Hit Create Profile.</span>
                <div class="imageContainer">
                    <img src="images/security_user_info.png" />
                </div>
            </div>
            <div class="instructionsContainer"  id="requestIIQ" runat="server">
                <span class="instructionsTitle">2 - Request IIQ Application Role</span>
                <br />
                <span class="instructions">1. Log in to IIQ with ADID using this link: <a runat="server" id="iiqLink" href="_blank">https://spsapps.inside.ups.com/APRS/pub/aprspublic.html</a>.</span>
                <br />
                <span class="instructions">2. Select “Access Navigator" in the menu.</span>
                <br />
                <div class="imageContainer">
                    <img src="images/iiq_1_access_nav.png" />
                </div>
                <span class="instructions">3. Select “Application Access" in the menu.</span>
                <br />
                <div class="imageContainer">
                    <img src="images/iiq_2_app_access.png" />
                </div>
                <span class="instructions">4. Search for application name or code.</span>
                <br />
                <span class="instructions">5. Click the application’s card.</span>
                <br />
                <div class="imageContainer">
                    <img src="images/iiq_3_app_search.png" />
                </div>
                <span class="instructions">6. Select the application role(s) and click Next.</span>
                <br />
                <div class="imageContainer">
                    <img src="images/iiq_4_role_select.png" />
                </div>
                <span class="instructions">7. Select comment icon to enter reason for application access and then click Submit.</span>
                <br />
                <div class="imageContainer">
                    <img src="images/iiq_5_submit.png" />
                </div>
                <span class="instructions">8. An email will be sent to your supervisor for approval.</span>
                <br />
            </div>
            <div class="instructionsContainer" id="requestBIA" runat="server">
                <span class="instructionsTitle">3 - Request BIA Application Access Request</span>
                <br />
                <span class="instructions">1. Login to BIA Security using this link: <a runat="server" id="a2" href="https://biasecurity.bia.inside.ups.com/" target="_blank">https://biasecurity.bia.inside.ups.com/</a>.</span>
                <br />
                <div class="imageContainer">
                    <img src="images/security_home.png" />
                </div>
                <span class="instructions">2. Use the Search field to find an app and then click the blue + button to request access.</span>
                <br />
                <div class="imageContainer">
                    <img src="images/security_request_app.png" />
                </div>
                <span class="instructions">3. Fill out Request Geo, Access Level and provide a detailed Reason. Hit Request Access button.</span>
                <br />
                <div class="imageContainer">
                    <img src="images/security_request_user_info.png" />
                </div>
                <span class="instructions">4. The app manager will be notified of your request which they will need to review.</span>
                
            </div>
        </div>
    <%--</form>--%>
</body>
</html>
