/* ====================================================================================================
NAME:			[View port for Flote Application]
BEHAVIOR:		Shows all the components of view port.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/

Ext.define('App.View.Viewport', {
    extend: 'BIA.container.Viewport',
    alias: 'widget.App-View-Viewport',
    layout: 'border',
    defaults: { border: true },
    items: [
        { xtype: 'App-View-Main-Header', region: 'north', width: '10%' },
        {
            xtype: 'App-View-Main-GeoPanel', region: 'west', itemId: 'App-GeoPanel', collapsible: true,
            collapsed: false,
            animCollapse: false,
            collapseDirection: 'bottom',
            titleCollapse: true,
            width: 230
        },
        { xtype: 'App-View-Main-TabPanel', region: 'center', itemId: 'tabPanelId', width: '80%' },
        { xtype: 'App-View-Main-Footer', region: 'south', width: '10%' }
    ],
    constructor: function (config) {
        this.callParent([config]);
    },
    initComponent: function () {
        var url = window.location.href.split('?');
        if ((BIACore.Security.User.isAdmin || BIACore.Security.User.isSA)) {
            if (url.length > 1) {
                var obj = Ext.Object.fromQueryString(url[1]);
                if (obj.eaId !== undefined && obj.eaId !== null) {
                    var win = Ext.widget('App-View-Component-UserAccess-UserAccessDefinition');
                    win.eaId = obj.eaId;
                    win.show();
                }
            }
        }
        this.callParent(arguments);
    }
});