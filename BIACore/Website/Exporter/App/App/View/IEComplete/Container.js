Ext.define('App.View.IEComplete.Container', {
    extend: 'App.View.Component.MessageContainer',
    alias: 'widget.App-View-IEComplete-Container',
    items: [
        { xtype: 'App-View-Loading-Message' },
        { xtype: 'App-View-Loading-Icon' },
        { xtype: 'App-View-Loading-Autoclose', margin: 0 }
    ]
});