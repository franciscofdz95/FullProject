Ext.define('App.view.Browser.GroupGrid', {
    extend: 'App.view.Browser.Grid',
    alias: 'widget.App-Browser-GroupGrid',

    store: {
        type: 'webapi',
        api: {
            read: 'api/AppLog/BrowserGroup'
        }
    }
});