using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BIACore.Website
{
    public partial class Support : System.Web.UI.Page
    {
        private const string CFID_COOKIE = "CFID";
        private const string CFTOKEN_COOKIE = "CFTOKEN";
        private const string BIA_VALIDATIONCOUNT_COOKIE = "BIA_VALIDATIONCOUNT";
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                DateTime n = DateTime.Now.ToLocalTime();

                /***** General Section *****/
                //GeneralBIAServer.InnerText = Environment.MachineName;
                GeneralServerDateTime.InnerText = n.ToString("MM/dd/yyyy hh:mm:ss.fff tt K");
                GeneralIP.InnerText = HttpContext.Current.Request.UserHostAddress;
                GeneralReferrer.InnerText = HttpContext.Current.Request.UrlReferrer != null ? HttpContext.Current.Request.UrlReferrer.ToString() : "N/A";
                //GeneralBrowserVersion.InnerText = HttpContext.Current.Request.Browser.Browser;
                string server = Environment.MachineName.ToUpper();
                if (Settings.Config.BIAEnvironment.ToUpper() == "PROD")
                {
                    if (server.EndsWith("9C41B")) GeneralBIAServer.InnerText = "BIA16-1 (" + server + ")";
                    else if (server.EndsWith("9C428")) GeneralBIAServer.InnerText = "BIA16-2 (" + server + ")";
                    else if (server.EndsWith("9C42A")) GeneralBIAServer.InnerText = "BIA16-3 (" + server + ")";
                    else if (server.EndsWith("9C42B")) GeneralBIAServer.InnerText = "BIA16-4 (" + server + ")";
                    else GeneralBIAServer.InnerText = "PROD [Undertermined] (" + server + ")";
                }
                else GeneralBIAServer.InnerText = Settings.Config.BIAEnvironment.ToUpper() + " (" + server + ")";

                /***** Cookies Section *****/
                CookiesBIASession.InnerText = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null ? HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value + " (BIACore)" :
                    (HttpContext.Current.Request.Cookies["BIA_SESSION"] != null ? HttpContext.Current.Request.Cookies["BIA_SESSION"].Value + " (BIACore)" : "Missing");
                CookiesBIASecHash.InnerText = HttpContext.Current.Request.Cookies[API.SECHASH_COOKIE] != null ? HttpContext.Current.Request.Cookies[API.SECHASH_COOKIE].Value + " (BIACore)" :
                    (HttpContext.Current.Request.Cookies["BIA_SECHASH"] != null ? HttpContext.Current.Request.Cookies["BIA_SECHASH"].Value + " (BIACore)" : "Missing");
                CookiesCFID.InnerText = HttpContext.Current.Request.Cookies[CFID_COOKIE] != null ? HttpContext.Current.Request.Cookies[CFID_COOKIE].Value : "Missing";
                CookiesCFToken.InnerText = HttpContext.Current.Request.Cookies[CFTOKEN_COOKIE] != null ? HttpContext.Current.Request.Cookies[CFTOKEN_COOKIE].Value : "Missing";
                CookiesBIAValidationCount.InnerText = HttpContext.Current.Request.Cookies[BIA_VALIDATIONCOUNT_COOKIE] != null ? HttpContext.Current.Request.Cookies[BIA_VALIDATIONCOUNT_COOKIE].Value : "Missing";

                /***** Session Section *****/
                if (Security.Session.sessionId != null && Security.Session.sessionId != String.Empty)
                {
                    SessionId.InnerText = Security.Session.sessionId.ToString();
                    if (String.IsNullOrWhiteSpace(Security.Session.userId))
                    {
                        SessionUserId.InnerText = "Missing";
                        SessionId.InnerText += " (INVALID)";
                    }
                    else
                    {
                        SessionUserId.InnerText = Security.Session.userId;
                    }
                }
                else
                {
                    SessionId.InnerText = "Missing";
                    SessionUserId.InnerText = "Missing";
                }

                //SessionBIAServer.InnerText = BIACore.Server.Env.Current.ToUpper();
                //if (SessionBIAServer.InnerText == "PROD")
                //{
                //    string current = HttpContext.Current.Request.Url.Host.ToLower();
                //    int prodServerIndex = current.IndexOf("bia-");
                //    SessionBIAServer.InnerText = current.Substring(prodServerIndex, 5).ToUpper();
                //}

                /***** Functionality Testing Sections *****/
                bool jsAvailable = HttpContext.Current.Request.Browser.EcmaScriptVersion.Major > 1;
                JavascriptLoaded.InnerText = jsAvailable ? "Pass" : "Fail";

                if (jsAvailable)
                {
                    GeneralValidationTextCode();
                    JavascriptValidationTestCode();
                    BIACoreValidationTestCode();
                    ExtJSValidationTestCode();
                    ValidationFailureExplanation();
                }
                else
                {
                    FailureExplanationContainer.Style.Add(HtmlTextWriterStyle.Display, "block");
                    FailureExplanation.InnerText = "Javascript failed to load. Critical failure of browser. BIACore & ExtJS not tested.";
                    GeneralBrowserVersion.InnerText = "";
                    GeneralBrowserUserAgent.InnerText = HttpContext.Current.Request.Browser.Browser;
                    GeneralDocumentMode.InnerText = "Unknown";
                    GeneralCompatibility.InnerText = "Unknown";
                    SessionAppCode.InnerText = "Unknown";
                    JavascriptVersion.InnerText = "Unknown";
                    JavascriptLoaded.InnerText = "Fail";
                    JavascriptValidationObjectCreate.InnerText = "Fail";
                    JavascriptValidationObjectDefineProperty.InnerText = "Fail";
                    JavascriptValidationArrayIndexOf.InnerText = "Fail";
                    JavascriptValidationArrayIsArray.InnerText = "Fail";
                    JavascriptValidationStrictReserverWords.InnerText = "Fail";
                    JavascriptValidationJSONType.InnerText = "Fail";
                    JavascriptValidationECMA5.InnerText = "Fail";
                    BIACoreValidationVersion.InnerText = "Unknown";
                    BIACoreValidationLoaded.InnerText = "Fail";
                    BIACoreValidationWebAPI.InnerText = "Fail";
                    BIACoreValidationAjax.InnerText = "Fail";
                    ExtJSValidationVersion.InnerText = "Unknown";
                    ExtJSValidationLoaded.InnerText = "Fail";
                    ExtJSValidationCreateComponent.InnerText = "Fail";
                    ExtJSValidationWebAPI.InnerText = "Fail";

                }
            }
        }

        private void GeneralValidationTextCode()
        {
            System.Text.StringBuilder generalJS = new System.Text.StringBuilder();
            generalJS.Append(
                @"
<script type='text/javascript' id='GeneralJS'>
    var sessionInvalid = { missing: document.getElementById('SessionId').innerText.indexOf('Missing') > 0, invalid: document.getElementById('SessionId').innerText.indexOf('INVALID') > 0 }, 
        biaCoreInvalid = null, biaCoreWebAPIInvalid = null, biaAjaxInvalid = null, javascriptVersionInvalid = null, extJSInvalid = null, extJSTestInvalid = null, failureContainerVisible = false;;

    function ShowFailureExplanationContainer() {
        if(!failureContainerVisible) {
            document.getElementById('FailureExplanationContainer').style.display = 'block';
            failureContainerVisible = true;
        }
    };
    document.getElementById('JavascriptVersion').innerText = jsver;
    (function() {
        var d = (new Date());
        document.getElementById('GeneralClientDateTime').innerText = ('00' + (d.getMonth() + 1).toString()).substr(-2) + '/' + ('00' + d.getDate().toString()).substr(-2) + '/' + d.getFullYear().toString() + ' ' + ('00' + d.getHours().toString()).substr(-2) + ':' + ('00' + d.getMinutes().toString()).substr(-2) + ':' + ('00' + d.getSeconds().toString()).substr(-2) + '.' + d.getMilliseconds().toString() + ' ' + d.toLocaleTimeString().substr(-2) + ' ' + d.toTimeString().substr(12, 5)
    })();
    navigator.sayswho= (function(){
        var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();
    function IeVersion() {
        //Set defaults
        var value = {
            IsIE: false,
            TrueVersion: 0,
            ActingVersion: 0,
            CompatibilityMode: false
        };
    
        //Try to find the Trident version number
        var trident = navigator.userAgent.match(/Trident\/(\d+)/);
        if (trident) {
            value.IsIE = true;
            //Convert from the Trident version number to the IE version number
            value.TrueVersion = parseInt(trident[1], 10) + 4;
        }
    
        //Try to find the MSIE number
        var msie = navigator.userAgent.match(/MSIE (\d+)/);
        if (msie) {
            value.IsIE = true;
            //Find the IE version number from the user agent string
            value.ActingVersion = parseInt(msie[1]);
        } else {
            //Must be IE 11 in 'edge' mode
            value.ActingVersion = value.TrueVersion;
                    }

        //If we have both a Trident and MSIE version number, see if they're different
        if (value.IsIE && value.TrueVersion > 0 && value.ActingVersion > 0)
        {
            //In compatibility mode if the trident number doesn't match up with the MSIE number
            value.CompatibilityMode = value.TrueVersion != value.ActingVersion;
        }
        return value;
    }
    (function() {
        var ie = IeVersion();
        document.getElementById('GeneralBrowserVersion').innerText = ie.IsIE ? 'IE ' + ie.TrueVersion : navigator.sayswho;
        document.getElementById('GeneralBrowserUserAgent').innerText = navigator.userAgent;
    })();
    (function() {
        var ie = IeVersion();
        document.getElementById('GeneralDocumentMode').innerText = document.documentMode != null ? document.documentMode : (ie.IsIE ? 'Unknown' : 'N/A');
    })();
    (function() {
        var ie = IeVersion();
        document.getElementById('GeneralCompatibility').innerText = ie.IsIE && ie.CompatibilityMode ? ie.ActingVersion : 'N/A';
    })();
    (function() {
        document.getElementById('GeneralViewportResolution').innerText = window.innerWidth + ' x ' + window.innerHeight;
    })();

</script>");

            GeneralJS.Controls.Add(new LiteralControl(generalJS.ToString()));
        }

        private void JavascriptValidationTestCode()
        {
            System.Text.StringBuilder javascriptValidationJS = new System.Text.StringBuilder();
            javascriptValidationJS.Append(@"
<script type='text/javascript' id='JavascriptValidationJS'>
function ObjectCreateTest() {
    return typeof Object.create == 'function';
};
function ObjectDefinePropertyTest(){
    return typeof Object.defineProperty == 'function';
};
function ArrayIndexOfTest(){
    return typeof Array.prototype.indexOf == 'function';
};
function ArrayIsArrayTest(){
    return typeof Array.isArray == 'function';
}
function StrictReserverWordsTest(){
    'use strict';
    var words = 'implements,interface,let,package,private,protected,public,static,yield'.split(',');
    for (var i = 0; i < 9; i+=1) {
      try { eval('var ' + words[i]); return false; } catch (err) { if (!(err instanceof SyntaxError)) return false; }
    }
    return true;    
}
function JSONTypeTest() {
 return typeof JSON == 'object';
}
function ECMA5OrNewerTest(){
    return ObjectCreateTest() && ObjectDefinePropertyTest() && ArrayIndexOfTest() && ArrayIsArrayTest() && JSONTypeTest();
}
function IE10VersionTest() {
    return ObjectCreateTest() && ObjectDefinePropertyTest() && ArrayIndexOfTest() && ArrayIsArrayTest() && StrictReserverWordsTest() && JSONTypeTest();
}
function IE9VersionTest() {
    return ObjectCreateTest() && ObjectDefinePropertyTest() && ArrayIndexOfTest() && ArrayIsArrayTest() && !StrictReserverWordsTest() && JSONTypeTest();
}
function IE8VersionTest() {
    return !ObjectCreateTest() && ObjectDefinePropertyTest() && !ArrayIndexOfTest() && !ArrayIsArrayTest() && !StrictReserverWordsTest() && JSONTypeTest();
}
function IE7VersionTest() {
    return !ObjectCreateTest() && !ObjectDefinePropertyTest() && !ArrayIndexOfTest() && !ArrayIsArrayTest() && !StrictReserverWordsTest() && !JSONTypeTest();
}
    (function() {
        document.getElementById('JavascriptValidationObjectCreate').innerText = ObjectCreateTest() ? 'Pass' : 'Fail';
        document.getElementById('JavascriptValidationObjectDefineProperty').innerText = ObjectDefinePropertyTest() ? 'Pass' : 'Fail';
        document.getElementById('JavascriptValidationArrayIndexOf').innerText = ArrayIndexOfTest() ? 'Pass' : 'Fail';
        document.getElementById('JavascriptValidationArrayIsArray').innerText = ArrayIsArrayTest() ? 'Pass' : 'Fail';
        document.getElementById('JavascriptValidationStrictReserverWords').innerText = StrictReserverWordsTest() ? 'Pass' : 'Fail';
        document.getElementById('JavascriptValidationJSONType').innerText = JSONTypeTest() ? 'Pass' : 'Fail';
        document.getElementById('JavascriptValidationECMA5').innerText = ECMA5OrNewerTest() ? 'Pass' : 'Fail';        
    })();
</script>");

            JavascriptValidationJS.Controls.Add(new LiteralControl(javascriptValidationJS.ToString()));
        }
        private void BIACoreValidationTestCode()
        {
            System.Text.StringBuilder biaCoreValidationJS = new System.Text.StringBuilder();
            biaCoreValidationJS.Append(@"
<script src='BIACore.js?_dc=%FILEDECACHER%'></script>
<script type='text/javascript' id='BIACoreValidationJS'>
    function BIALoadTest() {
        return typeof BIACore != 'undefined';
    }
    function BIAAjaxTest() {
        var appList = 'Fail';
        if(BIACore.Config.sessionId() != null && BIACore.Config.sessionId() != '') { 
            try {
            BIACore.ajax({
                async: false,
                url: BIACore.URL.SessionAppList,
                data: {
                    //SessionId: BIACore.Config.sessionId()
                    Token: BIACore.Config.tokenLocal()
                },
                success: function(data) {
                    if(data != null && data.length > 0) {
                        appList = '';
                        for(var i = 0; i < data.length; i++) 
                            appList = appList + (appList.length > 0 ? ',' : '') + data[i].appCode;
                    }
                    else appList = 'N/A';
                },
                failure: function(data) {
                    if(biaCoreInvalid == null) biaCoreInvalid = {};
                    biaCoreInvalid.AjaxTest = 'BIACore Ajax & WebAPI Test failed = ' + data
                }
            });
            }
            catch (err) {
                if(biaCoreInvalid == null) biaCoreInvalid = {};
                biaCoreInvalid.AjaxTest = 'BIACore Ajax & WebAPI Test failed = ' + err
            }
        }
        else appList = 'N/A'
        return appList;
    }

    (function() {
        if(BIALoadTest()) {
            document.getElementById('BIACoreValidationLoaded').innerText = 'Pass';
            document.getElementById('BIACoreValidationVersion').innerText = BIACore.Config.currentVersion;
            var appList = BIAAjaxTest();
            if(appList != 'Fail') {
                document.getElementById('BIACoreValidationWebAPI').innerText = 'Pass';
                document.getElementById('BIACoreValidationAjax').innerText = 'Pass';
            }
            else {
                document.getElementById('BIACoreValidationWebAPI').innerText = 'Fail';
                document.getElementById('BIACoreValidationAjax').innerText = 'Fail';
            }
            document.getElementById('SessionAppCode').innerText = appList;
            document.getElementById('BIACoreValidationDeviceType').innerText = BIACore.Browser.deviceType;
        }
        else {
            if(biaCoreInvalid == null) biaCoreInvalid = {};
            biaCoreInvalid.LoadTest = 'BIACore failed to load.';
            document.getElementById('BIACoreValidationLoaded').innerText = 'Fail';
            document.getElementById('BIACoreValidationVersion').innerText = 'N/A';
            document.getElementById('BIACoreValidationWebAPI').innerText = 'Fail';
            document.getElementById('BIACoreValidationAjax').innerText = 'Fail';
            document.getElementById('BIACoreValidationDeviceType').innerText = 'N/A';
        }
    })();
</script>");

            string dc = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            BIACoreValidationJS.Controls.Add(new LiteralControl(biaCoreValidationJS.ToString().Replace("%FILEDECACHER%", dc)));
        }
        private void ExtJSValidationTestCode()
        {
            System.Text.StringBuilder extJSValidationJS = new System.Text.StringBuilder();
            extJSValidationJS.Append(@"
<script src='/Library/extjs/5.1/ext-all.js?_dc=%FILEDECACHER%'></script>
<script src='BIACore.Ext.js?_dc=%FILEDECACHER%'></script>
<script type='text/javascript' id='ExtJSValidationJS'>
    function ExtJSLoadTest() {
        return typeof Ext != 'undefined' && typeof BIA != 'undefined';
    };
    function ExtJSCreateComponentTest() {
        var results = true;
        try {
            var testCmp = Ext.create({ xtype: 'container' });
            if(testCmp == null && !Ext.isObject(testCmp)) results = false;
        }
        catch (err) {
            if(extJSTestInvalid == null) extJSTestInvalid = {};
            extJSTestInvalid.CreateComponentTest = 'ExtJS Create Component Test Fail = ' + err
            results = false;
        }
        return results;
    };
    function ExtAjaxTest() {
        var works = false;
        if(BIACore.Config.sessionId() != null && BIACore.Config.sessionId() != '') { 
            try {
                Ext.Ajax.request({
                    async: false,
                    url: BIACore.URL.SessionAppList,
                    jsonData: {
                        //SessionId: BIACore.Config.sessionId()
                        Token: BIACore.Config.tokenLocal()
                    },
                    success: function(data) {
                        works = true;
                    }
                });
            }
            catch (err) {
                if(extJSTestInvalid == null) extJSTestInvalid = {};
                extJSTestInvalid.AjaxTest = 'ExtJS Ajax Test Fail = ' + err
            }
        }
        
        return works;
    }

    (function() {
        if(ExtJSLoadTest()) {
            document.getElementById('ExtJSValidationLoaded').innerText = 'Pass';
            document.getElementById('ExtJSValidationVersion').innerText = Ext.getVersion().version;
            if(ExtJSCreateComponentTest()) document.getElementById('ExtJSValidationCreateComponent').innerText = 'Pass';
            else document.getElementById('ExtJSValidationCreateComponent').innerText = 'Fail';

            if(ExtAjaxTest()) document.getElementById('ExtJSValidationWebAPI').innerText = 'Pass';
            else document.getElementById('ExtJSValidationWebAPI').innerText = 'Fail';

            if(Ext.os && Ext.os.deviceType) document.getElementById('ExtJSValidationDeviceType').innerText = Ext.os.deviceType;
            else document.getElementById('ExtJSValidationDeviceType').innerText = 'N/A';
        }
        else {
            if(extJSTestInvalid == null) extJSTestInvalid = {};
            extJSTestInvalid.LoadTest = 'ExtJS failed to load.';
            document.getElementById('ExtJSValidationLoaded').innerText = 'Fail';
            document.getElementById('ExtJSValidationVersion').innerText = 'N/A';
            document.getElementById('ExtJSValidationCreateComponent').innerText = 'Fail';
            document.getElementById('ExtJSValidationWebAPI').innerText = 'Fail';
            document.getElementById('ExtJSValidationDeviceType').innerText = 'N/A';
        }
    })();
</script>");

            string dc = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            ExtJSValidationJS.Controls.Add(new LiteralControl(extJSValidationJS.ToString().Replace("%FILEDECACHER%", dc).Replace("%SERVER%", Settings.Config.Server.ToLower())));
        }

        private void ValidationFailureExplanation()
        {
            System.Text.StringBuilder failreExplanationJS = new System.Text.StringBuilder();
            failreExplanationJS.Append(
                @"
<script type='text/javascript' id='ValidationFailure'>
    function AddWarningFailure(msg) {
            ShowFailureExplanationContainer();
            document.getElementById('FailureExplanation').innerHtml = document.getElementById('FailureExplanation').innerHtml + (document.getElementById('FailureExplanation').innerHtml.length > 0 ? '<br/>' : '') +
                '<div class=\'ValidationFailureWarning\'>' + msg + '</div>'; 
    }
    function AddErrorFailure(msg) {
            ShowFailureExplanationContainer();
            document.getElementById('FailureExplanation').innerHtml = document.getElementById('FailureExplanation').innerHtml + (document.getElementById('FailureExplanation').innerHtml.length > 0 ? '<br/>' : '') +
                '<div class=\'ValidationFailureError\'>' + msg + '</div>'; 
    }
    (function() {        
        var ie = IeVersion();
        if((ie.IsIE && IE10VersionTest()) || !ie.IsIE) {}
        else if(ie.IsIE && IE9VersionTest()) AddWarningFailure('IE9 Javascript detected, some features of BIACore and ExtJS might not function as expected');
        else if(ie.IsIE && IE9VersionTest()) AddErrorFailure('IE8 Javascript detected, BIACore and ExtJS will not function properly.');
        else if(ie.IsIE && IE9VersionTest()) AddErrorFailure('IE7 Javascript detected, BIACore and ExtJS will not function properly.');
        
        if(sessionInvalid.missing) AddWarningFailure('SessionId not found, user not logged into to BIA on this browser.');
        if(sessionInvalid.invalid) AddWarningFailure('SessionId not valid, old session cookie exists but users probably timed-out.');

        if(biaCoreInvalid != null && biaCoreInvalid.LoadTest != null) AddErrorFailure(biaCoreInvalid.LoadTest);
        if(biaCoreInvalid != null && biaCoreInvalid.AjaxTest != null) AddErrorFailure(biaCoreInvalid.AjaxTest);

        if(extJSTestInvalid != null && extJSTestInvalid.LoadTest != null) AddErrorFailure(extJSTestInvalid.LoadTest);
        if(extJSTestInvalid != null && extJSTestInvalid.AjaxTest != null) AddErrorFailure(extJSTestInvalid.AjaxTest);
        if(extJSTestInvalid != null && extJSTestInvalid.CreateComponentTest != null) AddErrorFailure(extJSTestInvalid.CreateComponentTest);
    })();
</script>");

            FailreExplanationJS.Controls.Add(new LiteralControl(failreExplanationJS.ToString()));
        }
    }
}