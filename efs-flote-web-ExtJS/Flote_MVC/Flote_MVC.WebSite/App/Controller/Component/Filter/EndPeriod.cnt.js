/* ====================================================================================================
NAME:			[End Period Filter Controller ]
BEHAVIOR:		End Period  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/31/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.EndPeriod', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-EndPeriod datefield': {
                afterrender: this.EndPeriodAfterRender,
                change: this.EndPeriodChange
            }
        });
    },
    EndPeriodChange: function EndPeriodChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue != null) {
            me.getTrigger('clear').show();
            PgAtt.setEndPeriod(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setEndPeriod('');
        }
        me.updateLayout();
    },
    EndPeriodAfterRender: function EndPeriodAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    }
});