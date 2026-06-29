if (Ext.getVersion().major >= 5) {
    Ext.define('BIA.plugin.ComponentStoreBind', {
        extend: 'Ext.plugin.Abstract',
        alias: 'plugin.componentstorebind',
        pluginId: 'componentstorebind',

        dataField: null,
        hideOnNull: false,
        defaultValue: null,
        neverHide: false,

        handleEvents: function handleEvents(eventName) {
            this.field.fireEvent(eventName, this.field, this);
        },

        init: function pluginComponentStoreBindInit(field) {
            this.field = field;

            this.field.storeBind = {
                dataField: this.dataField
            };

            if (this.field.rendered === true) this.handleEvents('bindtostore');
            else {
                this.field.addListener({
                    beforerender: { fn: this.handleEvents, args: ['bindtostore'] },
                    priority: 9999,
                    scope: this,
                    single: true
                });
            }
        }
    });
}