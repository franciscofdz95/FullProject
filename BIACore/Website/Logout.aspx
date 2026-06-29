<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Logout.aspx.cs" Inherits="BIACore.Website.Logout" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=10" />

    <title>BIACore <%=BIACore.Settings.Config.BIAEnvironment %> Logout</title>

    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
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
            margin: auto;
            text-align: center;
            width: 600px;
            margin-top: 20%;          
        }
        .MessageBox .MessageHeader {
            font-size: 30px;
            margin-bottom: 10px;
            line-height: 36px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div id="LogoutDelayDisplay" class="Card MessageBox">
        
    </div>
    </form>
    <script type="text/javascript">
        var logoutDelayDisplayMsg = '<span class="MessageHeder">BIA Logout</span><br>You have been successfully logged out.<br>To ensure a complete logout, this window needs to be closed.<br>This window will close automatically in <span style="color:#F31A12">{TIMELEFT}</span> seconds.'
        var logoutDelayInSecs = 5;
        var logoutDelayFn = function () {
            if (logoutDelayInSecs == 0) {
                window.close();
                
                var displayElem = document.getElementById('LogoutDelayDisplay');
                if (displayElem != null) displayElem.innerHTML = logoutDelayDisplayMsg.replace('<br>This window will close automatically in <span style="color:#F31A12">{TIMELEFT}</span> seconds.', '');
            }
            else {
                var displayElem = document.getElementById('LogoutDelayDisplay');
                if (displayElem != null) displayElem.innerHTML = logoutDelayDisplayMsg.replace('{TIMELEFT}', logoutDelayInSecs);
                setTimeout(logoutDelayFn, 1000);
            }
            logoutDelayInSecs--;
        }

        logoutDelayFn();
    </script>
</body>
</html>
