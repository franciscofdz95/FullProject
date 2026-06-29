BIA.application({
    name: 'App',
    namespaces: [],

    autoAddControllers: true,

    launch: function () {
        //App.History.init();

        Ext.widget({
            xtype: 'viewport',
            layout: 'border',
            defaults: { border: false },
            items: [
                { xtype: 'App-Desktop', region: 'center' }
            ]
        });

        //App.History.notifyLoaded();
    }
});
