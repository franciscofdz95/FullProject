Ext.define('BIA.panel.Carousel', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
    alias: 'widget.carousel',

    mixins: (Ext.getVersion().major < 5) ? {
        bindable: 'Ext.util.Bindable'
    } : (Ext.platformTags && Ext.platformTags.modern) ? {} : {
        storeholder: 'Ext.util.StoreHolder'
    },

    padding: 10,
    layout: { type: 'vbox', align: 'center' },
    defaults: { border: false, style: { 'background-color': 'white' } },
    cls: 'x-carousel',

    // Configurables
    iconPath: '',
    iconWidth: 96,
    iconHeight: 96,

    titleField: 'Title',
    altField: 'Alt',
    categoryField: 'Category',
    iconField: 'Icon',

    onItemClick: Ext.emptyFn,
    //

    items: [
        {
            xtype: 'panel', width: 700, height: 300, maxWidth: 700, maxHeight: 300, layout: 'border',
            defaults: { border: false, style: { 'background-color': 'white' } },
            items: [
                // right arrow
                {
                    xtype: 'container', region: 'east', //width: '20%',
                    layout: { type: 'hbox', align: 'middle', pack: 'start' },
                    items: [{ xtype: 'button', itemId: 'East', border: false, cls: 'x-carousel-east' }]
                },
                // left arrow
                {
                    xtype: 'container', region: 'west', //width: '20%',
                    layout: { type: 'hbox', align: 'middle', pack: 'end' },
                    items: [{ xtype: 'button', itemId: 'West', border: false, cls: 'x-carousel-west' }]
                },
                // icon blurb
                {
                    xtype: 'container', region: 'south', minHeight: 70,
                    layout: { type: 'vbox', align: 'center' },
                    items: [
                        {
                            xtype: 'label', itemId: 'Title',
                            padding: 2, margin: 2,
                            style: {
                                'font-size': '2em',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'label', itemId: 'Alt',
                            style: {
                                'font-size': '0.9em'
                            }
                        },
                        {
                            xtype: 'label', itemId: 'Category',
                            style: {
                                'font-size': '0.9em',
                                'font-style': 'italic'
                            }
                        }
                    ]
                },
                // icon container
                { xtype: 'panel', itemId: 'Icons', region: 'center', layout: 'absolute' }
            ]
        }
    ],

    initComponent: function () {
        var me = this;

        me.callParent();

        me.on({
            activate: me.onActivate,
            afterlayout: me.onAfterLayout,
            resize: me.onResize,
            scope: me
        });

        // bind button operations
        me.down('#East').on({ click: me.moveNext, scope: me });
        me.down('#West').on({ click: me.movePrev, scope: me });

        me.bindStore(me.store || 'ext-empty-store', true);

        me.frontIndex = 0;
    },

    // required by bindable mixin
    getStoreListeners: function () {
        return {
            load: this.onLoad
        };
    },

    // track changes in the store to change icons visible
    onLoad: function () {
        var me = this,
            store = me.getStore(),
            icons = me.down('#Icons');

        icons.removeAll();

        store.each(function (item) {
            icons.add({
                xtype: 'image',
                src: me.iconPath + item.get(me.iconField),
                width: me.iconWidth,
                height: me.iconHeight,
                record: item,
                listeners: {
                    el: {
                        mouseover: function () { me.onMouseOver(item); },
                        mouseout: function () { me.onMouseOut(item); },
                        mousedown: function () { me.onMouseDown(item); },
                        scope: me
                    }
                }
            });
        });

        me.frontIndex = 0;
        me.resetIcons();
    },

    onActivate: function () {
        this.getStore().load();
    },

    onAfterLayout: function () {
        var me = this;

        if (!me.boundMouse) {
            me.el.on({
                mousewheel: function (e) {
                    me[(e.getWheelDelta() > 0) ? 'moveNext' : 'movePrev']();
                },
                scope: me
            });

            me.down('#Title').el.on({ click: function () { me.onMouseDown(me.getStore().getAt(me.frontIndex)); }, scope: me });
            me.down('#Alt').el.on({ click: function () { me.onMouseDown(me.getStore().getAt(me.frontIndex)); }, scope: me });
            me.down('#Category').el.on({ click: function () { me.onMouseDown(me.getStore().getAt(me.frontIndex)); }, scope: me });

            me.boundMouse = true;
        }
        me.resetIcons();
    },

    onResize: function () {
        this.resetIcons();
    },

    resetIcons: function () {
        var me = this;

        if (!me.el) { return; }
        if (me.getStore().getCount() > 0) {
            me.setItem(me.getStore().getAt(me.frontIndex), false);
        }
    },

    onMouseDown: function (item) {
        var me = this;
        me.frontIndex = item.store.indexOfId(item.id);
        me.setItem(item, true);
        // local click handler
        me.onItemClick(item);
        // and fire the click event
        me.fireEvent('click', me, item);
    },

    onMouseOver: function (item) {
        this.setDescription(item);
    },

    onMouseOut: function () {
        var me = this;
        me.setDescription(me.getStore().getAt(me.frontIndex));
    },

    moveNext: function () {
        // jump to the 'next' item in the store.
        var me = this,
            store = me.getStore(),
            length = store.getCount();

        me.frontIndex += 1;
        if (me.frontIndex >= length) {
            me.frontIndex -= length;
        }
        me.setItem(store.getAt(me.frontIndex), true);
    },

    movePrev: function () {
        // jump to the 'prev' item in the store.
        var me = this,
            store = me.getStore(),
            length = store.getCount();

        me.frontIndex -= 1;
        if (me.frontIndex < 0) {
            me.frontIndex += length;
        }
        me.setItem(store.getAt(me.frontIndex), true);
    },

    setItem: function (item) {
        // sets the given item as the 'active' item.
        var me = this,
            icons = me.down('#Icons');

        var width = icons.getWidth(),
            height = icons.getHeight(),
            tilt = Math.cos(Math.PI * 8 / 18),
            radius = Math.min(width, height / tilt, 500) / 2,
            radians = (Math.PI * 2) / me.getStore().getCount(),
            front = Math.PI / 2, // adjust the calculation by 90 degrees to put the front item forward.
            centerX = icons.getX() + (width / 2),
            centerY = icons.getY() + (height / 3),
            i = 0;

        icons.items.each(function (item) {
            var x = centerX + Math.cos(front + radians * (me.frontIndex - i)) * radius,
                z = Math.sin(front + radians * (me.frontIndex - i)) * radius,
                scale = Math.max(0.6, z / radius),
                y = centerY + tilt * z;

            item.stopAnimation()
                .animate({
                    easing: 'easeOut',
                    to: {
                        x: x - (me.iconWidth * scale) / 2,
                        y: y - (me.iconHeight * scale) / 2,
                        width: me.iconWidth * scale,
                        height: me.iconHeight * scale
                    }
                });
            i++;
        });

        me.setDescription(item);
    },

    setDescription: function (item) {
        var me = this,
            z;

        if (!item) { return; }

        z = me.down('#Title');
        if (z) { z.setText(item.get(me.titleField) || ''); }

        z = me.down('#Alt');
        if (z) { z.setText(item.get(me.altField) || ''); }

        z = me.down('#Category');
        if (z) { z.setText(item.get(me.categoryField) || ''); }
    }
});