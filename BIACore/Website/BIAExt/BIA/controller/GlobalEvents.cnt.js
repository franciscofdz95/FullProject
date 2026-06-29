(function () {
    if (Ext.getVersion().major >= 4) {
        Ext.define('BIA.controller.GlobalEvents', {
            extend: 'Ext.app.Controller',
            init: function BIAControllerGlobalEventsInit() {
                this.control({
                    'component': {
                        added: {
                            fn: this.ComponentInitialization,
                            priority: 999
                        },
                        beforerender: {
                            fn: this.ComponentInitialization,
                            priority: 999
                        }
                    }
                });
            },
            ComponentInitialization: function ComponentInitialization(me, eOpts) {
                if (me.store) {
                    if (!BIA.util.Accessors.BaseClassSearch(me.store, 'Ext.data.AbstractStore')) me.store = Ext.StoreMgr.lookup(me.store) || Ext.create(me.store);

                    /*
bubbleStoreEvents: false
bubbleStoreEvents: 'load'
bubbleStoreEvents: ['load', 'beforeload']
bubbleStoreEvents: [{ load: { priority: 999 }}, 'beforeload']
bubbleStoreEvents: {
    load: {
        priority: 0,
        delay: 0,
        buffer: 0,
        single: false,
        args: []                    
    },
    beforeload: true
}
                    */

                    if (me.bubbleStoreEvents !== false &&
                        me.store && me.store.addListener && Ext.isFunction(me.store.addListener) &&
                        me.fireEvent && Ext.isFunction(me.fireEvent) && !me.bubbleStoreEventsInitialized) {
                        var config = this.GetBubbleStoreEventsConfig(me.store, me.bubbleStoreEvents || true);
                        var events = Ext.Object.getKeys(config);

                        for (i = 0; i < events.length; i++) {
                            if (config[events[i]] !== false) {
                                var eventListener = new Object();
                                eventListener[events[i]] = {
                                    fn: function ComponentStoreEventBubbleHandler() {
                                        var args = new Array();
                                        args.push(me);
                                        for (a = 0; a < arguments.length; a++) args.push(arguments[a]);
                                        return me.fireEventArgs(arguments[arguments.length - 1].bubbledEventName, args);
                                    },
                                    priority: config[events[i]].priority,
                                    delay: config[events[i]].delay || 0,
                                    buffer: config[events[i]].buffer || null,
                                    single: config[events[i]].single || false,
                                    args: config[events[i]].args || null,
                                    bubbledEventName: 'store' + events[i]
                                };
                                me.store.addListener(eventListener);
                            }
                        }

                        me.bubbleStoreEventsInitialized = true;
                    }
                }
            },
            GetBubbleStoreEventsConfig: function GetBubbleStoreEventsConfig(store, config, recursive) {
                var defaultConfig = {};
                var defaultEventConfig = {
                    priority: 0
                };
                var events = [
                    'add', 'beforesort', 'beginupdate', 'clear', 'datachanged', 'endupdate', 'refresh', 'remove', 'sort', 'update', //AbstractStore
                    'beforeload', 'beforesync', 'load', 'metachange', 'write', //Base = ProxyStore [BufferedStore], ChainedStore
                    'beforeprefetch', 'filterchange', 'groupchange', 'prefetch', //Base = Ext.data.Store [XmlStore, JsonStore, JsonPStore, DirectStore, ArrayStore]
                    'nodeappend', 'nodebeforeappend', 'nodebeforecollapse', 'nodebeforeexpand', 'nodebeforeinsert', 'nodebeforemove', 'nodebeforeremove',
                    'nodecollapse', 'nodeexpand', 'nodeinsert', 'nodemove', 'noderemove', 'nodesort', 'rootchange',//TreeStore
                    'bulkremove', 'append', 'beforeappend', 'beforecollapse', 'beforeexpand', 'beforeinsert', 'beforemove', 'beforeremove', 'collapse',
                    'expand', 'insert', 'move',//Ext 4.2 Store Events
                    //'beforesave', 'beforewrite', 'exception', 'loadexception', 'save', 'groupchange'//Ext 3.4 Store Events
                ];

                if (config === true) {
                    for (i = 0; i < events.length; i++) {
                        defaultConfig = Ext.apply(defaultConfig, this.GetBubbleStoreEventsConfig(store, events[i], true));
                    }
                }
                else if (Ext.isString(config)) defaultConfig[config] = Ext.clone(defaultEventConfig);
                else if (Ext.isArray(config)) {
                    for (i = 0; i < config.length; i++) {
                        defaultConfig = Ext.apply(defaultConfig, this.GetBubbleStoreEventsConfig(store, config[i], true));
                    }
                }
                else if (Ext.isObject(config)) {
                    defaultConfig = Ext.apply(defaultConfig, config);
                }

                if (config !== true && !recursive) {
                    for (i = 0; i < events.length; i++) {
                        if (defaultConfig[events[i]] == null) defaultConfig = Ext.apply(defaultConfig, this.GetBubbleStoreEventsConfig(store, events[i], true));
                    }
                }

                return defaultConfig;
            }
        });
    }
}());

/*
beforesave
beforewrite
exception
loadexception
save
groupchange
*/