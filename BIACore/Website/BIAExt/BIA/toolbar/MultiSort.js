/**
 * Defines a toolbar that allows for easy client manipulation of multiple sort columns.
 * Allows for columns to be pre-defined, or added on the fly.
 * Uses the ux's {@link Ext.ux.BoxReorderer} and {@link Ext.ux.ToolbarDroppable}
 */
Ext.define('BIA.toolbar.MultiSort', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Toolbar' : 'Ext.toolbar.Toolbar',
    alias: 'widget.multisorttoolbar',

    /**
     * @cfg {Number} [maxSorters=5]
     * Limits the maximum number of sorters available to the user at once.
     * Really a pretty arbitrary number; we need it more for screen constraints than anything else.
     */
    maxSorters: 5,

    /**
     * @cfg {Boolean} [sortOnDrop=true]
     * Sort the grid when a new item is dropped on the toolbar?
     */
    sortOnDrop: true,

    mixins: (Ext.getVersion().major < 5) ? {
        bindable: 'Ext.util.Bindable'
    } : (Ext.platformTags && Ext.platformTags.modern) ? {} : {
        storeholder: 'Ext.util.StoreHolder'
    },

    plugins: [
        {
            ptype: 'boxreorderer',
            listeners: {
                Drop: function (r, c, button) {
                    return this.cmp.updateSort(button, false);
                }
            }
        },
        {
            ptype: 'toolbardroppable',
            /**
             * Creates the new toolbar item from the drop event
             */
            createItem: function (data) {
                var header = data.header || {},
                    reorderer = (header.ownerCt || {}).reorderer;

                // Hide the drop indicators of the standard HeaderDropZone
                // in case user had a pending valid drop in 
                if (reorderer) {
                    reorderer.dropZone.invalidateDrop();
                }

                return this.toolbar.createSortButton({
                    text: header.text,
                    sortData: {
                        property: header.dataIndex,
                        direction: 'ASC'
                    }
                });
            },
            /**
             * Custom canDrop implementation which returns true if a column can be added to the toolbar
             * @param {Object} data Arbitrary data from the drag source. For a HeaderContainer, it will
             * contain a header property which is the Header being dragged.
             * @return {Boolean} True if the drop is allowed
             */
            canDrop: function (dragSource, event, data) {
                var toolbar = this.toolbar,
                    sorters = toolbar.getSorters(),
                    header = data.header,
                    length = sorters.length,
                    entryIndex = this.calculateEntryIndex(event),
                    targetItem = toolbar.getComponent(entryIndex),
                    i;

                // don't allow more than maxSorters items.
                if (length >= toolbar.maxSorters) {
                    return false;
                }

                // Group columns have no dataIndex and therefore cannot be sorted
                // If target isn't reorderable it could not be replaced
                if (!header.dataIndex || !header.sortable || (targetItem && targetItem.reorderable === false)) {
                    return false;
                }

                for (i = 0; i < length; i++) {
                    if (sorters[i].property === header.dataIndex) {
                        return false;
                    }
                }
                return true;
            },
            /**
             * An item is dropped on the bar; apply it to the sort?
             */
            afterLayout: function () { this.toolbar.doSort(true); }
        }
    ],

    /**
     * @private
     * Used for creating the buttons on the toolbar initially.
     * This way, items can be specified in the config, and they're automatically inserted in the right place.
     * @returns {Object[]} the array of items this toolbar contains.
     */
    getSortingItems: function () {
        var me = this,
            items = me.items || [],
            buttons = [];

        Ext.each(items, function (item) {
            buttons.push(me.createSortButton(item));
        });

        me.defaultButtons = buttons;

        return [].concat(
        [
            { xtype: 'tbtext', text: 'Sort order:', reorderable: false, removable: false },
            { xtype: 'tbtext', text: ' Drag column headers to this bar to sort...', itemId: 'HelpTextId', reorderable: true, removable: false, hidden: true, hideMode: 'visibility'}
        ],
        buttons,
        [
            { xtype: 'tbfill', reorderable: true, removeAfter: true, removable: false },
            { xtype: 'tbseparator', reorderable: false, removable: false },
            { xtype: 'tbtext', text: 'Drag here to remove', reorderable: false, removable: false }
        ]);
    },

    initComponent: function () {
        var me = this;

        me.items = me.getSortingItems();

        me.callParent(arguments);

        var grid = me.isContained || me.findParentByType('grid');
        if (grid) {
            // late bind the store
            me.bindStore(grid.getStore());

            // override each column's default sort handler
            Ext.each(grid.columns, function (col) {
                col.setSortState = Ext.emptyFn;
            });

            // override the grid's default sort handler.
            if (grid.headerCt) {
                grid.headerCt.setSortState = Ext.emptyFn;
                grid.headerCt.onSortAscClick = Ext.emptyFn;
                grid.headerCt.onSortDescClick = Ext.emptyFn;
                // added for Ext5's spreadsheet selection model. abuse it.
                grid.headerCt.sortOnClick = false;
            }
        }

        // bind our dropzone to the header's drop zone.
        me.on({
            scope: me,
            afterrender: me.registerWithHeader
        });

        // find out the 'removeAfter' item id.
        me.items.each(function (item) {
            if (item.removeAfter) {
                me.removeAfterId = item.id;
            }
        });

        // apply any initial sorters to the store, but don't sort it.
        if (Ext.getVersion().major >= 5) {
            var sorters = me.getStore().getSorters(),
                helpText = Ext.ComponentQuery.query('#HelpTextId');

            sorters.suspendEvent('endupdate');
            sorters.removeAll();
            sorters.add(me.getSorters());
            if (sorters.length == 0) helpText[0].show();
            sorters.resumeEvent('endupdate');
        } else {
            me.getStore().sort(me.getSorters(), null, false);
        }
    },

    /**
     * @private
     * Applies defaults to the sortButton config passed in.
     * @param {Object} config the config to edit
     * @returns {Object} the configured button xtype
     */
    createSortButton: function (config) {
        var toolbar = this,
            config = config || {};

        return Ext.applyIf(config, {
            xtype: 'button',
            iconAlign: 'right',
            iconCls: 'icon-sort_ascending',
            reorderable: true,
            removable: true,
            text: 'Unknown',
            sortData: {
                property: 'Unknown',
                direction: "ASC"
            },
            handler: function () {
                toolbar.updateSort(this, true);
            }
        });
    },

    /**
     * Returns the array of sort elements to be applied to the store.
     * @returns {Ext.util.Sorter[]} the array of sort items.
     */
    getSorters: function () {
        var me = this,
            sorters = [];

        Ext.each(me.query('button'), function (button) {
            sorters.push(button.sortData);
        }, me);

        return sorters;
    },

    /**
     * @private
     * Method used to register our 'toolbardroppable' with the grid's header's drag-and-drop group.
     * Necessary to allow dragging from the header to our toolbar.
     */
    registerWithHeader: function () {
        var me = this;
        me.plugins[1].addDDGroup('header-dd-zone-' + me.container.id);
    },

    /**
     * Method to apply sorting to the target grid.
     * @param {Boolean} [dropped=undefined]
     * Whether or not we are being called because a new button was dropped.
     */
    doSort: function (dropped) {
        var me = this;

        if (dropped && !me.sortOnDrop) { return; }

        //me.getStore().sort(me.getSorters());
        var sorters = me.getSorters(),
            store = me.getStore(),
            helpText = Ext.ComponentQuery.query('#HelpTextId');

        // fix a problem in store.sort() with an empty array
        if (sorters.length) {
            helpText[0].hide();
            store.sort(sorters);
        } else {
            store.sorters.clear();
            helpText[0].show();
            if (store.currentPage === 1) {
                store.load();
            } else {
                store.loadPage(1);
            }
        }
    },

    /**
     * Change the sort status of the grid based on a button order or a button direction change.
     * @param {Ext.toolbar.Item} button the button that was pressed
     * @param {Boolean} changeDirection whether or not we're performing a sort direction change
     */
    updateSort: function (button, changeDirection) {
        var me = this,
            items = me.items,
            sortData = button.sortData,
            iconCls = button.iconCls;

        // determine if button wanted to be removed
        if (items.indexOfKey(me.removeAfterId) < items.indexOf(button)) {
            if (button.removable) {
                me.remove(button, false);
            } else {
                // need to push the button to removeafter index - 1.
            }
        } else if (sortData && changeDirection) {
            button.sortData.direction = Ext.String.toggle(button.sortData.direction, "ASC", "DESC");
            button.setIconCls(Ext.String.toggle(iconCls, "icon-sort_ascending", "icon-sort_descending"));
        }
        me.doSort(false);
    },

    /**
     * Remove all sort items from the toolbar
     */
    reset: function (removeAll) {
        var me = this,
            sorters = me.getStore().sorters;

        me.items.each(function (item) {
            if (item.removable !== false) {
                me.remove(item);
            }
        });
        sorters.clear();

        if (removeAll) {
            var items = me.defaultButtons || [];
            me.suspendEvents(true);
            for (var i = items.length - 1; i > 0; --i) {
                me.insert(1, items[i]);
            }
            me.resumeEvents(false);
            sorters.add(me.getSorters());
        }
    }
    
});