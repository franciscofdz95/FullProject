/**
 * An extension of the basic Ext window designed to hold a chart.
 */
Ext.define('BIA.window.ChartWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.BIA-window-ChartWindow',

    autoShow: true,
    modal: true,
    width: 800,
    height: 750,
    maximizable: true,
    layout: 'fit',

    initComponent: function () {
        var me = this;
        me.callOverridden(arguments);

        var chart = me.down('[xtype="chart"]'),
            store = chart.getStore();

        store.getProxy().extraParams = me.Filter || {};
        store.load();
    }
});