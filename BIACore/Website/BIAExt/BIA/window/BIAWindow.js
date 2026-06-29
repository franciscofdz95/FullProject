/**
 * An extension of the basic Ext window designed to hold a chart.
 */
Ext.define('BIA.window.BIAWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.biawindow',

    autoShow: true,
    modal: true,
    maximizable: true,
    width: 800,
    height: 750,

    layout: 'fit',

    constructor: function (config) {
        var me = this,
            config = config || {},
            size = Ext.getBody().getViewSize();

        config.width = Math.min(me.width || Infinity, config.width || Infinity, (size.width || Infinity) - 100);
        config.height = Math.min(me.height || Infinity, config.height || Infinity, (size.height || Infinity) - 100);

        me.callParent([config]);
    }

});