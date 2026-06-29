/* ====================================================================================================
NAME:			[Bills Logged Controller]
BEHAVIOR:		Bills Logged Events & Actions.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Bills.Logged', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Bills-Logged-Report': {
                activate: this.LoggedTabActivate
            }
        });
    },
    LoggedTabActivate: function LoggedTabActivate(tab) {
        if ((BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete == 1
            || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_DeleteUnapproveOnly == 1)
            && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 1
            && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 3) {
            var grid = tab.down('App-View-Bills-Grid');
            if (grid) {
                var actionColDelete = Ext.Array.findBy(grid.getColumns(), function (c) { return c.itemId == 'actionColDelete'; });
                if (actionColDelete) actionColDelete.setVisible(true);
            }
        }
    }
});