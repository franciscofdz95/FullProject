/* ====================================================================================================
NAME:			[Origin Filter Controller ]
BEHAVIOR:		Origin  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.Origin', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-Origin clearCombo': {
                afterrender: this.OriginAfterRender,
                change: this.OriginChange,
                clear: this.OriginClear
            }
        });
    },
    OriginChange: function OriginChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0 && me.store.data.length != 0) {
            me.getTrigger('clear').show();
            PgAtt.setOrigin(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setOrigin('');
        }
        me.updateLayout();
    },
    OriginAfterRender: function OriginAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    OriginClear: function OriginClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setOrigin('');
        this.OriginChange(me, '');
    }
});