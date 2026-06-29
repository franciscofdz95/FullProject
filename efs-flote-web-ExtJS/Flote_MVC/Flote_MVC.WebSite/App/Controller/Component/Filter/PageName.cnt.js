/* ====================================================================================================
NAME:			[Page Name Filter Controller ]
BEHAVIOR:		Page Name filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.PageName', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-PageName textfield': {
                change: this.PageNameChange
            }
        });
    },
    PageNameChange: function PageNameChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
        } else {
            me.getTrigger('clear').hide();
        }
        me.updateLayout();
    }

});