/**
 * Defines a bunch of utility functions that are useful when dealing with Ext.
 */
Ext.define('BIA.util.Function', {
    singleton: true,

    /**
     * A cross-element isEmpty.
     * @param {Number/String/Object/Array} v the value to check
     * @returns {Boolean} true if the value is: {}, [], '', null, undefined
     */
    isEmpty: function (v) {
        if (Ext.isObject(v)) {
            for (var prop in v) {
                if (v.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        } else {
            Ext.isEmpty(v);
        }
    }
});
