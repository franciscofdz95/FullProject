/* ====================================================================================================
NAME:			[Flote Common Controller ]
BEHAVIOR:		Connects to flote common function/actions for different components.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/21/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Popup.ScannedCoversheetCtrl', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        var me = this;

        me.control({
            'App-View-Component-FilteredReport': {
            }         

        });
    }
    

});