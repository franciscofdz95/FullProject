/* ====================================================================================================
NAME:			[Start Period Filter Controller ]
BEHAVIOR:		Start Period  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/31/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.StartPeriod', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-StartPeriod datefield': {
                afterrender: this.StartPeriodAfterRender,
                change: this.StartPeriodChange
            }
        });
    },
    StartPeriodChange: function StartPeriodChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue != null) {
            me.getTrigger('clear').show();
            PgAtt.setStartPeriod(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setStartPeriod('');
        }
        me.updateLayout();
    },
    StartPeriodAfterRender: function StartPeriodAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    }
});