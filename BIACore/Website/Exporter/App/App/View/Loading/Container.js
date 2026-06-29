Ext.define('App.View.Loading.Container', {
    extend: 'App.View.Component.MessageContainer',
    alias: 'widget.App-View-Loading-Container',
    items: [
        { xtype: 'App-View-Loading-Message' },
        { xtype: 'App-View-Loading-Icon' },
        { xtype: 'App-View-Loading-Autoclose', margin: 0 }
    ]
});