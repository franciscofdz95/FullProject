/* ====================================================================================================
NAME:			[Display Curr Filter Controller ]
BEHAVIOR:		Display Curr  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.DisplayCurr', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-DisplayCurr combobox': {
                afterrender: this.DisplayCurrAfterRender,
                change: this.DisplayCurrChange

            }
        });
    },
    DisplayCurrChange: function DisplayCurrChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            PgAtt.setDisplay_currency(newValue);
            PgAtt.setUserPreference(PgAtt.getUserId(), 'display_currency', 'All', newValue);
        } else {
            PgAtt.setDisplay_currency('');
        }
        me.updateLayout();
    },
    DisplayCurrAfterRender: function DisplayCurrAfterRender(me) {
        PgAtt.getCurrencyCodes(PgAtt.getLocation_code(), me);
    }

});