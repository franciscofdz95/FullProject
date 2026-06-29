//Ext.define('BIA.header.tool.PerformanceTrackerSummaryLogging', {
//    singleton: true,
//    mixins: (Ext.versions.extjs.major > 4 ? ['Ext.mixin.Observable'] : [])
//}, function (me) {
//    if (Ext.versions.extjs.major > 4) {
//        var SuperHL = me.superclass.HasListeners || me.mixins && me.mixins.observable && me.mixins.observable.HasListeners || Ext.mixin.Observable.HasListeners;
//        me.hasListeners = new SuperHL();
//    }

//    var timer = null;

//    var LogPerformanceRecords = function LogPerformanceRecords() {
//        StartLoggingTimer();

//        var pti = BIA.header.tool.PerformanceTrackerInterface,
//            records = pti.getPerformanceHistoryRecords(),
//            routes = Ext.Array.unique(Ext.Array.pluck(records, 'WebAPIRoute'));
//    };

//    var StartLoggingTimer = function StartLoggingTimer() {
//        if (timer != null) window.clearTimeout(timer);
//        timer = window.setTimeout(LogPerformanceRecords, 300000);
//    };

//    if (Ext.versions.extjs.major <= 4) {
//        var listeners = new Object();

//        var addEventListeners = function addEventListeners(eventName, fn, scope, options, order) {
//            if (listeners[eventName] != null && Ext.isArray(listeners[eventName])) {
//                listeners[eventName].push({
//                    fn: fn,
//                    scope: scope,
//                    options: options,
//                    order: order
//                });

//                listeners[eventName] = listeners[eventName].sort(function (a, b) {
//                    var aPriority = a.options && a.options.priority != null ? a.options.priority : null;
//                    if (aPriority == null) {
//                        var order = (a.order || (a.options || { order: 0 }).order);
//                        if (order == "before") aPriority = 100;
//                        if (order == "current") aPriority = 0;
//                        if (order == "after") aPriority = -100;
//                    }
//                    var bPriority = b.options && b.options.priority != null ? b.options.priority : null;
//                    if (bPriority == null) {
//                        var order = (b.order || (b.options || { order: 0 }).order);
//                        if (order == "before") bPriority = 100;
//                        if (order == "current") bPriority = 0;
//                        if (order == "after") bPriority = -100;
//                    }
//                    return aPriority - bPriority;
//                });
//            }
//            else {
//                listeners[eventName] = new Array();
//                listeners[eventName].push({
//                    fn: fn,
//                    scope: scope,
//                    options: options,
//                    order: order
//                });
//            }
//        };

//        Ext.apply(me, {
//            addListener: function (eventName, fn, scope, options, order) {
//                if (Ext.isObject(eventName)) {
//                    var eventNameKeys = Ext.Object.getKeys(eventName);
//                    for (i = 0; i < eventNameKeys.length; i++) {
//                        var listener = eventName[eventNameKeys[i]]
//                        addEventListeners(eventNameKeys[i], listener.fn, listener.scope || me, listener.options || new Object(), listener.order);
//                    }
//                }
//                else addEventListeners(eventName, fn, scope || me, options || new Object(), order);
//            },
//            removeListener: function (eventName, fn, scope) {
//                var matchingEvent = listeners[eventName];
//                if (matchingEvent) {
//                    var matchingListeners = matchingEvent.filter(function (l) { return l.fn == fn && l.scope == scope; });
//                    for (i = 0; i < matchingListeners.length; i++) {
//                        Ext.Array.remove(matchingEvent, matchingListeners[i]);
//                    }
//                }
//            },
//            fireEvent: function (eventName, args) {
//                var ret = true;
//                var eventListeners = listeners[eventName];
//                if (eventListeners != null) {
//                    for (i = 0; i < eventListeners.length; i++) {
//                        if (Ext.isFunction(eventListeners[i].fn)) {
//                            var allArgs = eventListeners[i].options.args || new Array();
//                            allArgs.push(args);
//                            ret = eventListeners[i].fn.apply(eventListeners[i].scope || eventListeners[i].options.scope, allArgs);
//                            if (ret === false) break;
//                        }
//                    }
//                }

//                return ret;
//            }
//        });
//    }

//    StartLoggingTimer();
//});