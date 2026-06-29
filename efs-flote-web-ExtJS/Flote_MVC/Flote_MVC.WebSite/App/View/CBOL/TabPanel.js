/* ====================================================================================================
NAME:			[CBOL Tab  Panel]
BEHAVIOR:		Shows CBOL Tab Panel.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/29/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.CBOL.TabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.App-View-CBOL-TabPanel',
    // activeTab: 2,
    // cls: 'tabpanel',    
    items: [

        {
            xtype: 'App-View-CBOL-All-Report',
            title: 'All',
            itemId: 'cbolAll'
        },
        {
            xtype: 'App-View-CBOL-Matched-Report',
            title: 'Matched',
            itemId: 'cbolMatched'
        },
        {
            xtype: 'App-View-CBOL-NonMatched-Report',
            title: 'Non-Matched',
            itemId: 'cbolNonMatched'
        },
        {
            xtype: 'App-View-CBOL-Selected-Report',
            title: 'Selected',
            itemId: 'cbolSelected'
        }

    ]

});