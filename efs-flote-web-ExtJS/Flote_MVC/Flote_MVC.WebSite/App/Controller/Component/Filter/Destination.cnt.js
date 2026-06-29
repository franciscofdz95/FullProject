/* ====================================================================================================
NAME:			[Destination Filter Controller ]
BEHAVIOR:		Destination filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.Destination', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-Destination clearCombo': {
                afterrender: this.DestinationAfterRender,
                change: this.DestinationChange,
                clear: this.DestinationClear
            }
        });
    },
    DestinationChange: function DestinationChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0 && me.store.data.length != 0) {
            me.getTrigger('clear').show();
            PgAtt.setDestination(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setDestination('');
        }
        me.updateLayout();
    },
    DestinationAfterRender: function DestinationAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    DestinationClear: function DestinationClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setDestination('');
        this.DestinationChange(me, '');
    }
});