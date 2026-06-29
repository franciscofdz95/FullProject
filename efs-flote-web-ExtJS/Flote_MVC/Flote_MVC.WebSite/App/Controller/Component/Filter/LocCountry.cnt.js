Ext.define('App.Controller.Component.Filter.LocCountry', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-LocCountry clearCombo': {
                afterrender: this.LocCountryAfterRender,
                change: this.LocCountryChange,
                clear: this.LocCountryClear
            }
        });
    },
    LocCountryChange: function LocCountryChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setLocCountry(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setLocCountry('');
        }
        me.updateLayout();
    },
    LocCountryAfterRender: function LocCountryAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    LocCountryClear: function LocCountryClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setLocCountry('');
        this.LocCountryChange(me, '');

      
    }
});