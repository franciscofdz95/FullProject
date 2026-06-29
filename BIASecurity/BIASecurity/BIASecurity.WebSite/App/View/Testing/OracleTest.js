Ext.define('App.View.Testing.OracleTest', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Testing-OracleTest',
    store: {
        type: 'webapi',
        api: {
            read: 'api/Oracle/TestOracle'
        }
    }
});