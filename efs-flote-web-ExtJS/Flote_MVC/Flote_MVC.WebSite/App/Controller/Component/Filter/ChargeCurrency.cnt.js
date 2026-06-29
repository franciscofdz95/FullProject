/* ====================================================================================================
NAME:			[Charge Currency Filter Controller ]
BEHAVIOR:		Charge Currency filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/12/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.ChargeCurrency', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-ChargeCurrency textfield': {
                change: this.ChargeCurrencyChange
            }
        });
    },
    ChargeCurrencyChange: function ChargeCurrencyChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setChargeCurrency(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setChargeCurrency('');
        }
        me.updateLayout();
    }

});