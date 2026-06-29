/* ====================================================================================================
NAME:			[Main Tablepanel Controller]
BEHAVIOR:		Actions of main tabpanel controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
05/17/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Main.TabPanel', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        Ext.History.init();

        // Needed if you want to handle history for multiple components in the same page.
        // Should be something that won't be in component ids.

        this.control({
            'App-View-Main-TabPanel #appCbolSumId': {
                activate: this.CBOLSummaryTabActivate
            },
            'App-View-Main-TabPanel #AppAccrualsTabId': {
                activate: this.AccrualTabActivate
            },
            'App-View-Main-TabPanel #floteHomeTabId': {
                activate: this.HomeTabActivate
            }

        });
    },
    CBOLSummaryTabActivate: function CBOLSummaryTabActivate(tab) {
        if (localStorage) {
            localStorage.setItem('pageName', 'CBOL');
        }
        PgAtt.setControllerPage("CBOL");
        tab.setActiveTab(PgAtt.getCbolTabNo());
    },
    AccrualTabActivate: function AccrualTabActivate() {
        if (localStorage) {
            localStorage.setItem('pageName', 'Accruals');
        }
        PgAtt.setControllerPage("Accruals");
    },
    HomeTabActivate: function HomeTabActivate() {
        if (localStorage) { localStorage.setItem('pageName', 'Home'); }
        PgAtt.setControllerPage("Home");
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        filter.showHideFilter();
    },
    onTabChange: function onTabChange(tabPanel, tab) {
        var tokenDelimiter = ':';
        var tabs = [],
            ownerCt = tabPanel.ownerCt,
            oldToken, newToken;

        tabs.push(tab.id);
        tabs.push(tabPanel.id);

        while (ownerCt && ownerCt.is('tabpanel')) {
            tabs.push(ownerCt.id);
            ownerCt = ownerCt.ownerCt;
        }

        newToken = tabs.reverse().join(tokenDelimiter);

        oldToken = Ext.History.getToken();

        if (oldToken === null || oldToken.search(newToken) === -1) {
            Ext.History.add(newToken);
        }
    },

    // Handle this change event in order to restore the UI to the appropriate history state
    onAfterRender: function onAfterRender() {
        var tokenDelimiter = ':';
        Ext.History.on('change', function (token) {
            var parts, length, i;

            if (token) {
                parts = token.split(tokenDelimiter);
                length = parts.length;

                // setActiveTab in all nested tabs
                for (i = 0; i < length - 1; i++) {
                    Ext.getCmp(parts[i]).setActiveTab(Ext.getCmp(parts[i + 1]));
                }
            }
        });
    }

});