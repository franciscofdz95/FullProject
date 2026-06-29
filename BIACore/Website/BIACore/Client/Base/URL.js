/**
 * @class BIACore.URL
 * @singleton
 *
 * Provides a central location for updating/changing commonly used URIs in
 * BIACore.
 */

if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';

        if (search instanceof RegExp) {
            throw TypeError('first argument must not be a RegExp');
        }
        if (start === undefined) { start = 0; }
        return this.indexOf(search, start) !== -1;
    };
}
var vHostname = window.location.hostname;
var vSubdomain = 'bia';
if (vHostname.includes('biaalpha')) vSubdomain = 'biaalpha';
if (vHostname.includes('biadev')) vSubdomain = 'biadev';
var vDomain = 'ups';
if (vHostname.includes('ams1907')) vDomain = 'ams1907';

BIACore.define('BIACore.URL', {
    /**
     * .Net Config route
     * @type String
     */
    Config: 'api/BIACore/Config/Config', // this will always be app-relative, so don't add server/serviceURI

    /**
     * JSON Config route
     * @type String
     */
    JSONConfig: 'biacore.json', // this is a json file in the root of an application to give full client functionality to cfm

    /**
     * Application API - List
     * @type String
     */
    Application: BIACore.Config.serviceURI + 'api/application/Application',

    /**
     * Application API - User Access
     * @type String
     */
    ApplicationUserAccess: BIACore.Config.serviceURI + 'api/application/ApplicationUserAccess',

    /**
     * Header API - Other Tools list
     * @type String
     */
    OtherTools: BIACore.Config.serviceURI + 'api/application/ApplicationUserList',

    /**
     * Header API - empty image
     * @type String
     */
    EmptyLogo: BIACore.Config.serviceURI + 'css/header/images/bia_logo_app.gif',

    /**
     * Header API - Human-readable server name
     * @type String
     */
    ServerName: BIACore.Config.server + '/bia/customtag/server.txt',

    /**
     * Logger API - Event (message/debug/error/etc)
     * @type String
     */
    Event: BIACore.Config.serviceURI + 'api/log/Event',

    /**
     * Logger API - Event (message/debug/error/etc)
     * @type String
     */
    Export: BIACore.Config.serviceURI + 'api/log/Export',

    /**
     * Logger API - Event (message/debug/error/etc)
     * @type String
     */
    PageView: BIACore.Config.serviceURI + 'api/log/PageView',

    /**
     * Security API - Impersonate User
     * @type String
     */
    Impersonate: BIACore.Config.serviceURI + 'api/impersonation/impersonate',

    /**
     * Security API - Impersonation History
     * @type String
     */
    ImpersonationList: BIACore.Config.serviceURI + 'api/impersonation/list',

    /**
     * Security API - Impersonation Search
     * @type String
     */
    ImpersonationSearch: BIACore.Config.serviceURI + 'api/impersonation/search',

    /**
     * Security API - Session Active state
     * @type String
     */
    Lock: BIACore.Config.serviceURI + 'api/session/Lock',

    /**
     * Security API - Session information
     * @type String
     */
    Session: BIACore.Config.serviceURI + 'api/session/Session',

    /**
     * Security API - Session Apps list information
     * @type String
     */
    SessionAppList: BIACore.Config.serviceURI + 'api/session/SessionApps',

    /**
     * Security API - User information
     * @type String
     */
    User: BIACore.Config.serviceURI + 'api/user/User',

    /**
     * Security API - User Search
     * @type String
     */
    UserSearch: BIACore.Config.serviceURI + 'api/user/UserSearch',

    /**
     * WS4ID API - List of ActiveDirectory User Profiles
     * @type String
     */
    WS4IDUserList: BIACore.Config.serviceURI + 'api/user/GetWS4IDUserList',

    /**
     * Security API - Login path
     * @type String
     */
    //Login: BIACore.Config.server + '/bia/apps/BIASecurity/unsecure/index.cfm',
    Login: BIACore.Config.serviceURI + 'Login.aspx',

    /**
     * Security API - Logout path
     * @type String
     */
    //Logout: BIACore.Config.server + '/bia/CustomTag/BIA_Logout.cfm',
    Logout: 'https://biasecurity.' + vSubdomain + '.inside.' + vDomain + '.com/Logout.aspx',

    /**
     * Security API - Logout path
     * @type String
     */
    //Logout: BIACore.Config.server + '/bia/CustomTag/BIA_Logout.cfm',
    LocalhostLogout: 'api/BIA/Localhost/Logout',

    /**
     * Notify API - list of notifications
     * @type String
     */
    Notification: BIACore.Config.server + '/apps/NotifyAdmin/api/notify/Notification',

    /**
     * Notify API - update notification
     * @type String
     */
    UpdateNotification: BIACore.Config.server + '/apps/NotifyAdmin/api/notify/UpdateNotification',

    /**
     * Notify API - application list
     * @type String
     */
    GetUserApps: BIACore.Config.server + '/apps/NotifyAdmin/api/notify/GetUserApps',

    /**
     * Application API - Application User List
     * @type String
     */
    UserList: BIACore.Config.serviceURI + 'api/application/userlist',

    /**
     * Track API - Browser version
     * @type String
     */
    BrowserTrack: BIACore.Config.serviceURI + 'api/track/browser',

    /**
     * Validate ExtJS Template Structure
     * @type String
     */
    ExtJSVal: BIACore.Config.serviceURI + 'api/extjsval/ExtJSVal',

    /**
     * Get Fingerprint Object by MG12 ID
     * @type String
     */
    GetFingerprintById: BIACore.Config.serviceURI + 'api/FingerprintValue/GetFingerprintById',

    /**
     * Get Fingerprint Object by JSON Object
     * @type String
     */
    GetFingerprintByValue: BIACore.Config.serviceURI + 'api/FingerprintValue/GetFingerprintByValue',

    /**
     * Log when Fingerprint is used
     * @type String
     */
    FingerprintUsageLog: BIACore.Config.serviceURI + 'api/FingerprintValue/FingerprintUsageLog',

    /**
     * Load SAF Application Dimension Configuration
     * @type String
     */
    AppDimConfig: BIACore.Config.serviceURI + 'api/SmartFilter/AppDimConfig',

    /**
     * Load SAF Application Dimension Configuration
     * @type String
     */
    AdminUserHeaderLinks: BIACore.Config.serviceURI + 'api/user/adminuserheaderlinks'
});