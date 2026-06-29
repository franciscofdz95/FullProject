Ext.define('BIA.panel.Desktop', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
    alias: 'widget.iconDesktop',

    mixins: (Ext.getVersion().major < 5) ? {
        bindable: 'Ext.util.Bindable'
    } : (Ext.platformTags && Ext.platformTags.modern) ? {} : {
        storeholder: 'Ext.util.StoreHolder'
    },

    border: false,
    layout: 'vbox',
    padding: '20 10 10 40',

    shortcutText: 'Name',
    shortcutIcon: 'Icon',

    iconPath: '',
    iconWidth: 32,
    iconHeight: 32,

    singleClick: true,

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.bindStore(me.store || 'ext-empty-store', true);

        if (me.getStore().getProxy() instanceof Ext.data.proxy.Memory) {
            me.onLoad();
        }
    },

    // required by bindable mixin
    getStoreListeners: function () {
        return {
            load: this.onLoad
        };
    },

    onLoad: function () {
        var me = this,
            store = me.getStore();

        me.removeAll();

        store.each(function (item) {
            me.add({
                xtype: 'container',
                cls: 'x-desktop-shortcut',
                layout: { type: 'hbox', align: 'middle' },
                items: [
                    {
                        xtype: 'image', src: me.iconPath + item.get(me.shortcutIcon),
                        cls: 'x-desktop-shortcut-icon',
                        width: me.iconWidth, height: me.iconHeight,
                        listeners: {
                            el: {
                                click: function () { if (me.singleClick) { me.onItemClick(item); me.fireEvent('click', me, item); } },
                                dblclick: function () { if (!me.singleClick) { me.onItemClick(item); me.fireEvent('click', me, item); } },
                                scope: me
                            }
                        }
                    },
                    {
                        xtype: 'label', text: item.get(me.shortcutText), width: 300,
                        cls: 'x-desktop-shortcut-text',
                        overCls: 'x-view-over',
                        listeners: {
                            el: {
                                click: function () { if (me.singleClick) { me.onItemClick(item); me.fireEvent('click', me, item); } },
                                dblclick: function () { if (!me.singleClick) { me.onItemClick(item); me.fireEvent('click', me, item); } },
                                scope: me
                            }
                        }
                    }
                ]
            });
        });
    },

    onItemClick: Ext.emptyFn
});