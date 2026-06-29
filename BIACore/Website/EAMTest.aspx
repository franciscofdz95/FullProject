<%@ Page Language="C#" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
        	<%= HttpContext.Current.Request.Headers["SM_USER"].ToString() %>
        </div>
    </form>
</body>
</html>
