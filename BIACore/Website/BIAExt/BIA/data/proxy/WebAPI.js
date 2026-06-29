/**
 * The WebAPI data Proxy.
 * This, along with some methods on the c# side provide a nearly automated process for
 * getting data from the server to the client with minimal interaction from the developer.
 */
Ext.define('BIA.data.proxy.WebAPI', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.webapi',

    /**
     * @cfg {String} [queryParam='query']
     * The parameter used by combo boxes when 'searching' for text.
     */
    queryParam: 'query',

    /**
     * @cfg {Object} [reader={type: 'webapi'}]
     * The default reader type for this proxy is 'webapi'
     * see {@link BIA.data.reader.WebAPI}
     */
    reader: { type: 'webapi' },

    /**
     * @cfg {Object} [writer={type: 'webapi'}]
     * The default writer type for this proxy is 'webapi'
     * see {@link BIA.data.writer.WebAPI}
     */
    writer: { type: 'webapi' },

    /**
     * @cfg {Boolean} [useRecursiveEncode=true]
     * When using the query string to pass parameters, push all of the params as 1 encoded object, or several separate values
     */
    useRecursiveEncode: true,

    /**
     * @cfg {Object} actionMethods
     * The default HTTP methods used by CRUD operations
     *     @example
     *     actionMethods = {
     *         create: 'POST',
     *         read: 'POST',
     *         update: 'PUT',
     *         destroy: 'DELETE'
     *     }
     */
    actionMethods: {
        create: 'POST',
        read: 'POST',
        update: 'POST',
        destroy: 'POST'
    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        // this should be happening in Ext.data.proxy.Proxy, but it isn't in our version of Ext.
        // fortunately, it's written in such a way that calling it again doesn't hurt.
        if (me.reader) {
            me.setReader(me.reader);
            // create the reader->proxy reversal so metaData updates model on proxy (and therefore store)
            if (Ext.getVersion().major >= 5) {
                me.getReader().setProxy(me);
            }
        }

        // this should be happening in Ext.data.proxy.Proxy, but it isn't in our version of Ext.
        // fortunately, it's written in such a way that calling it again doesn't hurt.
        if (me.writer) {
            me.setWriter(me.writer);
        }

        //Only pass this param if its specifically asked for.
        if (Ext.isEmpty(config.pageParam)) {
            me.pageParam = null;
        }

        if (me.api && me.api.extraParams) {
            me.extraParams = Ext.apply(me.extraParams || {}, me.api.extraParams);
        }
    },

    /**
     * Creates a request object for an operation
     * @param {Ext.data.Operation} operation
     * @returns {Ext.data.Request} the completed request
     */
    buildRequest: function () {
        var me = this,
            request = me.callParent(arguments);

        if (me.actionMethods.read === "POST") {
            me.writePostBody(request);
        } else if (me.useRecursiveEncode) {
            me.writeRecursiveEncode(request);
        }

        return request;
    },

    /**
     * Generates the post body for the given request based on
     * the operation type specified. Performs Ext->WebAPI property mapping.
     * @param {Ext.data.Request} request the request in progress
     */
    writePostBody: function (request) {
        var me = this,
            webApiData = {},
            operation = request.getOperation(),
            params = request.getParams(),
            array;

        // move extraParams over to jsonData object
        for (var prop in me.extraParams) {
            webApiData[prop] = me.extraParams[prop];
            delete params[prop];
        }

        if (request.getProxy) {
            if (request.getProxy().store && !request.getProxy().store.isLoaded() && request.getProxy().store.isLoading() && request.getProxy().store.extraParams) {
                request.getProxy().extraParams = Ext.apply(request.getProxy().store.extraParams, request.getProxy().extraParams);
                webApiData = Ext.apply(request.getProxy().store.extraParams, webApiData);
            }

            if (request.getProxy().store && !request.getProxy().store.isLoaded() && request.getProxy().store.isLoading() && request.getProxy().api && request.getProxy().api.extraParams) {
                request.getProxy().extraParams = Ext.apply(request.getProxy().api.extraParams, request.getProxy().extraParams);
                webApiData = Ext.apply(request.getProxy().api.extraParams, webApiData);
            }
        }

        // move paging data over to jsonData object
        if (operation.getStart) { webApiData[me.startParam] = operation.getStart(); }
        if (operation.getLimit) { webApiData[me.limitParam] = operation.getLimit(); }
        if (operation.getGrouper) { webApiData[me.groupParam] = operation.getGrouper(); }

        array = [];
        if (operation.getFilters) {
            Ext.each(operation.getFilters(), function (item) {
                array.push(item.getState());
            });
        }
        if (array.length > 0) {
            webApiData[me.filterParam] = array;
        }

        array = [];
        if (operation.getSorters) {
            Ext.each(operation.getSorters(), function (item) {
                array.push(item.getState());
            });
        }
        if (array.length > 0) {
            webApiData[me.sortParam] = array;
        }

        if (Ext.getVersion().major >= 5) {
            // starting with Ext5, move the 'query' param into the request body.
            // added fix to prevent params from over-riding wepApiData (aka extraParams)
            if (Ext.isEmpty(webApiData[me.queryParam])) webApiData[me.queryParam] = params[me.queryParam];
            delete params[me.queryParam];
        }

        delete params[me.startParam];
        delete params[me.limitParam];
        delete params[me.groupParam];
        delete params[me.filterParam];
        delete params[me.sortParam];

        request.setJsonData(Ext.Object.merge(webApiData, request.getJsonData()));
    },


    /**
     * Generates the correct HTTP url for the given operation.
     * @param {Ext.data.Request} request the request in progress
     */
    writeRecursiveEncode: function (request) {
        var me = this,
            params = request.params || {},
            operation = request.operation,
            props = me.propertyMap();

        Ext.each(props, function (prop) {
            if (prop.p && Ext.isDefined(prop.o)) {
                params[prop.p] = operation[prop.o];
            }
        });

        //NOTE: This can be made more efficient at the risk of being more brittle.
        var encoded = Ext.Object.toQueryString(params, true),
            recursiveParams = Ext.Object.fromQueryString(encoded, false);
        request.params = recursiveParams;
    },

    /**
     * @private
     * A list of mappings for Ext Operations to WebAPI methods.
     */
    propertyMap: function () {
        var me = this;
        return [
            { p: me.startParam, o: 'start' },
            { p: me.limitParam, o: 'limit' },
            { p: me.groupParam, o: 'groupers' },
            { p: me.filterParam, o: 'filters' },
            { p: me.sortParam, o: 'sorters' }
        ];
    }
});
