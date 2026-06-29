Ext.define('App.Controller.Component.Form.Field.DateTimePicker', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        this.control({
            'datetimefield': {
                added: this.datetimefieldAdded,
                updatemaxtocurrent: this.UpdateMaxValueToCurrentDate
            }
        });
    },
    datetimefieldAdded: function datetimefieldAdded(me) {
        if (me.lockToCurrentDate === true) {
            this.UpdateMaxValueToCurrentDate(me);
        }
    },
    UpdateMaxValueToCurrentDate: function UpdateMaxValueToCurrentDate(me) {
        if (me && me.lockToCurrentDate === true) {
            me.setMaxValue(Ext.Date.add(new Date(),1,Ext.Date.MINUTE));
            me.checkDirty();
            Ext.defer(this.UpdateMaxValueToCurrentDate, 60000 - ((new Date()).getMilliseconds() + ((new Date()).getSeconds() * 1000)), this, [me]);
        }
    }
});