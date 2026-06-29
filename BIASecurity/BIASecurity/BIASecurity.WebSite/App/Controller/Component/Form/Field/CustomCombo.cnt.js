Ext.define('App.Controller.Component.Form.Field.CustomCombo', {
    extend: 'Ext.app.Controller',

    init: function init() {

        this.control({
            'App-View-Component-Form-Field-CustomCombo': {
                afterrender: this.AfterRender,
                change: this.Change,
                storebeforeload: this.StoreBeforeLoad,
                storeload: this.StoreLoad
            }
        });

    },

    AfterRender: function AfterRender(me, eOpts) {
        me.checkRequirements();
    },

    Change: function Change(me, newVal, oldVal, eOpts) {
        //get the parent container (or whatever is defined as the parent)
        var parent = me.dependent_parent ? me.up(me.dependent_parent) : me.up('container');
        var dependent_key = me['dependent_key'],
            dependent_value = newVal;

        var next;
        //if an array, set the key value of all dependents
        //testing//console.log(me.dependents);
        if (me.dependents && me.dependents.length > 0) {
            for (var i = 0; i < me.dependents.length; i++) {
                //testing//console.log(me.dependents[i]);
                next = parent.down(me.dependents[i]);
                next.store.proxy.extraParams[dependent_key] = dependent_value;
                next.checkRequirements();
            }
        }
        //if string, set the key value of the dependent
        else if (typeof (me.dependents) === 'string' && me.dependents.length > 0) {
            next = parent.down(i);
            next.store.proxy.extraParams[dependent_key] = dependent_value;
            next.checkRequirements();
        }
    },

    StoreBeforeLoad: function StoreBeforeLoad(me, store, operation, eOpts) {
        store.proxy.extraParams['manual_query'] = (me['stored_display_value'] ? me['stored_display_value'] : me['stored_value']);

        if (me['stored_display_value']) {
            me.setRawValue(me['stored_display_value']);
            me['stored_display_value'] = null;
        }

        //filters for apis that are commonly used across comboboxes
        if (me['only_active']) {
            store.proxy.extraParams['only_active'] = me['only_active'];
        }
        if (me['only_approver']) {
            store.proxy.extraParams['only_approver'] = me['only_approver'];
        }
        if (me['only_template']) {
            store.proxy.extraParams['only_template'] = me['only_template'];
        }
        if (me['only_emergency']) {
            store.proxy.extraParams['only_emergency'] = me['only_emergency'];
        }
        if (me['desired_field']) {
            store.proxy.extraParams['desired_field'] = me['desired_field'];
        }

    },

    StoreLoad: function StoreLoad(me, store, records, success, operation, eOpts) {
        if (me['stored_value']) {
            me.setValue(me['stored_value']);
            me['stored_value'] = null;
        }
    }

});