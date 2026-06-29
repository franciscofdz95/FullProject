/* ====================================================================================================
NAME:			[Service Level Filter Controller ]
BEHAVIOR:		Service Level  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/18/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.ServiceLevel', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-ServiceLevel clearCombo': {
                afterrender: this.ServiceLevelAfterRender,
                change: this.ServiceLevelChange,
                clear: this.ServiceLevelClear
            }
        });
    },
    ServiceLevelChange: function ServiceLevelChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setServiceLevel(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setServiceLevel('All');
        }
        me.updateLayout();
    },
    ServiceLevelAfterRender: function ServiceLevelAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    ServiceLevelClear: function ServiceLevelClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setServiceLevel('All');
        this.ServiceLevelChange(me, '');
    }
});