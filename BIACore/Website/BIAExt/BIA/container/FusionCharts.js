//Ext.define('BIA.container.FusionCharts', {
//    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
//    alias: 'widget.fusioncharts',

//    constructor: function (config) {
//        var me = this,
//            version = Ext.getVersion() || {},
//            config = config || {};

//        if (version.major === 4 && version.minor < 2) { // 4.1
//            // 4.1 doesn't have an inner div; 4.2+ does.
//            Ext.apply(config, {
//                renderTpl: ['<div id="{id}-fusionchart"></div>']
//            });
//        }
//        me.callParent([config]);
//        me.targetdiv = (version.major === 4 && version.minor < 2) ? me.id + '-fusionchart' : me.id + '-innerCt';
//    },

//    listeners: {
//        afterrender: function () {
//        },
//        beforedestroy: function () {
//            // destroy
//            this.chart.destroy();
//        }
//    }
//});