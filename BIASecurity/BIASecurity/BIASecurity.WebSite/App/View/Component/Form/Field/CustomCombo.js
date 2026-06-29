//THIS IS ONLY THE PARENT CLASS AND SHOULD NEVER BE INSTANTIATED DIRECTLY

Ext.define('App.View.Component.Form.Field.CustomCombo', {
    extend: 'BIA.form.field.ClearableComboBox',
    alias: 'widget.App-View-Component-Form-Field-CustomCombo',

    minChars: 1,
    displayField: 'display_field',
    valueField: 'value_field',
    forceSelection: true,
    matchFieldWidth: true,
    anyMatch: true,

    maxLength: 500,

    //used to automatically set dependent combo filters
    dependents: [],
    dependent_parent: 'container',  //what parent to go up to
    //dependent_key: '{param_key}'    //different for each combo

    required_keys: [],

    //set to disabled if any of the required_keys are not set
    checkRequirements: function CheckRequirements() {
        var me = this,
            store = me.getStore();

        //don't do anything if no requirements
        if (!me['required_keys'] || me['required_keys'].length < 1)
            return;

        //check each requirements
        for (var i = 0; i < me.required_keys.length; i++) {
            if (store.proxy.extraParams[me.required_keys[i]] === undefined || store.proxy.extraParams[me.required_keys[i]] === null) {
                //if value not set, disable and return
                me.setValue(null);
                me.setDisabled(true);
                me.store.load();
                return;
            }
        }

        //passed all requirements, reenable
        me.setDisabled(false);

        //if we are not trying to set the value manually, reload store
        if (!me['stored_value'] && !me.store.loading)
            me.store.load();
    },

    //Bug fix where field would reset with slow typers, copied directly from source... https://docs.sencha.com/extjs/5.1.1/api/src/ComboBox.js.html
    checkValueOnChange: function checkValueOnChange() {
        var me = this,
            store = me.getStore();

        // Will be triggered by removal of filters upon destroy 
        if (!me.destroying && store.isLoaded()) {
            // If multiselecting and the base store is modified, we may have to remove records from the valueCollection 
            // if they have gone from the base store, or update the rawValue if selected records are mutated. 
            // TODO: 5.1.1: Use a ChainedStore for multiSelect so that selected records are not filtered out of the 
            // base store and are able to be removed. 
            // See https://sencha.jira.com/browse/EXTJS-16096 
            if (me.multiSelect) {
                // TODO: Implement in 5.1.1 when selected records are available for modification and not filtered out. 
                // valueCollection must be in sync with what's available in the base store, and rendered rawValue/tags 
                // must match any updated data. 
            }
            else {
                if (me.forceSelection && !me.changingFilters && !me.findRecordByValue(me.value)) {
                    // skip this if query mode is remote and the user is typing 
                    if (me.queryMode !== 'local' && me.hasFocus) {
                        return;
                    }
                    me.setValue(null);
                }
            }
        }
    },

    setStoreValue: function setStoreValue(value, display) {
        var me = this,
            store = me.getStore();

        //if already in store, set the combobox value
        if (value === null) {// || me.findRecordByValue(value)) {
            me.setValue(value);
            console.log("VALUE IS NULL!!!!");
            return;
        }

        //otherwise set values and reload store
        me['stored_value'] = value;
        me['stored_display_value'] = display;

        me.setRawValue(display);


        store.load();

    }
});