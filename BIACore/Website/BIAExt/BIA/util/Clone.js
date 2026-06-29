/**
 * Defines a bunch of utility functions that are useful when dealing with Ext.
 */
Ext.define('BIA.util.clone', {
    singleton: true,

    /**
     * A cross-element isEmpty.
     * @param {Number/String/Object/Array} v the value to check
     * @returns {Boolean} true if the value is: {}, [], '', null, undefined
     */

    /**
            * Clone simple variables including array, {}-like objects, DOM nodes and Date without keeping the old reference.
            * A reference for the object itself is returned if it's not a direct descendant of Object. For model cloning,
            * see {@link Ext.data.Model#copy Model.copy}.
            *
            * @param {Object} item The variable to clone
            * @return {Object} clone 
            */
    cloneShallow: function (item,depth) {
        if (item === null || item === undefined ) {
            return item;
        }

        if (depth === null || depth === undefined) {
            depth = 0;
        }

        var enumerables = [//'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 
                           'valueOf', 'toLocaleString', 'toString', 'constructor'];

        // DOM nodes 
        // TODO proxy this to Ext.Element.clone to handle automatic id attribute changing 
        // recursively 
        if (item.nodeType && item.cloneNode) {
            return item.cloneNode(true);
        }

        var type = toString.call(item),
            i, j, k, clone, key;

        // Date 
        if (type === '[object Date]') {
            return new Date(item.getTime());
        }

        // Array 
        if (type === '[object Array]' && depth < 2) {
            i = item.length;

            clone = [];

            while (i--) {
                clone[i] = BIA.util.clone.cloneShallow(item[i],depth+1);
            }
        }
        // Object 
        else if (type === '[object Object]' && item.constructor === Object && depth < 2) {
            clone = {};

            for (key in item) {
                clone[key] = BIA.util.clone.cloneShallow(item[key],depth+1);
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (item.hasOwnProperty(k)) {
                        clone[k] = item[k];
                    }
                }
            }
        }

        if (depth == 2) {
            clone = '';
            if (type === '[object Object]' || type === '[object Array]') item = '';
        }

        return clone || item;
    }

});