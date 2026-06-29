/**
 * This is basically a regular {@link Ext.data.Store} with a few intelligent defaults defined
 * to make report construction less repetitive.
 *
 * Designed for use with WebAPI data sources.
 */
Ext.define('BIA.data.store.WebAPI', {
    extend: 'BIA.data.Store',

    alias: 'store.webapi',

    summary: [],

    constructor: function (config) {
        var me = this,
            config = config || {},
            api = config.api || me.api,
            proxy = config.proxy || me.proxy;

        /**
         * @cfg {Object} [api=null]
         * If defined, will automatically apply the given api values to a {@link BIA.data.proxy.WebAPI} proxy
         * and add it to the store.
         * ** Note: ** this is mutually exclusive with a defined proxy.
         */
        if (api && !proxy) {
            config.proxy = { type: 'webapi', api: api };
        }
        if (config.proxy && config.proxy.api && config.proxy.api.extraParams)
            config.proxy.extraParams = Ext.apply(config.proxy.extraParams || {}, config.proxy.api.extraParams || {});

        me.callParent([config]);
    },

    setProxy: function (proxy) {
        // ext4's setProxy path.
        var me = this;

        if (!proxy) {
            // null or undefined
        } else if (proxy instanceof Ext.data.proxy.Proxy) {
            proxy.setModel(me.model);
        } else {
            if (Ext.isString(proxy)) {
                proxy = {
                    type: proxy
                };
            }
            Ext.applyIf(proxy, {
                model: me.model
            });

            proxy = Ext.createByAlias('proxy.' + proxy.type, proxy);
        }

        if (proxy && Ext.getVersion().major >= 5) {
            me.relayEvents(proxy, ['metachange']);
        }

        if (proxy && proxy.api && proxy.api.extraParams)
            proxy.extraParams = Ext.apply(proxy.extraParams || {}, proxy.api.extraParams || {});

        return me.proxy = proxy;
    },

    /**
     * Added because webapi proxy doesn't appear to be setting the implicit model on the store on metaChange event.
     * Probably need to find a more elegant way to bubble the model from the reader -> proxy -> store.
     */
    getModel: function () {
        var me = this;
        return me.getProxy && me.getProxy() != null && me.getProxy().getModel ? me.getProxy().getModel() : (me.model || null);
    },

    /**
     * override to allow 'summary' property on webapi stores
     */
    onProxyLoad: function (operation) {
        var me = this,
            resultSet = operation.getResultSet();

        if (resultSet) {
            me.summary = (resultSet.summary) ? resultSet.summary : [];
        }
        me.callOverridden(arguments);
    }
});
