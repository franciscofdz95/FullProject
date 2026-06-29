/* ====================================================================================================
NAME:			[DestTp Filter Controller ]
BEHAVIOR:		DestTp  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/18/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.DestTp', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-DestTp clearCombo': {
                afterrender: this.DestTpAfterRender,
                change: this.DestTpChange,
                clear: this.DestTpClear
            }
        });
    },
    DestTpChange: function DestTpChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setDestTp(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setDestTp('');
        }
        me.updateLayout();
    },
    DestTpAfterRender: function DestTpAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    DestTpClear: function DestTpClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setDestTp('');
        this.DestTpChange(me, '');
    }
});