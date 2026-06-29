/* ====================================================================================================
NAME:			[Currency Code Filter Controller ]
BEHAVIOR:		Currency Code filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.CurrencyCode', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-CurrencyCode clearCombo': {
                change: this.CurrencyCodeChange
            }
        });
    },
    CurrencyCodeChange: function CurrencyCodeChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setCurrency_code(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setCurrency_code('');
        }
        me.updateLayout();
    }

});