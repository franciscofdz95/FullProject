Ext.define('App.View.Main.GeoPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.App-View-Main-GeoPanel',
    itemId: 'treeGeoTree',    
    title: '<Div style="font-weight:bold; font-size:14px;color:white;">Filter Criteria</Div>',
    items: [{
        xtype: 'App-View-Component-FilteredReport',
        itemId: 'filterItemId',
        layout: {
            type: 'vbox',
            align: 'border'
        },
        baseCls: 'UPS_Blue_2',
        Margin: '5 5 5 5',
        Filter: {
            xtype: 'App-View-Component-FilterFields',
            Margin: '5 5 5 5',
            baseCls: 'UPS_Blue_2'
        }
    }]

});