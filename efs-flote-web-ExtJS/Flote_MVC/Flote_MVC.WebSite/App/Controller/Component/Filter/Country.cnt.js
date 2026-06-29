/* ====================================================================================================
NAME:			[Country Filter Controller ]
BEHAVIOR:		Country filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.Country', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-Country clearCombo': {
                afterrender: this.CountryAfterRender,
                change: this.CountryChange,
                clear: this.CountryClear
            }
        });
    },
    CountryChange: function CountryChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setCountry_code(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setCountry_code('');
        }
        me.updateLayout();
    },
    CountryAfterRender: function CountryAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    CountryClear: function CountryClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setCountry_code('');
        this.CountryChange(me, '');
    }
});