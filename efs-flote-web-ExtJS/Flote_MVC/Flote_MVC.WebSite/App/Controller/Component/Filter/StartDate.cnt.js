/* ====================================================================================================
NAME:			[Start Date Filter Controller ]
BEHAVIOR:		Start Date  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.StartDate', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-StartDate datefield': {
                afterrender: this.StartDateAfterRender,
                change: this.StartDateChange
            }
        });
    },
    StartDateChange: function StartDateChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue != null) {
            me.getTrigger('clear').show();
            PgAtt.setStartDateFilter(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setStartDateFilter('');
        }
        me.updateLayout();
    },
    StartDateAfterRender: function StartDateAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    }
});