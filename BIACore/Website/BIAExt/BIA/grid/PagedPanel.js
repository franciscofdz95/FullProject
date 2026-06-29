/**
 * A basic Grid definition that includes a bunch of features that we want in most grids.
 * Currently includes:
 * {@link BIA.grid.plugin.Copyable}
 * {@link Ext.toolbar.Paging}
 */
if (Ext.platformTags && Ext.platformTags.modern) {
    Ext.define('BIA.grid.PagedPanel', {
        extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.grid.Grid' : 'Ext.grid.Panel',
        alias: 'widget.pagedgridpanel',

        /**
         * @cfg {Boolean} [autoSize=true]
         * Requires Ext 4.2+
         * If a fixed size is not specified on the column, resize the column to match the data/header length.
         */
        autoSize: true,

        /**
         * @cfg {Boolean} [autoSize=true]
         * Requires Ext 5+
         * Automatically picks the page size appropriate to the grid body height.
         */
        autoPageSize: true,
        skipToolbar: false,

        // TODO: support defining this in the implementing class, as well as here.
        selType: 'rowmodel',
        selModel: { mode: 'MULTI' },
        plugins: [],

        initComponent: function () {
            var me = this,
                ext5 = Ext.getVersion().major >= 5;

            var addCopyable = Ext.each(me.plugins, function (plugin) {
                if (plugin.ptype === 'copyable') {
                    return false;
                }
            });

            if (addCopyable) {
                me.plugins.push({ ptype: 'copyable' });
            }

            if (ext5) {
                // bump the loading mask up to include the header and toolbars.
                /*
                cloning initial viewConfig object for each initiation of the class 
                so that when the viewConfig object is changed for a class instance it does not apply to all instances
                02/18/2015 S. Garrett Hogan
                */
                me.viewConfig = Ext.applyIf(Ext.clone(me.viewConfig || {}), {
                    loadMask: { target: me }
                });
            }

            me.callParent(arguments);

            // bind the paging toolbar to the grid store, if it exists.
            var store = me.getStore(),
                pager = me.down('[xtype="pagingtoolbar"]');
            if (pager) {
                pager.bindStore(store);
            } else {
                if (!me.skipToolbar) {
                    // if it doesn't, create one and add it.
                    pager = Ext.widget('pagingtoolbar', { dock: 'bottom', displayInfo: true });
                    pager.bindStore(store);
                    me.addDocked(pager);
                }
            }

            if (ext5 && me.autoPageSize) {
                me.mon(me, {
                    resize: me.adjustPageSize,
                    afterrender: me.adjustPageSize,
                    scope: me
                });
            }
        },

        //**If modern, remove this because it is a private function in **Ext.dataview.List****
        //bindStore: function (store) {
        //    var me = this;

        //    if (store) {
        //        if (Ext.getVersion().major >= 5) {
        //            me.mon(store, {
        //                metachange: me.onMetaChange,
        //                scope: me
        //            });
        //        }
        //    }

        //    me.callParent(arguments);
        //},

        unbindStore: function (store) {
            var me = this;

            if (store) {
                if (Ext.getVersion().major >= 5) {
                    me.mun(store, {
                        metachange: me.onMetaChange,
                        scope: me
                    });
                }
            }

            me.callParent(arguments);
        },

        /**
         * @private
         * On the store load event, resize the non-fixed-width columns if requested.
         */
        onStoreLoad: function (store) {
            var me = this;

            me.callParent(arguments);

            if (me.autoSize && store.count() > 0) {
                if (me.rendered) {
                    me.autoSize();
                } else {
                    me.on({ afterrender: me.autoSize, scope: me, single: true });
                }
            }
        },

        autoSize: function () {
            var me = this,
                columns = (Ext.getVersion().major >= 5) ? me.getColumnManager().getColumns() : me.columns;

            Ext.each(columns, function (column) {
                if (Ext.isFunction(column.autoSize) && !column.flex) {
                    column.autoSize();
                }
            });
        },

        onMetaChange: function (store, meta) {
            var me = this,
                columns = (Ext.getVersion().major >= 5) ? me.getColumnManager().getColumns() : me.columns,
                fields = [];

            Ext.each(meta.fields || [], function (field) {
                fields.push(field.name);
            });

            me.hideMissingColumns(fields, columns);
        },

        hideMissingColumns: function (fields, columns) {
            Ext.each(columns, function (column) {
                if (column.isGroupHeader) {
                    // iterate over children
                    this.hideMissingColumns(fields, null);
                } else if (column.dataIndex && Ext.Array.indexOf(fields, column.dataIndex) < 0) {
                    column.setVisible(false);
                } else if (this.showColumnsOnMetaChange === true && column.dataIndex && Ext.Array.indexOf(fields, column.dataIndex) > -1) {
                    // Added a config option to enable this in case people are manually hiding columns and want them to stay hidden
                    column.setVisible(true);
                }
            });
        },

        adjustPageSize: function (grid) {
            var view = grid.getView(),
                store = grid.getStore(),
                height = grid.body.getHeight() - 20, // always assume horizontal scrollbar is visible?
                row = (view.getNode(0) ? Ext.get(view.getNode(0)).getHeight() : (Ext.Theme.getTheme() == 'neptune' ? 25 : 21)),
                pageSize = grid.autoPageSize ? Math.floor(height / row) : store.pageSize,
                current = store.getPageSize(),
                features = view.features;

            if (Ext.isIE) pageSize = Math.floor(pageSize);

            if (features && features.length > 0) {
                Ext.each(features, function (feature) {
                    if (BIA.util.Accessors.BaseClassSearch(feature, "BIA.grid.feature.RemoteSummary") || feature.ftype === 'remotesummary') {
                        --pageSize; // remotesummary removes 1 row.
                    }
                });
            }

            if (current !== pageSize && pageSize > 0) {
                // recalculate current page
                var first = (store.currentPage - 1) * current + 1;
                if (grid.autoPageSize) store.setPageSize(pageSize);
                if (store.autoLoad || store.count() > 0) {
                    // reload.
                    store.loadPage(Math.floor(first / pageSize) + 1);
                }
            }
        },

        /**
         * Provide an easy 'reload' event for the panel to automatically reload.
         */
        Reload: function () {
            var me = this,
                pager = me.down('[xtype="pagingtoolbar"]'),
                store = me.getStore();

            if (pager) {
                pager.moveFirst();
            } else {
                store.reload();
            }
        }
    });
}


