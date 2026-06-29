
/* ====================================================================================================
NAME:			[Received Date Filter Controller ]
BEHAVIOR:		Received Date  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.ReceivedDate', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-ReceivedDate datefield': {
                afterrender: this.ReceivedDateAfterRender,
                change: this.ReceivedDateChange
            }
        });
    },
    ReceivedDateChange: function ReceivedDateChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue != null) {
            me.getTrigger('clear').show();
            PgAtt.setRcvdAtDate(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setRcvdAtDate('');
        }
        me.updateLayout();
    },
    ReceivedDateAfterRender: function ReceivedDateAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    }
});