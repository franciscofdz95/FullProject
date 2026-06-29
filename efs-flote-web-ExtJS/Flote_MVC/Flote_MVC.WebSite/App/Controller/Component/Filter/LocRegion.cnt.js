Ext.define('App.Controller.Component.Filter.LocRegion', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-LocRegion clearCombo': {
                afterrender: this.LocRegionAfterRender,
                change: this.LocRegionChange,
                clear: this.LocRegionClear
            }
        });
    },
    LocRegionChange: function LocRegionChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setLocRegion(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setLocRegion('All');
        }
        me.updateLayout();
    },
    LocRegionAfterRender: function LocRegionAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    LocRegionClear: function LocRegionClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setLocRegion('All');
        this.LocRegionChange(me, '');
    }
});