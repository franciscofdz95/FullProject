BIA.application({
    name: 'App',
    namespaces: [],

    autoAddControllers: true,

    launch: function () {

        Ext.widget({
            xtype: 'viewport',
            layout: 'border',
            defaults: { border: false },
            items: [
                { xtype: 'App-View-Main', region: 'center' }
            ]
        });
    }
});
