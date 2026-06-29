Ext.define('BIA.controller.Chart', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function () {
        this.listen({
            global: {
                'chartaddredrawlistener': this.ChartAddRedrawListener
            }
        });
    },
    ChartAddRedrawListener: function ChartAddRedrawListener(me, listenerFunction, scope, single) {
        var listenerExists = false;
        if (me.events.redraw && me.events.redraw.listeners.length > 0) {
            var listeners = me.events.redraw.listeners;
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].fn == listenerFunction) {
                    listenerExists = true;
                    break;
                }
            }
        }
        if (!listenerExists) {
            me.addListener({
                redraw: {
                    fn: listenerFunction,
                    scope: scope,
                    single: single || false,
                    args: [me]
                }
            });
        }
    }
});