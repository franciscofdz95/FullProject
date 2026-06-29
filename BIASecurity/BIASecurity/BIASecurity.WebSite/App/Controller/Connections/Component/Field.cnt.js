Ext.define('App.Controller.Connections.Component.Field', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Connections-Component-Field-ComboBox': {
                beforequery: this.FieldComboBoxBeforeQuery,
                storebeforeload: this.FieldComboBoxStoreBeforeLoad
            }
        });
    },
    FieldComboBoxBeforeQuery: function FieldComboBoxBeforeQuery(me) {

    },
    FieldComboBoxStoreBeforeLoad: function FieldComboBoxStoreBeforeLoad(me, store, operation) {
        Ext.apply(operation.getProxy().extraParams, operation.getParams());
        operation._params = {};
    }
});