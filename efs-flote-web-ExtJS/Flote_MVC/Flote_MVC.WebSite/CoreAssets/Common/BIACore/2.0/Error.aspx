<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Error.aspx.cs" Inherits="BIACore.Website.Error" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name = "viewport" content = "user-scalable = no, width = 550">
    <title>BIACore <%=BIACore.Settings.Config.BIAEnvironment %> Application Error</title>

    <style type="text/css">
        body 
        {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
        }
        .Card {
            box-shadow: rgba(0, 0, 0, 0.137255) 0px 2px 2px 1px, rgba(0, 0, 0, 0.117647) 0px 1px 5px 2px, rgba(0, 0, 0, 0.2) 0px 3px 1px 0px;
            border-radius: 3px;
        }
        .MessageBox {
            padding: 15px;
            font-size: 16px;
            line-height: 18px;
            background-color: rgba(212, 204, 191, 0.4);
            -ms-filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#66D4CCBF,endColorstr=#66D4CCBF);
            filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#66D4CCBF,endColorstr=#66D4CCBF);
            text-align: center;
            margin: 200px auto 0 auto;
            width: 580px;
        }
        .ErrorHeader {
            font-size: 20px;
            line-height: 22px;
            font-weight: bold;
            padding: 5px;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="Card MessageBox">
            <div class="ErrorHeader">BIA Application Error Encountered</div>
            <div>This error has been logged and the correct application manager will be notified</div>
            <br />
            <div>You can close this window and retry the application later</div>
            <div>or return to the <a href="/bia/apps/reports.cfm">BIA Reports</a> page.</div>
        </div>
    </form>
</body>
</html>
