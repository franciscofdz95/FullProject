(function () {
    if (Ext.getVersion().major >= 5) {
        /**
         * This is an extremely temporary wrapper class.
         * I have a few charts that have dynamic axes/series.
         * Using setSeries/setAxes /should/ remove the old axes/series first,
         * unfortunately, it doesn't.
         * Consequently, I've taken the nuke-it-from-orbit route, which involves
         * deleting the entire chart, and creating it from scratch on the fly.
         * It's quite a bit slower.
         * Once the correct 'update' process is discovered, get rid of this
         * class, and update the appropriate charts.
         */
        Ext.define('BIA.panel.Graph', {
            extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
            alias: 'widget.graph',
            mixins: (Ext.platformTags && Ext.platformTags.modern) ? {} : {
                storeholder: 'Ext.util.StoreHolder'
            },

            layout: 'fit',

            initComponent: function () {
                var me = this;

                me.bindStore(me.store || 'ext-empty-store', true);
                me.callParent(arguments);
            },

            // required by bindable mixin
            getStoreListeners: function () {
                return {
                    beforeLoad: this.onBeforeLoad,
                    datachanged: this.onDataChanged,
                    load: this.onLoad,
                    scope: this
                };
            },

            onBeforeLoad: function () {
                var me = this;
                if (me.getEl()) {
                    me.mask('Loading');
                }
                me.removeAll();
                me.add(Ext.apply({}, { store: me.getStore() }, me.chartConfig));
            },

            onDataChanged: function () { },

            onLoad: function () {
                var me = this;
                if (me.getEl()) {
                    me.unmask();
                }
            },

            Reload: function () {
                this.getStore().reload();
            }
        });

    }
    else {
        Ext.define('BIA.panel.Graph', {
            extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
            alias: 'widget.graph'
        });
    }
}());
