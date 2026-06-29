/* ====================================================================================================
NAME:			[Batch Id Filter Controller ]
BEHAVIOR:		Batch Id filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.BatchId', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-BatchId textfield': {
                change: this.BatchIdChange
            }
        });
    },
    BatchIdChange: function BatchIdChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setInvBatchID(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setInvBatchID('');
        }
        me.updateLayout();
    }

});