Ext.define('App.View.Viewport', {
    extend: 'BIA.container.Viewport',
    alias: 'widget.App-View-Viewport',
    layout: 'border',
    defaults: { border: false },
    cls: 'BIASecurity',
    items: [
        { xtype: 'appHeader', region: 'north' },
        //{ xtype: 'BIA-Components-SmartFilter', region: 'west' },
        { xtype: 'mainView', region: 'center', itemId: 'MainView' },
        { xtype: 'appFooter', region: 'south', border: true }
    ]
});