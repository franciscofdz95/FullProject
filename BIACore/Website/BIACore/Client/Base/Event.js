/**
 * @private
 * @class BIACore.Event
 * @singleton
 * 
 * Contains the 'Event Handler' for BIACore initalization.
 * This is very loosely an event system. It needs work if use outside of initalization is ever intended.
 */
BIACore.define('BIACore.Event', {
}, function (utilEvent) {
    var events = [{ type: 'init', fired: false, listeners: [], pending: 1 }],
        createEvent = function (event) {
            return {
                type: event,
                fired: false,
                listeners: [],
                pending: 0
            };
        },
        getEvent = function (event) {
            var i = 0, elen = events.length;

            for (; i < elen; ++i) {
                if (events[i].type === event) {
                    return events[i];
                }
            }
            var e = createEvent(event);
            events.push(e);
            return e;
        },
        onEvent = function (event, func, scope) {
            var e = getEvent(event),
                scope = scope || BIACore.global;

            if (e.fired) {
                func.call(scope);
            } else {
                e.listeners.push({ fn: func, scope: scope });
            }
        };

    BIACore.apply(utilEvent, {
        /**
         * @private
         * The 'init' event. Fires after BIACore.js finishes loading.
         * Generally used for async loading of other javascript/css.
         * Anybody who registers for 'init' is expected to fire 'load'.
         *
         * @param {Function} func the function to execute
         * @param {Object} scope (optional) the scope to run the function from (e.g. 'this') (defaults to BIACore.global)
         */
        init: function (func, scope) {
            getEvent('load').pending++;
            onEvent('init', func, scope);
        },

        /**
         * @private
         * The 'load' event. Fires after all 'init' events are completed.
         * BIACore at this point should be ready to start running internal operations.
         * Anybody who registers for 'load' is expected to fire 'ready'.
         *
         * @param {Function} func the function to execute
         * @param {Object} scope (optional) the scope to run the function from (e.g. 'this') (defaults to BIACore.global)
         */
        load: function (func, scope) {
            getEvent('ready').pending++;
            onEvent('load', func, scope);
        },

        /**
         * @private
         * The 'ready' event. Fires after all 'load' events are completed.
         *
         * @param {Function} func the function to execute
         * @param {Object} scope (optional) the scope to run the function from (e.g. 'this') (defaults to BIACore.global)
         */
        ready: function (func, scope) {
            if (typeof (func) !== 'function') {
                BIACore.Console('onReady: not a valid function ' + func);
                return;
            }
            onEvent('ready', func, scope);
        },

        /**
         * @private
         * The callback method to indicate a method has completed it's stage of the event.
         * 
         * @param {String} event the event to 'fire'
         */
        fire: function (event) {
            var e = getEvent(event);

            e.pending--;
            if (e.pending > 0) { return; }


            BIACore.Console('Firing "' + event + '" listeners');
            // in case we get interrupted while firing off listeners...
            e.fired = true;
            // pending has reached 0; fire the event listeners.
            var i = 0, elen = e.listeners.length;
            for (; i < elen; ++i) {
                var func = e.listeners[i];
                func.fn.call(func.scope);
            }
        }
    });

    /**
     * Alias the 'onReady' function to our ready function.
     * 
     * @method
     */
    BIACore.onReady = utilEvent.ready;
});
