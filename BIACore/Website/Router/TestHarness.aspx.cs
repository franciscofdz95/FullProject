using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BIACore.Website.Router
{
    public partial class TestHarness : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            /*
            TEST HARNESS:
                - Enter Address (defaulted to Default.aspx)
                - Enter message to encode
                - Encode with SHA-256 using converted sharedPassword hash
                - Encode SHA-256 Encoded message as Base-64 + '.' + Encode message as Base-64
                - Post to Default.aspx
                - IF test is checked, pause Default.aspx processing before redirect to display info and on keypress open redirect in new window
            */

            //var testObj = new { Test = "This is a test" };
            //
            //
            //Post(string.Format("{0}{1}{2}", Settings.Config.Server, Settings.Config.BaseURL, "Router/Default.aspx"), Default.ObjetcToJSONString(testObj));
            //BuildFormData.Visible = true;
            form2.Action = "./SalesforceCanvas.aspx";
            //form1.Action = "./TestHarness.aspx";
            //txtDisplayPostData.Text = "";

            if (!IsPostBack)
            {
                signed_request.Value = "5HqIrsKrrRmcMhX7UFWs9vw6BHsoWog6GfXxv1RUUk0%3D.eyJhbGdvcml0aG0iOiJITUFDU0hBMjU2IiwiaXNzdWVkQXQiOjE3MDA4NTA0NjIsInVzZXJJZCI6IjAwNTJBMDAwMDA4bTNOc1FBSSIsImNsaWVudCI6eyJyZWZyZXNoVG9rZW4iOm51bGwsImluc3RhbmNlSWQiOiJfOmNhbnZhc2RlbW86al9pZDA6al9pZDE6Y2FudmFzYXBwIiwidGFyZ2V0T3JpZ2luIjoiaHR0cHM6Ly91cHNkcml2ZS0tZHJpdmUyLmNzNTEubXkuc2FsZXNmb3JjZS5jb20iLCJpbnN0YW5jZVVybCI6Imh0dHBzOi8vdXBzZHJpdmUtLURyaXZlMi5jczUxLm15LnNhbGVzZm9yY2UuY29tIiwib2F1dGhUb2tlbiI6IjAwRDRCMDAwMDAwQ3h6SiFBUklBUUk3Q0NRRDQyVU02VUN2NFluRUdabzM2UzFpd0pEelRXdkV5VkluNHpvZkxMb2FyS0dxSjZNZEFJU2NHWFlIcE5XZVl0NzBzLjZVNnhQWm9YZDBCYkxyeEhsc08ifSwiY29udGV4dCI6eyJ1c2VyIjp7InVzZXJJZCI6IjAwNTJBMDAwMDA4bTNOc1FBSSIsInVzZXJOYW1lIjoiMTUyODIxNkB1cHMuY29tLmRyaXZlMiIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IlNjaHVociIsImVtYWlsIjoianNjaHVockB1cHMuY29tIiwiZnVsbE5hbWUiOiJKb2huIFNjaHVociIsImxvY2FsZSI6ImVuX1VTIiwibGFuZ3VhZ2UiOiJlbl9VUyIsInRpbWVab25lIjoiQW1lcmljYS9OZXdfWW9yayIsInByb2ZpbGVJZCI6IjAwZTJBMDAwMDAxRU5zeiIsInJvbGVJZCI6bnVsbCwidXNlclR5cGUiOiJTVEFOREFSRCIsImN1cnJlbmN5SVNPQ29kZSI6IlVTRCIsInByb2ZpbGVQaG90b1VybCI6Imh0dHBzOi8vdXBzZHJpdmUtLURyaXZlMi0tYy5jczUxLmNvbnRlbnQuZm9yY2UuY29tL3Byb2ZpbGVwaG90by8wMDUvRiIsInByb2ZpbGVUaHVtYm5haWxVcmwiOiJodHRwczovL3Vwc2RyaXZlLS1Ecml2ZTItLWMuY3M1MS5jb250ZW50LmZvcmNlLmNvbS9wcm9maWxlcGhvdG8vMDA1L1QiLCJzaXRlVXJsIjpudWxsLCJzaXRlVXJsUHJlZml4IjpudWxsLCJuZXR3b3JrSWQiOm51bGwsImFjY2Vzc2liaWxpdHlNb2RlRW5hYmxlZCI6ZmFsc2UsImlzRGVmYXVsdE5ldHdvcmsiOnRydWV9LCJsaW5rcyI6eyJsb2dpblVybCI6Imh0dHBzOi8vdXBzZHJpdmUtLURyaXZlMi5jczUxLm15LnNhbGVzZm9yY2UuY29tIiwiZW50ZXJwcmlzZVVybCI6Ii9zZXJ2aWNlcy9Tb2FwL2MvNDAuMC8wMEQ0QjAwMDAwMEN4ekoiLCJtZXRhZGF0YVVybCI6Ii9zZXJ2aWNlcy9Tb2FwL20vNDAuMC8wMEQ0QjAwMDAwMEN4ekoiLCJwYXJ0bmVyVXJsIjoiL3NlcnZpY2VzL1NvYXAvdS80MC4wLzAwRDRCMDAwMDAwQ3h6SiIsInJlc3RVcmwiOiIvc2VydmljZXMvZGF0YS92NDAuMC8iLCJzb2JqZWN0VXJsIjoiL3NlcnZpY2VzL2RhdGEvdjQwLjAvc29iamVjdHMvIiwic2VhcmNoVXJsIjoiL3NlcnZpY2VzL2RhdGEvdjQwLjAvc2VhcmNoLyIsInF1ZXJ5VXJsIjoiL3NlcnZpY2VzL2RhdGEvdjQwLjAvcXVlcnkvIiwicmVjZW50SXRlbXNVcmwiOiIvc2VydmljZXMvZGF0YS92NDAuMC9yZWNlbnQvIiwiY2hhdHRlckZlZWRzVXJsIjoiL3NlcnZpY2VzL2RhdGEvdjMxLjAvY2hhdHRlci9mZWVkcyIsImNoYXR0ZXJHcm91cHNVcmwiOiIvc2VydmljZXMvZGF0YS92NDAuMC9jaGF0dGVyL2dyb3VwcyIsImNoYXR0ZXJVc2Vyc1VybCI6Ii9zZXJ2aWNlcy9kYXRhL3Y0MC4wL2NoYXR0ZXIvdXNlcnMiLCJjaGF0dGVyRmVlZEl0ZW1zVXJsIjoiL3NlcnZpY2VzL2RhdGEvdjMxLjAvY2hhdHRlci9mZWVkLWl0ZW1zIiwidXNlclVybCI6Ii8wMDUyQTAwMDAwOG0zTnNRQUkifSwiYXBwbGljYXRpb24iOnsibmFtZSI6ImNhbnZhc2RlbW8iLCJjYW52YXNVcmwiOiJodHRwczovL2xvY2FsaG9zdDo4NDQzL3NpZ25lZC1yZXF1ZXN0LWNvbnRhY3QuanNwIiwiYXBwbGljYXRpb25JZCI6IjA2UDRCMDAwMDAwNEVkWiIsInZlcnNpb24iOiIxLjAiLCJhdXRoVHlwZSI6IlNJR05FRF9SRVFVRVNUIiwicmVmZXJlbmNlSWQiOiIwOUg0QjAwMDAwMDAyT0YiLCJvcHRpb25zIjpbXSwic2FtbEluaXRpYXRpb25NZXRob2QiOiJOb25lIiwiaXNJbnN0YWxsZWRQZXJzb25hbEFwcCI6ZmFsc2UsIm5hbWVzcGFjZSI6IiIsImRldmVsb3Blck5hbWUiOiJjYW52YXNkZW1vIn0sImVudmlyb25tZW50Ijp7InJlZmVyZXIiOm51bGwsImxvY2F0aW9uVXJsIjoiaHR0cHM6Ly91cHNkcml2ZS0tZHJpdmUyLS1jLmNzNTEudmlzdWFsLmZvcmNlLmNvbS9hcGV4L0NWQkFUQ2FudmFzdmY%2Fc2ZkY0lGcmFtZUhvc3Q9d2ViJmlkPTAwMTJBMDAwMDF3R0l3R1FBVyZpc2R0cD1wMSZzZmRjSUZyYW1lT3JpZ2luPWh0dHBzJTNBJTJGJTJGdXBzZHJpdmUtLWRyaXZlMi5saWdodG5pbmcuZm9yY2UuY29tJnRvdXI9IiwiZGlzcGxheUxvY2F0aW9uIjoiVmlzdWFsZm9yY2UiLCJzdWJsb2NhdGlvbiI6bnVsbCwidWlUaGVtZSI6IlRoZW1lMyIsImRpbWVuc2lvbnMiOnsid2lkdGgiOiIxMDAlIiwiaGVpZ2h0IjoiOTAwcHgiLCJtYXhXaWR0aCI6IjEwMDBweCIsIm1heEhlaWdodCI6ImluZmluaXRlIiwiY2xpZW50V2lkdGgiOiI4MjNweCIsImNsaWVudEhlaWdodCI6IjMxcHgifSwicGFyYW1ldGVycyI6eyJwYXJtIjoiSkEyRXVVVnU4MHNNMlBDek1uRTFka0RWQzdzTEVpRkNvSDhIczNpdXlVcW9VU1RJdkNOTytiZXpwWHRyMXRuL2N2Yy9vU1AzRWJHWE9IQmtTTkt6VkZ0NlBRUDFsSG8zRkxwODlWTnJPdWVyUnE5Z2xYZ1QxejYyYXhUVEZjZmExMy8xSGF6bHE5UGZoRi9TNE1DV3RIeFJ5UFVCUitTWU1XWHMxV0xPMW1pTGU1eDFranJPcWRIV3AvY2E5TmtETkdMVndtRlMzNExySXg3bEE0NnZXLytDYkJNR3hzNnBzUElJek03Q3EzZ3FBMmJIN3ROK0grRERTUmVDNzh3VVdoRVNmalJyWDA2OFB0UHQ2OVJkbUk2UlBKNDR4OWpQWmp6SFhRbDQ0Qlg2V0hsM3R5L1N3Vlg1dzVmTG84dmpvc1VVZ29jSW1GZzJFQkVnZU13RTVBPT0uZXlBaVZHRnlaMlYwTFZWU1RDSTZJQ0pvZEhSd09pOHZZbWxoWkdWMkxtbHVjMmxrWlM1MWNITXVZMjl0TDJKcFlTOWhjSEJ6TDFCeVpXTmhiR3d2VUhKbFkyRnNiRjlCWTJOdmRXNTBMbU5tYlNJc0lDSlZVa3d0VTJOdmNHVWlPaUI3SUNKQlkyTnZkVzUwSWpvZ0lqQXdNREF3TlRGRk1sWWlJQ3dpUWxVaU9pQWlWVk1pZlN3aVJrOVNUUzFUWTI5d1pTSTZlMzBzSWxKbGNYVmxjM1F0VkdsdFpYTjBZVzF3SWpvZ0lqSXdNVGN0TURjdE1qRWdNVE02TkRBNk16UWlMQ0FpVlZCVExVRkVTVVFpT2lBaVJWaFVNa3BOVXlJc0lrRndjR3hwWTJGMGFXOXVMVU52WkdVaU9pSlFjbVZqWVd4c0luMD0ifSwicmVjb3JkIjp7ImF0dHJpYnV0ZXMiOnsidHlwZSI6IkFjY291bnQiLCJ1cmwiOiIvc2VydmljZXMvZGF0YS92NDAuMC9zb2JqZWN0cy9BY2NvdW50LzAwMTJBMDAwMDF3R0l3R1FBVyJ9LCJJZCI6IjAwMTJBMDAwMDF3R0l3R1FBVyJ9LCJ2ZXJzaW9uIjp7InNlYXNvbiI6IlNVTU1FUiIsImFwaSI6IjQwLjAifX0sIm9yZ2FuaXphdGlvbiI6eyJvcmdhbml6YXRpb25JZCI6IjAwRDRCMDAwMDAwQ3h6SlVBUyIsIm5hbWUiOiJVUFMiLCJtdWx0aWN1cnJlbmN5RW5hYmxlZCI6dHJ1ZSwibmFtZXNwYWNlUHJlZml4IjpudWxsLCJjdXJyZW5jeUlzb0NvZGUiOiJVU0QifX19";
                //txtPostData.Text = "{ \"Target-URL\": \"https://biadev2.inside.ups.com/bia/apps/precall/precall.cfm\", \"URL-Scope\": { \"Site_Key\": \"9530451338012\" ,\"Origin\": \"US\"}, \"Request-Timestamp\": \"2016-07-29 13:56:40\", \"UPS-ADID\": \"adm1mme\", \"Application-Code\":\"Precall\"}";
            }
        }

        //protected void BuildFormData_Click(object sender, EventArgs e)
        //{
        //    //var testObj = new { Target-URL = "https://biadev2/bia/apps/precall.cfm"  };
        //    //string context = "{ \"Target-URL\": \"https://biadev2/bia/apps/precall.cfm\", \"URL-Scope\": { \"Site_Key\": \"9915106991622\" }, \"UPS-ADID\": \"ext2jms\" }";//Default.ObjetcToJSONString(testObj);
        //    string context = txtPostData.Text;
        //    if (context != "")
        //    {
        //        var routerKey = Default.Base64ToString(Properties.Settings.Default.RouterKey);
        //        string base64EncodedContext = Default.StringToBase64(context);
        //        string base64SHA256EncodedContext = Default.StringToSHA256String(base64EncodedContext, routerKey);
        //        string base64SHA256Base64EncodedContext = Default.StringToBase64(base64SHA256EncodedContext);
        //        //SignedRequest.Value = base64SHA256Base64EncodedContext + "." + base64EncodedContext;
        //        SignedRequest.Value = "VMGoetg/DCX0lsaklk0iAcfykJWQ3dUKRZ82KJfacHe8MeLfWwkPZ8C8iR+DRF0oHZ1hdvjDODVuKiJCeycME4sYD0ZBpfxQl8BgV3XHFBPDjazwpHRkn7GpJv4gWPXRnRCkNx/FtT4AaVZYxIVzYg03TK1XO9uPe5m0ZlLDQpUnKUz7BuZxEPttNd6YWC6X5q8qAcCRSWA4bnbw5jXMWNuZHhB4q1+KM29GtJoh+3RWwO6vaSand3Z0lsRwGgN2aJiHDPG6UvueckQL1xSORT8gaiEqrwRKF/MAqeQ/Ohpx9LumkJYdg3L5yRcze7ShtwwN28t+jBaIB3jD48JH6A==.eyJUYXJnZXQtVVJMIjogImh0dHA6Ly9iaWFkZXYuaW5zaWRlLnVwcy5jb20vYmlhL2FwcHMvY2h1cm4vQ1ZCQVRfTWFydC9WaWV3L1Njb3JlY2FyZC9TY29yZWNhcmQuY2ZtIiwgIlVSTC1TY29wZSI6IHsgImN1c3RJRCI6ICIwOTA1MVIiLCJjdXN0b21lclR5cGUiOiAiU2l0ZSJ9LCJGT1JNLVNjb3BlIjp7fSwgIlJlcXVlc3QtVGltZXN0YW1wIjogIjIwMTYtMDktMDEgMTQ6Mzg6MDgiLCAiVVBTLUFESUQiOiAiZXh0MmptcyIsIkFwcGxpY2F0aW9uLUNvZGUiOiJDVkJBVCJ9";
        //        txtDisplayPostData.Text = SignedRequest.Value;

        //        form1.Action = "./Default.aspx?test=true";
        //        //BuildFormData.Visible = false;
        //    }
        //}
    }
}