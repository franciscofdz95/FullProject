/**
 * This is basically a regular {@link Ext.data.Store} with a few intelligent defaults defined
 * to make report construction less repetitive.
 *
 * ## Example Usage ##
 *     @example
 *     store = {
 *         type: 'memory',
 *         data: [
 *             { Id: 'Y', Name: 'Yes' },
 *             { Id: 'N', Name: 'No' }
 *         ]
 *     }
 */
Ext.define('BIA.data.store.Memory', {
    extend: 'BIA.data.Store',

    alias: 'store.memory',

    /**
     * @cfg {Boolean} [autoLoad=true]
     * True to perform the 'load' operation at creation of this store.
     */
    autoLoad: true,

    /**
     * @cfg {Boolean} [remoteSort=true]
     * True to perform sorting of this store on the server.
     */
    remoteSort: false,

    /**
     * @cfg {Boolean} [remoteGroup=true]
     * True to perform grouping of this store on the server.
     */
    remoteGroup: false,

    /**
     * @cfg {Boolean} [remoteFilter=true]
     * True to perform filtering of this store on the server.
     */
    remoteFilter: false,

    fields: [
        { name: 'Id', type: 'string' },
        { name: 'Name', type: 'string' }
    ],

    constructor: function (config) {
        var me = this,
            config = config || {},
            data = config.data || me.data,
            proxy = config.proxy || me.proxy;

        /**
         * @cfg {Object[]} [data=null]
         * If defined, will automatically add the given json objects to this store.
         */
        if (data && !proxy) {
            config.proxy = { type: 'memory', reader: { type: 'json' } };
        }

        me.callParent([config]);
    }
});
