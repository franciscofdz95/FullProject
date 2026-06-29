/**
 * This is a utility container that enables some recursive functions for getting/setting Filter-level parameters.
 */
Ext.define('BIA.container.FilterContainer', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.filterContainer',
    layout: { type: 'hbox' },
    defaults: { padding: '0 4 0 1' },

    /**
     * @cfg {string} prefix
     * Defines a prefix to be applied to any contained items; allows the re-use of the same control in the same page
     * without any modifications to the control itself.
     */
    prefix: '',

    /**
     * @cfg {Object} [defaultValues={}]
     * An object with values that should be used as defaults on creation for any contained controls.
     * Works as if these values were passed in from a referring source.
     */
    defaultValues: {},

    /**
     * @private
     */
    constructor: function (config) {
        var me = this,
            config = config || {};

        if (Ext.getVersion().major >= 5) {
            me.filterPending = 0;
            me.filterFire = false;
        } else {
            me.filterEvents = {
                ready: 'filterReady'
            };
            me.filterPending = {};
            for (var prop in me.filterEvents) {
                //me.addEvents(me.filterEvents[prop]);
                me.filterPending[prop] = 0;
                me.filterPending[prop + 'Fire'] = false;
            }
        }
        me.callParent([config]);
    },

    add: function () {
        var me = this;

        if (Ext.getVersion().major >= 5) {
            var items = Ext.Array.from(me.callParent(arguments));
            Ext.each(items, function (item) {
                me.mon(item, 'filterReady', me.FilterContainer_Ready, me);
            });
            return items;
        } else {
            return me.callParent(arguments);
        }
    },

    /**
     * Method called when a direct descendant fires the filter ready event.
     * @param {Object} component the component that fired ready.
     */
    FilterContainer_Ready: function () {
        var me = this;

        // a child component has reported it is ready.
        me.filterPending--;
        // decide if we are ready.
        if (me.filterFire && me.filterReady <= 0) {
            me.fireEvent('filterReady', me);
        }
    },

    /**
     * Function for getting all of the filter parameters for any items contained by this container.
     * use Ext.override to replace this default functionality if necessary
     * @returns {Object} a json object of parameters
     */
    GetParameters: function () {
        var me = this,
            params = {};

        me.items.each(function (item) {
            if (item.isHidden() && item.getXTypes().indexOf('hiddenfield') < 0) {
                // hidden items don't get to report parameters
                // hidden fields do
            } else if (item.GetParameters) {
                // if we contain FilterContainers, recurse
                Ext.apply(params, item.GetParameters());
            } else if (typeof (item.itemId) === 'undefined') {
                // before we go to getValue, we need to make sure there is an itemId field
            } else if (item.getValue) {
                // stop buttons and labels from accidentally injecting themselves
                params[me.prefix + item.itemId] = item.getValue();
                // TODO: remove this when ext3 isn't necessary.
                //if (item.getDisplayValue)
                //    params[me.prefix + item.itemId + 'Name'] = item.getDisplayValue();
            }
        });

        return params;
    },

    /**
     * Function for getting the list of columns to show/hide based on the current parameters contained.
     * use Ext.override to replace this default functionality if necessary
     * @returns {Object} a json object of booleans to show/hide columns given with the property name
     */
    GetColumnVisibility: function () {
        var me = this,
            params = {};

        me.items.each(function (item) {
            if (item.isHidden()) {
                // hidden items don't get to report visibility
            } else if (item.GetColumnVisibility) {
                Ext.apply(params, item.GetColumnVisibility());
            }
        });

        return params;
    },

    /**
     * Function for getting any dynamic column header values based on the current parameter set.
     * use Ext.override to replace this default functionality if necessary
     * @returns {Object} a json object of strings to update the column titles
     */
    GetColumnTitles: function () {
        var me = this,
            params = {};

        me.items.each(function (item) {
            if (item.isHidden()) {
                // hidden items don't get to report visibility
            } else if (item.GetColumnTitles) {
                Ext.apply(params, item.GetColumnTitles());
            }
        });

        return params;
    },

    /**
     * Function for setting parameters provided by the given object to all child components.
     * use Ext.override to replace this default functionality if necessary
     * @param {Object} params the array of params to apply
     */
    SetParameters: function (params, silent) {
        var me = this;

        me.preFilterPending();
        // regular container that needs to iterate over contents.
        me.items.each(function (item) {
            me.SetComponentParameters(item, params, silent);
        });
        me.postFilterPending();
    },

    /**
     * @private
     * Internal call for SetParameters; factored out to allow filterCard access to the same method.
     * @param {Object} cmp a contained component
     * @param {Object} params the params object to apply
     */
    SetComponentParameters: function (cmp, params, silent) {
        var me = this,
            defaults = me.defaultValues || [];

        // protection against nulls
        if (!cmp) { return; }
        // a filtercontainer is disabled, don't bother with any childrens.
        if (cmp.FilterDisabled) { return; }

        if (cmp.SetParameters) {
            if (Ext.getVersion().major >= 5) {
                me.filterPending++;
            } else {
                me.filterPending.ready++;
            }
            cmp.SetParameters(params);
        } else if (cmp.setValue) {
            var value = params[me.prefix + cmp.itemId] || defaults[cmp.itemId] || [],
                lock = params[me.prefix + cmp.itemId + "_lock"] || defaults[cmp.itemId + "_lock"] || false;

            cmp.setValue(value, silent);
            cmp.setDisabled(lock);
        }
    },

    /**
     * @private
     * Tells the filterPending system that we need to monitor our children for filterReady events.
     */
    preFilterPending: function () {
        var me = this;
        // suspend fireReady events
        if (Ext.getVersion().major >= 5) {
            me.filterPending = 0;
            me.filterFire = false;
        } else {
            me.filterPending.ready = 0;
            me.filterPending.readyFire = false;
        }
    },

    /**
     * @private
     * Tells the filterPending system that our children have all been informed of filterReady events, so we
     * can be ready to fire at any time.
     */
    postFilterPending: function () {
        var me = this;

        if (Ext.getVersion().major >= 5) {
            // if we called SetParameters on something else, wait for it to announce it is ready.
            // if we are that something else, announce we are ready
            if (me.filterPending === 0) {
                me.fireEvent('filterReady', me);
            }
            else {
                me.filterFire = true;
            }
        } else {
            if (me.filterPending.ready === 0) {
                me.fireEvent(me.filterEvents.ready, me);
            }
            else {
                me.filterPending.readyFire = true;
            }
        }
    },

    /**
     * @deprecated This needs to go away.
     * Used when multiple reports share the same basic report layout and need to toggle sections on/off.
     * use Ext.override to replace this default functionality if necessary
     * @param {Object} layout the layout to apply to this container (and children)
     */
    SetLayout: function (layout) {
        var me = this,
            layout = layout || {},
            configVisible = layout[me.itemId];

        if (configVisible === undefined || configVisible) {
            // undefined, show
            // defined-true, show
            me.show();
            me.items.each(function (item) {
                if (item.SetLayout) {
                    item.SetLayout(layout);
                } else {
                    // elements that don't have a SetLayout function can be toggled on directly?
                    //if (layout[item.itemId]) item.show();
                }
            });
        } else {
            // defined-false, don't show
            me.margins = '0 0 0 1';
            me.hide();
            me.FilterDisabled = true;
        }
    },

    /**
     * Get the 'display values' of all the filter items contained within. This is for a user-readable grid title or similar.
     * use Ext.override to replace this default functionality if necessary
     * @returns {String} the 'display value' of this filterContainer
     */
    GetFilterDisplay: function () {
        var me = this,
            result = '';

        me.items.each(function (item) {
            if (item.isHidden()) {
            } else if (item.GetFilterDisplay) {
                var val = item.GetFilterDisplay() || '';
                if (val.length > 0) {
                    result += ', ' + val;
                }
            }
        });

        return result.slice(2);
    }
});