if (Ext.getVersion().major >= 5 && Ext.platformTags && Ext.platformTags.classic) {
    /*
        Configs:
        -valueField
        -displayField
        -columns
        -width
        -autoLoadOnValue
        -pageSize
    
        Events:
        -clear
        -beforeselect
        -select
        -beforedeselect
    
        Example:
        {
            xtype: 'gridPicker',
            displayField: 'OSP_ID',
            valueField: 'OSP_REC_ID',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/OCMData/ActiveOsps'
                }
            },
            columns: [
                { text: 'OSP ID', dataIndex: 'OSP_ID' },
                { text: 'Country', dataIndex: 'COUNTRY_CODE' },
                { text: 'OSP Name', dataIndex: 'OSP_NAME' }
            ],
            pageSize: 11
        }
    */
    /*
        Contributed by Preston Ough
    */
    Ext.define('BIA.Components.GridPicker', {
        extend: 'Ext.form.field.Picker',
        alias: 'widget.BIA-Components-GridPicker',
        xtype: 'gridpicker',

        //configs
        valueField: 'Id',
        displayField: 'Name',
        columns: [
            { text: 'Id', dataIndex: 'Id' },
            { text: 'Name', dataIndex: 'Name' }
        ],
        width: 200,
        autoLoadOnValue: true,

        //optional
        //pageSize: 11,

        //private
        matchFieldWidth: false,
        recordValue: null,

        constructor: function (config) {
            var me = this,
                config = config || {},
                triggers = config.triggers || {};

            Ext.applyIf(triggers, {
                clear: {
                    cls: 'x-form-clear-trigger',
                    handler: 'onClearClick',
                    weight: -10,
                    scope: 'this'
                }
            });

            config.triggers = triggers;

            me.callParent([config]);
        },

        initComponent: function () {
            var me = this;

            me.doQueryTask = new Ext.util.DelayedTask(me.doRawQuery, me);

            me.on({
                render: function (field) {
                    field.triggerEl.each(function (trigger) {
                        if (trigger.dom.className.indexOf('x-form-clear-trigger') > -1) {
                            Ext.create('Ext.tip.ToolTip', { target: trigger.id, html: 'Click to reset this filter' });
                        }
                    });
                }
            });

            me.callParent();
        },

        onClearClick: function (event) {
            var me = this;
            me.inputEl.dom.value = null;
            me.setValue(null);
            me.doQueryTask.delay(0);
            me.fireEvent('clear', me, [], event);
        },

        createPicker: function () {
            var me = this;

            var gridConfig = {
                xtype: 'gridpanel',
                store: me.store,
                columns: {
                    defaults: {
                        menuDisabled: true,
                        sortable: false,
                        draggable: false
                    },
                    items: me.columns
                }
            };

            if (me.pageSize)
                gridConfig.pageSize = me.pageSize;

            var windowConfig = {
                xtype: 'window',
                layout: 'fit',
                header: false,
                resizable: false,
                width: 500,
                maxHeight: 350,
                minHeight: 100,
                items: [gridConfig],
                style: {
                    border: '0px'
                }
            };

            var window = Ext.create(windowConfig),
                grid = window.down('grid');

            if (me.pageSize) {
                var pager = Ext.widget('pagingtoolbar', { dock: 'bottom', displayInfo: true });
                pager.bindStore(me.store);
                grid.addDocked(pager);
            }

            me.store.on({
                load: me.onStoreLoad,
                scope: me
            });

            grid.on({
                afterlayout: me.onAfterGridLayout,
                scope: me
            });

            grid.getSelectionModel().on({
                beforeselect: me.onBeforeSelect,
                beforedeselect: me.onBeforeDeselect,
                select: me.onSelect,
                scope: me
            });

            return window;
        },

        onStoreLoad: function (store, records, successful) {
            var me = this,
                window = me.getPicker(),
                grid = window.down('grid'),
                selModel = grid.getSelectionModel();

            if (me.recordValue != null && !selModel.isRowSelected()) {
                var record = me.findRecordByValue(me.recordValue);

                if (record) {
                    if (me.displayField) {
                        var displayValue = record.data[me.displayField];
                        me.setRawValue(displayValue);
                    }

                    selModel.select(record);
                }
            }
        },

        onAfterGridLayout: function () {
            var me = this,
                window = me.getPicker(),
                grid = window.down('grid'),
                columns = (Ext.getVersion().major >= 5) ? grid.getColumnManager().getColumns() : grid.columns;

            Ext.each(columns, function (column) {
                if (Ext.isFunction(column.autoSize) && !column.flex) {
                    column.autoSize();
                }
            });
        },

        onExpand: function () {
            var me = this;

            if (!me.store.isLoading() && !me.store.isLoaded())
                me.doQueryTask.delay(0);
        },

        onSelect: function (list, record, recordIndex) {
            var me = this,
                value = record.data[me.valueField];

            me.setValue(value);
            me.collapse();

            me.fireEvent('select', this, record, recordIndex);
        },

        onBeforeSelect: function (list, record, recordIndex) {
            return this.fireEvent('beforeselect', this, record, recordIndex);
        },

        onBeforeDeselect: function (list, record, recordIndex) {
            return this.fireEvent('beforedeselect', this, record, recordIndex);
        },

        onFieldMutation: function (e) {
            var me = this,
                key = e.getKey(),
                isDelete = key === e.BACKSPACE || key === e.DELETE,
                rawValue = me.inputEl.dom.value,
                len = rawValue.length;

            if (!me.readOnly && (rawValue !== me.lastMutatedValue || isDelete) && key !== e.TAB) {
                me.lastMutatedValue = rawValue;
                me.doQueryTask.delay(1000);
                if (rawValue.length == 0)
                    me.collapse();
                else {
                    me.expand();
                    me.focus();
                }
            }
        },

        doRawQuery: function () {
            var me = this,
                queryString = me.inputEl.dom.value,
                grid = me.getPicker().down('grid'),
                store = me.getStore(),
                proxy = store.getProxy();

            if (proxy.isRemote == true) {
                proxy.setExtraParam('search', queryString);
                store.load();
                grid.getView().setLoading(true);
            }

            if (!me.isExpanded && queryString.length > 0)
                me.expand();
        },

        getSelection: function () {
            var me = this,
                window = me.getPicker(),
                grid = window.down('grid'),
                selModel = grid.getSelectionModel(),
                selection = selModel.getSelection();

            return selection.length ? selModel.getLastSelected() : null;
        },

        getStore: function () {
            return this.store;
        },

        getValue: function () {
            return this.recordValue;
        },

        setValue: function (newVal) {
            var me = this,
                store = me.store,
                window = me.getPicker(),
                grid = window.down('grid'),
                selModel = grid.getSelectionModel(),
                displayValue = newVal;

            if (newVal == null) {
                selModel.deselectAll();
            } else {
                if (me.autoLoadOnValue && !store.isLoaded() && !store.isLoading()) {
                    me.doQueryTask.delay(0);
                } else {
                    var record = me.findRecordByValue(newVal);

                    if (record) {
                        if (me.displayField)
                            displayValue = record.data[me.displayField];

                        selModel.select(record);
                    } else {
                        selModel.deselectAll();

                        //not sure about this
                        //it would allow the grid to load using the new value
                        //in case it was on a different page and wasn't found.
                        //it would only help if the proc was using the search param
                        me.doQueryTask.delay(0);
                    }
                }
            }

            me.recordValue = newVal;
            me.callParent([displayValue]);
        },

        findRecord: function (field, value) {
            var me = this,
                ds = me.store,
                idx = ds.findExact(field, value);
            return idx !== -1 ? ds.getAt(idx) : false;
        },

        findRecordByValue: function (value) {
            var me = this,
                result = me.findRecord(me.valueField, value),
                ret = false;

            // If there are duplicate keys, tested behaviour is to return the *first* match.
            if (result) {
                ret = result[0] || result;
            }
            return ret;
        },

        findRecordByDisplay: function (value) {
            var me = this,
                result = me.findRecord(me.displayField, value),
                ret = false;

            // If there are duplicate keys, tested behaviour is to return the *first* match.
            if (result) {
                ret = result[0] || result;
            }
            return ret;
        }
    });
}