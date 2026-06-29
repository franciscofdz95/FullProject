if (Ext.getVersion().major >= 5) {
    Ext.define('BIA.Plugin.Component.ClickConfirmation', {
        extend: 'Ext.plugin.Abstract',
        alias: 'plugin.clickconfirmation',
        pluginId: 'clickconfirmation',



        handleEvents: function handleEvents(eventName) {
            this.cmp.fireEvent(eventName, this.cmp, this);
        },
        init: function pluginClickConfirmationInit(cmp) {
            this.cmp = cmp;
            cmp.clickConfirmation = this;

            if (this.cmp.rendered === true) this.handleEvents('clickConfirmationInit');
            else {
                this.cmp.addListener({
                    beforerender: { fn: this.handleEvents, args: ['clickConfirmationInit'] },
                    priority: 9999,
                    scope: this,
                    single: true
                });
            }
        }
    });
}