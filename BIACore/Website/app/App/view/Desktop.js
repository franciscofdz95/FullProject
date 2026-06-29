Ext.define('App.view.Desktop', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
    alias: 'widget.App-Desktop',
    bodyStyle: { 'background-color': 'black' },

    dockedItems: [
        {
            xtype: 'toolbar', dock: 'bottom',
            items: [
                {// "start" button
                    text: 'BIA',
                    cls: 'bia-red-btn',
                    iconCls: 'icon-shape_3d',
                    border: 1,
                    padding: '4 4 4 4', // make the start button larger than the window buttons
                    style: { borderColor: '#81a4d0' },
                    menu: {
                        defaultAlign: 'bl-tl',
                        shadow: true,
                        items: [],
                        dockedItems: [
                            {
                                xtype: 'toolbar', dock: 'bottom', border: false, layout: { type: 'vbox', align: 'stretch' }, vertical: true,
                                listeners: {
                                    add: function (tb, c) {
                                        c.on({ click: function () { tb.up('menu').hide(); } });
                                    }
                                },
                                items: [
                                    {
                                        text: 'logout', textAlign: 'right', handleMouseEvents: false,
                                        iconCls: 'icon-control_power', iconAlign: 'right',
                                        handler: function () {
                                            Ext.Msg.confirm('Logout',
                                                'Are you sure you want to logout?',
                                                function (button) {
                                                    if (button === "yes") {
                                                        BIACore.Security.logout();
                                                    }
                                                });
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {// "window" bar
                    xtype: 'toolbar',
                    itemId: 'WindowBar',
                    flex: 1,
                    border: false,
                    defaults: {
                        border: 1,
                        style: { borderColor: '#81a4d0' }
                    }
                },
                {// "tray" clock
                    xtype: 'tbtext',
                    text: Ext.Date.format(new Date(), 'g:i A'),
                    cls: 'Desktop-Clock'
                }
            ]
        }
    ],

    modules: [
        //{ xtype: 'App-module-Log' },
        { xtype: 'App-module-Browser' },
        { xtype: 'App-module-LogDetail' },
        { xtype: 'App-module-Security' },
        { xtype: 'App-module-Version' },
        { xtype: 'App-module-Header' },
        { xtype: 'App-module-MyReports' }
    ],

    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        me.initClock();
        me.initStart();
        me.initTray();
    },

    initClock: function () {
        var me = this,
            clock = me.down('toolbar tbtext[cls=Desktop-Clock]');
        Ext.Function.defer(function () {
            me.clockTask = Ext.TaskManager.newTask({
                run: me.updateClock,
                interval: 60000, // time in ms
                fireOnStart: true,
                scope: clock
            }).start();
        }, 60000 - new Date() % 60000);
    },

    initStart: function () {
        var me = this,
            btn = me.down('button[text=BIA]'),
            menu = btn.getMenu();

        menu.addDocked({
            xtype: 'toolbar', dock: 'top', border: false, items: [
                { xtype: 'tbtext', text: BIACore.Security.User.firstName + ' ' + BIACore.Security.User.lastName + ' (' + BIACore.Security.User.userId + ')' }
            ]
        });

        Ext.each(me.modules, function (module) {
            var cfg = Ext.ClassManager.getByAlias('widget.' + module.xtype).prototype;
            if ((Ext.isFunction(cfg.hideFromStart) && !cfg.hideFromStart()) || !cfg.hideFromStart) {
                menu.add({
                    iconCls: cfg.iconCls || cfg.config.iconCls || '',
                    text: cfg.title || cfg.config.title || '',
                    handler: function () { me.createWindow(Ext.apply(module, { maximized: true })); },
                    scope: me
                });
            }
        });
    },

    initTray: function () {
        var me = this;

        me.windows = new Ext.util.MixedCollection();
        me.windowBar = me.down('#WindowBar');
    },

    createWindow: function (config) {
        var me = this, win;

        if (!config) { return; }

        // create the window
        win = me.add(config);
        // create the toolbar button
        win.btn = me.windowBar.add({
            xtype: 'App-Desktop-Button',
            iconCls: win.iconCls,
            text: Ext.util.Format.ellipsis(win.title, 20)
        });
        // add a link from the button back to the window.
        win.btn.win = win;
        // call module.init in-scope
        win.init.call(win, config.data || {});
        // show the window
        win.show();
    },

    updateClock: function () {
        var me = this, // running in textitem context
            time = Ext.Date.format(new Date(), 'g:i A');

        if (me.lastText !== time) {
            me.setText(time);
            me.lastText = time;
        }
    }
});