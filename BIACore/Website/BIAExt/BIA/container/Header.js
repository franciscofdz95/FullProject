/**
 * A wrapper for the BIACore header.
 * Provides the target div, handles the inject operation, and provides sizing information for
 * Ext to use to layout around the header.
 */
Ext.define('BIA.container.Header', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.biaheader',
    height: BIACore.Browser.deviceType != 'Desktop' ? 36 : 64,
    border: false,

    /**
     * @cfg {Boolean} [showNotification=false]
     * Show the Header Notification button
     */

    /**
     * @cfg {Boolean} [showPendingRequests=true]
     * Show the Pending Requests button
     */

    /**
     * @cfg {Boolean} [showLauncher=false]
     * Show the Launcher button
     */

    /**
     * @cfg {Boolean} [showSearch=true]
     * Show the Search button
     */

    /**
     * @cfg {Boolean} [showMyReports=true]
     * Show the MyReports button
     */

    /**
     * @cfg {Boolean} [showUserMenu=true]
     * Show the User Information/Impersonation button
     */

    /**
     * @cfg {Boolean} [showHelpMenu=false]
     * Show the Help button
     */

    /**
     * @cfg {Boolean} [showOtherTools=false]
     * Show the Other Tools combo box
     */

    /**
     * @cfg {Boolean} [showTimeout=false]
     * Show the Timeout button
     */

    /**
     * @cfg {Boolean} [showLauncher=false]
     * Show the Launcher menu
     */

    /**
     * @cfg {Function} homeFunction
     * Function that is called when the user clicks the 'home' button
     */

    /**
     * @private
     * @cfg {Function} logoutFunction
     * Function that is called when the user clicks the 'logout' button
     */

    /**
     * @cfg {Function} logoFunction
     * Function that is called when the user clicks the application icon/name
     */

    /**
     * @cfg {Function} myReportsFunction
     * Function that is called when the user clicks the 'MyReports' button
     */

    /**
     * @cfg {Function} pendingRequestsFunction
     * Function that is called when the user clicks the 'Pending Requests' button
     */

    /**
     * @cfg {Function} searchFunction
     * Function that is called when the user clicks the 'Search' button
     */

    /**
     * @deprecated
     * @cfg {String} applicationURL
     * URL for the 'home' of this application. Provided by Security.
     */

    /**
     * @deprecated
     * @cfg {String} applicationName
     * 'name' of this application. Provided by Security.
     */

    /**
     * @deprecated
     * @cfg {String} applicationLogo
     * URL of the logo for this application. Provided by Security.
     */

    /**
     * @cfg {String} applicationCode
     * The application code; usually provided by biacore.json or web.config.
     * Can be used in conjunction with stand-alone mode to have header work without security being enabled.
     */

    /**
     * @cfg {Object[]} applicationButtons
     * A list of application-provided buttons to place to the right of the header's default button list.
     * Only accepts an object of the form { title: '', clickFunction: function() {} }
     */

    /**
     * @deprecated
     * @cfg {Object[]} helpMenuItems
     * An array of objects to add to the help menu. Left over from Nick's Header, never actually used.
     */

    constructor: function (config) {
        var me = this,
            version = Ext.getVersion() || {},
            config = config || {};
        if (version.major === 4 && version.minor < 2) { // 4.1
            // 4.1 doesn't have an inner div; 4.2 does.
            Ext.apply(config, {
                renderTpl: ['<div id="{id}-biaheader"></div>']
            });
        }
        me.callParent([config]);
    },

    /**
     * @private
     * Registers the afterrender listener to perform the BIACore.Header.inject operation.
     * Works against all version of Ext 4.
     */
    listeners: {
        afterrender: {
            fn: function () {
                var me = this,
                    version = Ext.getVersion() || {};
                if (typeof (BIACore) !== 'undefined' && typeof(BIACore.Header) !== 'undefined') {
                    if (version.major === 4 && version.minor < 2) { // 4.1
                        BIACore.Header.inject(me.id + '-biaheader', me);
                    } else { // 4.2+
                        BIACore.Header.inject(me.id + '-innerCt', me);
                    }
                }
            }
        }
    }
});