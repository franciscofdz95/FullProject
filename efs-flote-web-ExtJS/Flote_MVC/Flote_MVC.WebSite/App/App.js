/* ====================================================================================================
NAME:			[Page Intitalization for Flote Application]
BEHAVIOR:		Page Intitalization for Flote Application.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.require([
    'Ext.util.History',
    'Ext.tab.Panel'
]);

BIA.application({
    name: 'App',
    namespaces: ['App'], //Namespaces (aka directories) to search for controllers, used by autoAddControllers.
    enableQuickTips: true,
    autoAddControllers: true,

    launch: function () {
        // launch a viewport
        // the default 'landing page' for the application
        var viewport = 'App-View-Viewport';

        Ext.widget(viewport, {
            templateVersion: {
                major: 1,
                minor: 2,
                toString: function () {
                    return this.major + '.' + this.minor;
                }
            }
        });
    }


});
