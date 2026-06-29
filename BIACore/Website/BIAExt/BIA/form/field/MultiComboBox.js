(function () {
    if (Ext.getVersion().major >= 5) {
        /**
         * Ext5 removed the classic multi-select combobox, and replaced it with
         * Ext.form.field.Tag. This attempts to restore some of the missing functionality.
         *
         * Note that there are some very specific limitations to using this.
         * Going outside of these pre-requisites is not covered (no guarantees about staying
         * inside of them either).
         * 1) Store is intended to be loaded all at once. With editable = false, there will not be any query events.
         * 2) The combobox boundlist has issues with id matching; query = 'local' is required if you intend to 'setValue'. Otherwise there will be a potential for duplicate selections.
         */
        Ext.define('BIA.form.field.MultiComboBox', {
            extend: 'Ext.form.field.ComboBox',
            alias: 'widget.multiCombo',

            /**
             * @cfg {String} [valueField='Id']
             * The model field to return as the 'value' when getValue() is called.
             */
            valueField: 'Id',

            /**
             * @cfg {String} [displayField='Name']
             * The model field to return as the 'display' when getDisplayValue() is called.
             */
            displayField: 'Name',

            /**
             * @cfg {Boolean} [forceSelection=true]
             * Require a selection to match something in the datastore. E.g. no made up values.
             */
            forceSelection: true,

            /**
             * @cfg {Boolean} [autoLoadOnValue=true]
             * Load the datastore if it is not set to autoLoad and a value: param is set.
             */
            autoLoadOnValue: true,

            /**
             * @cfg {String} [queryMode='local']
             * force the combobox to always search the local store, instead of going to the datasource.
             *
             * This is required; the way the DataView is set up, setValue() on an already loaded store will
             * result in a bunch of querying and duplicated "selections".
             */
            queryMode: 'local',

            /**
             * @cfg {Boolean} [multiSelect=true]
             * The whole point of this specialized class...
             */
            multiSelect: true,

            /**
             * @cfg {Boolean} [editable=true]
             * We aren't allowing any free-text input. Users must select from the list.
             */
            editable: false,

            /**
             * @private
             * At some point, I need to fix this to do what it's supposed to do.
             * On change of the datastore (filter, update, etc), remove values from selection
             * that are no longer in the store.
             */
            checkValueOnChange: function () {
                var me = this;
                if (me.multiSelect) {

                } else {
                    me.callParent(arguments);
                }
            },

            /**
             * @private
             * This is the secret sauce. The 5.x implementation sets the model to 'SIMPLE' by default.
             * Changing it to 'MULTI' allows for the actions we expect.
             */
            onBindStore: function () {
                var me = this;

                me.callOverridden(arguments);
                if (me.multiSelect) {
                    me.pickerSelectionModel.setSelectionMode('MULTI');
                }
            }
        });
    }
}());
