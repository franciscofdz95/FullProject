Ext.define('App.View.Testing.SQLTest', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Testing-SQLTest',
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/TestSQL'
        }
    }
});