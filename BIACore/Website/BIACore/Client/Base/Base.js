// Generally, this file must be the first one (alphabetically) in this folder
// Here, we define the "BIACore" variable (if not already defined), and add a bunch
// of features to it to use elsewhere. It's basically what gives us the 
// "idea" of an object (through BIACore.apply) later on.
var BIACore = BIACore || {};

/**
 * @class BIAcore
 * @singleton
 * 
 * The base functions attached to 'BIACore'. Defines most of the ability to 'create' the rest of BIACore.
 */
(function () {
    // hah! define undefined as a global undefined object. brilliant!
    window.undefined = window.undefined;

    // configuration for BIACore base functions
    var global = this,
        localhost = /localhost/i.test(window.location.hostname),
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = true,
        enumerablesTest = { toString: 1 };

    for (var i in enumerablesTest) { enumerables = null; }
    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];
    }

    /**
     * Copies all the properties of 'config' to the specified object
     * If specified, applies 'defaults' to 'object' first
     * 
     * @param {Object} object the target object to have properties applied to
     * @param {Object} config the source of the properties
     * @param {Object} defaults a list of defaults to apply to the object before config
     * @return {Object} returns the given object
     */
    BIACore.apply = function (object, config, defaults) {
        if (defaults) {
            BIACore.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                if (typeof (config[i]) === 'object' && typeof (object[i]) === 'object') {
                    // recursively merge into the object.
                    BIACore.apply(object[i], config[i]);
                } else {
                    // objects overwrite everything else.
                    object[i] = config[i];
                }
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };

    var hasBoundDomReady = false;

    BIACore.apply(BIACore, {
        /**
         * Defines the given object in the namespace. Binds any event handlers.
         * Use this to let everything finish defining before the events start firing.
         * 
         * @param {String} name the name of the new object
         * @param {Object} data the definition of the new object
         * @param {Function} function to call once creation is complete
         * @method
         */
        define: function (name, data, createdFn) {
            if (typeof (name) !== 'string') {
                throw new Error('BIACore.define: Invalid name, must be a string.');
            }

            var path = name.split('.'),
                part,
                cls = global;

            for (var i = 0; i < path.length; ++i) {
                part = path[i];
                if (!cls[part]) { cls[part] = {}; }
                cls = cls[part];
            }

            BIACore.apply(cls, data);

            // and bind any onLoad events.
            if (cls.onInit) { BIACore.Event.init(cls.onInit, cls); }
            if (cls.onLoad) { BIACore.Event.load(cls.onLoad, cls); }
            // added this event after defining (and using) BIACore.onReady a bunch of places
            // when some class inside BIACore extends BIACore, it looks at re-adding this function (which is a recursive call)
            // so don't add the method when the calling class is BIACore.
            if (cls.onReady && cls !== BIACore && cls !== BIACore.Security) { BIACore.Event.ready(cls.onReady, cls); }

            // and execute any post-class functions.
            if (createdFn) { createdFn.call(cls, cls); }
        },

        /**
         * Replace values in object with those in config iff they exist in object.
         * see also {@link BIACore#applyIf}
         *
         * @param {Object} object the target object
         * @param {Object} config the source values to be applied
         * @return {Object} updated object
         * @method
         */
        ifApply: function (object, config) {
            if (object && config && typeof config === 'object') {
                var i;

                for (i in object) {
                    // modified from Ext4 to do "nice" recursive copying of objects.
                    if (BIACore.isArray(object[i]) && BIACore.isArray(config[i])) {
                        // wholesale replacement or append?
                        object[i] = [].concat(object[i], config[i]);
                    } else if (typeof (config[i]) === 'object' && typeof (object[i]) === 'object') {
                        // recursively merge into the object.
                        BIACore.ifApply(object[i], config[i]);
                    } else if (typeof (config[i]) !== 'undefined') {
                        object[i] = config[i];
                    }
                }
            }
            return object;
        },

        /**
         * Copy items from config into object iff they do not already exist in object.
         * see also {@link BIACore#ifApply}
         * @param {Object} object the target object
         * @param {Object} config the source values to be applied
         * @return {Object} updated object
         * @method
         */
        applyIf: function (object, config) {
            var property;

            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },

        /**
         * Tests for a whole series of (nearly) equivalent 'empty' states.
         * Returns true on:
         * null
         * undefined
         * '' (empty string)
         * [] (0-length array)
         * {} (object with no properties)
         *
         * @param {String/Object/Array} value the value to test for 'empty'
         * @return {Boolean} the 'emptiness' of value
         * @method
         */
        isEmpty: function (value) {
            if (BIACore.isObject(value)) {
                for (var p in value) {
                    if (value.hasOwnProperty(p)) {
                        return false;
                    }
                }
            }

            return (value === null) || (value === undefined) || (value === '')
                || (BIACore.isArray(value) && value.length === 0)
                || (BIACore.isObject(value));
        },

        /**
         * Test to determine if the given object is an array.
         * 'Helper' function for cross-browser compatibility reasons (<IE9).
         *
         * @param {Object} value the array to check
         * @return {Boolean} true if the object is an array
         * @method
         */
        isArray: ('isArray' in Array) ?
            Array.isArray :
            function (value) {
                return toString.call(value) === '[object Array]';
            },

        /**
         * Test to determine if the given value is an Object.
         * 'Helper' function for cross-browser compatibility reasons.
         *
         * @param {Object} value the object to check
         * @return {Boolean} true if the object is an object
         * @method
         */
        isObject: (toString.call(null) === '[object Object]') ?
            function (value) {
                return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
            } :
            function (value) {
                return toString.call(value) === '[object Object]';
            },

        /**
         * Test to determine if the given value is a Date.
         * @param {Object} value the object to check
         * @return {Boolean} true if the object is a Date
         * @method
         */
        isDate: function (value) {
            return Object.prototype.toString.call(value) === '[object Date]';
        },

        /**
         * Test to determine if the given value is a Decimal.
         * @param {Object} value the object to check
         * @return {Boolean} true if the object is a Decimal
         * @method
         */
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        /**
        *
        */
        isFunction: function isFunction(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        },

        /**
         * @private
         * @property {Boolean} whether or not the javascript is running on a localhost-bound website.
         */
        isLocalHost: function () { return localhost; },

        /**
         * Function to bind to browser's 'dom ready' (page load complete) equivalent event.
         * @private
         * @method
         */
        bindDomReady: function () {
            if (hasBoundDomReady) { return; }

            if (document.readyState === 'complete') {  // Firefox4+ got support for this state, others already do.
                BIACore.domReady();
            } else {
                document.addEventListener('DOMContentLoaded', BIACore.domReady, false);
                window.addEventListener('load', BIACore.domReady, false);
                hasBoundDomReady = true;
            }
        },

        /**
         * Function to unbind from the browser 'dom ready' equivalent event.
         * @private
         * @method
         */
        domReady: function () {
            if (hasBoundDomReady) {
                document.removeEventListener('DOMContentLoaded', BIACore.domReady, false);
                window.removeEventListener('load', BIACore.domReady, false);
            }
            BIACore.Event.fire('ready');
        }
    });

    // <IE9 document ready binder. (the default path already defined is for everything else)
    if (!('addEventListener' in document) && document.attachEvent) {
        var readyStatesRe = /complete/i;

        BIACore.apply(BIACore, {
            bindDomReady: function () {
                if (hasBoundDomReady) { return; }

                if (document.readyState === 'complete') {
                    BIACore.domReady();
                } else {
                    document.attachEvent('onreadystatechange', BIACore.checkReadyState);
                    window.attachEvent('onload', BIACore.domReady);
                    hasBoundDomReady = true;
                }
            },
            checkReadyState: function () {
                var state = document.readyState;

                if (readyStatesRe.test(state)) {
                    BIACore.domReady();
                }
            },
            domReady: function () {
                if (hasBoundDomReady) {
                    document.detachEvent('onreadystatechange', BIACore.checkReadyState);
                    window.detachEvent('onload', BIACore.domReady);
                }
                BIACore.Event.fire('ready');
            }
        });
    }
}());
