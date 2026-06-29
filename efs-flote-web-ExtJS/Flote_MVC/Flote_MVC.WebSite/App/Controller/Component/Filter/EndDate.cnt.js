/* ====================================================================================================
NAME:			[End Date Filter Controller ]
BEHAVIOR:		End Date  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.EndDate', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-EndDate datefield': {
                afterrender: this.EndDateAfterRender,
                change: this.EndDateChange
            }
        });
    },
    EndDateChange: function EndDateChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue != null) {
            me.getTrigger('clear').show();
            PgAtt.setEndDateFilter(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setEndDateFilter('');
        }
        me.updateLayout();
    },
    EndDateAfterRender: function EndDateAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    }
});