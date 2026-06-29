/**
 * This is basically a regular {@link Ext.data.Store} with a few intelligent defaults defined
 * to make report construction less repetitive.
 */
Ext.define('BIA.data.Store', {
    extend: 'Ext.data.Store',

    /**
     * @cfg {Boolean} [autoLoad=false]
     * True to perform the 'load' operation at creation of this store.
     */
    autoLoad: false,

    /**
     * @cfg {Boolean} [remoteSort=true]
     * True to perform sorting of this store on the server.
     * When using 'webapi' with a SQL data source, this will probably need to be true.
     */
    remoteSort: true,

    /**
     * @cfg {Boolean} [remoteGroup=true]
     * True to perform grouping of this store on the server.
     * When using 'webapi' with a SQL data source, this will probably need to be true.
     */
    remoteGroup: true,

    /**
     * @cfg {Boolean} [remoteFilter=true]
     * True to perform filtering of this store on the server.
     * When using 'webapi' with a SQL data source, this will probably need to be true.
     */
    remoteFilter: true,

    fields: [],

    constructor: function (config) {
        var me = this,
            config = config || {};

        // force loading = true when we know it's going to autoload.
        if (me.autoLoad || config.autoLoad) {
            me.loading = true;
        }
        me.callParent([config]);

        // give the proxy a link back to the store that "owns" it.
        // this allows metachange event to bubble the new model all the way up to the store.
        me.proxy.store = me;
    },

    /**
     * TODO: remember why I added this. I think it has something to do with a grid feature needing it.
     * @param {Ext.data.Model/String/Object} model the model to set on this Store.
     */
    setModel: function (model) {
        if (Ext.getVersion().major >= 5)
            this.model = Ext.data.schema.Schema.lookupEntity(model);
        else
            this.model = Ext.ModelManager.getModel(model);

        if (Ext.getVersion().major >= 7)
            this.callParent(arguments);
    }
});