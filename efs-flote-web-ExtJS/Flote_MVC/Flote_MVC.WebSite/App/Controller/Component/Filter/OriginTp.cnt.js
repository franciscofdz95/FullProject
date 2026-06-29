/* ====================================================================================================
NAME:			[OriginTp Filter Controller ]
BEHAVIOR:		OriginTp  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/18/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.OriginTp', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-OriginTp clearCombo': {
                afterrender: this.OriginTpAfterRender,
                change: this.OriginTpChange,
                clear: this.OriginTpClear
            }
        });
    },
    OriginTpChange: function OriginTpChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setOriginTp(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setOriginTp('');
        }
        me.updateLayout();
    },
    OriginTpAfterRender: function OriginTpAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    OriginTpClear: function OriginTpClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setOriginTp('');
        this.OriginTpChange(me, '');
    }
});