else {
    Ext.define('BIA.grid.PagedPanel', {
        extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.grid.Grid' : 'Ext.grid.Panel',
        alias: 'widget.pagedgridpanel',

        /**
         * @cfg {Boolean} [autoSize=true]
         * Requires Ext 4.2+
         * If a fixed size is not specified on the column, resize the column to match the data/header length.
         */
        autoSize: true,

        /**
         * @cfg {Boolean} [autoSize=true]
         * Requires Ext 5+
         * Automatically picks the page size appropriate to the grid body height.
         */
        autoPageSize: true,
        skipToolbar: false,

        // TODO: support defining this in the implementing class, as well as here.
        selType: 'rowmodel',
        selModel: { mode: 'MULTI' },
        plugins: [],

        initComponent: function () {
            var me = this,
                ext5 = Ext.getVersion().major >= 5;

            var addCopyable = Ext.each(me.plugins, function (plugin) {
                if (plugin.ptype === 'copyable') {
                    return false;
                }
            });

            if (addCopyable) {
                me.plugins.push({ ptype: 'copyable' });
            }

            if (ext5) {
                // bump the loading mask up to include the header and toolbars.
                /*
                cloning initial viewConfig object for each initiation of the class 
                so that when the viewConfig object is changed for a class instance it does not apply to all instances
                02/18/2015 S. Garrett Hogan
                */
                me.viewConfig = Ext.applyIf(Ext.clone(me.viewConfig || {}), {
                    loadMask: { target: me }
                });
            }

            me.callParent(arguments);

            // bind the paging toolbar to the grid store, if it exists.
            var store = me.getStore(),
                pager = me.down('[xtype="pagingtoolbar"]');
            if (pager) {
                pager.bindStore(store);
            } else {
                if (!me.skipToolbar) {
                    // if it doesn't, create one and add it.
                    pager = Ext.widget('pagingtoolbar', { dock: 'bottom', displayInfo: true });
                    pager.bindStore(store);
                    me.addDocked(pager);
                }
            }

            if (ext5 && me.autoPageSize) {
                me.mon(me, {
                    resize: me.adjustPageSize,
                    afterrender: me.adjustPageSize,
                    scope: me
                });
            }
        },

        bindStore: function (store) {
            var me = this;

            if (store) {
                if (Ext.getVersion().major >= 5) {
                    me.mon(store, {
                        metachange: me.onMetaChange,
                        scope: me
                    });
                }
            }

            me.callParent(arguments);
        },

        unbindStore: function (store) {
            var me = this;

            if (store) {
                if (Ext.getVersion().major >= 5) {
                    me.mun(store, {
                        metachange: me.onMetaChange,
                        scope: me
                    });
                }
            }

            me.callParent(arguments);
        },

        /**
         * @private
         * On the store load event, resize the non-fixed-width columns if requested.
         */
        onStoreLoad: function (store) {
            var me = this;

            me.callParent(arguments);

            if (me.autoSize && store.count() > 0) {
                if (me.rendered) {
                    me.autoSize();
                } else {
                    me.on({ afterrender: me.autoSize, scope: me, single: true });
                }
            }
        },

        autoSize: function () {
            var me = this,
                columns = (Ext.getVersion().major >= 5) ? me.getColumnManager().getColumns() : me.columns;

            Ext.each(columns, function (column) {
                if (Ext.isFunction(column.autoSize) && !column.flex) {
                    column.autoSize();
                }
            });
        },

        onMetaChange: function (store, meta) {
            var me = this,
                columns = (Ext.getVersion().major >= 5) ? me.getColumnManager().getColumns() : me.columns,
                fields = [];

            Ext.each(meta.fields || [], function (field) {
                fields.push(field.name);
            });

            me.hideMissingColumns(fields, columns);
        },

        hideMissingColumns: function (fields, columns) {
            Ext.each(columns, function (column) {
                if (column.isGroupHeader) {
                    // iterate over children
                    this.hideMissingColumns(fields, null);
                } else if (column.dataIndex && Ext.Array.indexOf(fields, column.dataIndex) < 0) {
                    column.setVisible(false);
                } else if (this.showColumnsOnMetaChange === true && column.dataIndex && Ext.Array.indexOf(fields, column.dataIndex) > -1) {
                    // Added a config option to enable this in case people are manually hiding columns and want them to stay hidden
                    column.setVisible(true);
                }
            });
        },

        adjustPageSize: function (grid) {
            var view = grid.getView(),
                store = grid.getStore(),
                height = grid.body.getHeight() - 20, // always assume horizontal scrollbar is visible?
                row = (view.getNode(0) ? Ext.get(view.getNode(0)).getHeight() : (Ext.Theme.getTheme() == 'neptune' ? 25 : 21)),
                pageSize = grid.autoPageSize ? Math.floor(height / row) : store.pageSize,
                current = store.getPageSize(),
                features = view.features;

            if (Ext.isIE) pageSize = Math.floor(pageSize);

            if (features && features.length > 0) {
                Ext.each(features, function (feature) {
                    if (BIA.util.Accessors.BaseClassSearch(feature, "BIA.grid.feature.RemoteSummary") || feature.ftype === 'remotesummary') {
                        --pageSize; // remotesummary removes 1 row.
                    }
                });
            }

            if (current !== pageSize && pageSize > 0) {
                // recalculate current page
                var first = (store.currentPage - 1) * current + 1;
                if (grid.autoPageSize) store.setPageSize(pageSize);
                if (store.autoLoad || store.count() > 0) {
                    // reload.
                    store.loadPage(Math.floor(first / pageSize) + 1);
                }
            }
        },

        /**
         * Provide an easy 'reload' event for the panel to automatically reload.
         */
        Reload: function () {
            var me = this,
                pager = me.down('[xtype="pagingtoolbar"]'),
                store = me.getStore();

            if (pager) {
                pager.moveFirst();
            } else {
                store.reload();
            }
        }
    });
}