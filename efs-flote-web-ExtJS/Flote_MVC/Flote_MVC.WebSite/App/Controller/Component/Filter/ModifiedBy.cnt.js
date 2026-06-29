/* ====================================================================================================
NAME:			[Modified By Filter Controller ]
BEHAVIOR:		Modified By filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.ModifiedBy', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-ModifiedBy textfield': {
                change: this.ModifiedByChange
            }
        });
    },
    ModifiedByChange: function ModifiedByChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setModifiedBy(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setModifiedBy('');
        }
        me.updateLayout();
    }

});