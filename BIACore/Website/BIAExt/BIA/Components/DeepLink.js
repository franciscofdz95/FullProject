Ext.define('BIA.Components.DeepLink', {
    singleton: true,
    mixins: (Ext.versions.extjs.major > 4 ? ['Ext.mixin.Observable'] : []),
    deepLinkHashPrefix: "fp="  
}, function (me) {
    me.hasListeners = me.HasListeners;
    function iGetCurrentHashHistory() {
        var token = Ext.History.getToken();
        return token && Ext.String.startsWith(token, me.deepLinkHashPrefix) ? BIA.Components.FingerprintValue.getById(token.replace(me.deepLinkHashPrefix, '')) : null;
    }
    function iGetCurrentQueryHistory() {
        var queryString = Ext.Object.fromQueryString(window.location.search.substring(1), true);
        return (queryString.fp ? BIA.Components.FingerprintValue.getById(queryString.fp.replace(' ', '+').replace('+','_')) : null);
    }
    function iIsHistoryInQuery() {
        return iGetCurrentQueryHistory() != null;
    }
    function iConvertHistoryFromQueryToHash() {
        var queryString = Ext.Object.fromQueryString(window.location.search.substring(1), true);
        if (queryString.fp) {
            var hash = '#' + me.deepLinkHashPrefix + queryString.fp;
            delete queryString.fp;
            var qs = Ext.Object.toQueryString(queryString)
            var newUrl = "";
            if (window.location.origin) newUrl = window.location.origin + window.location.pathname + (qs.length > 0 ? '?' + qs : '') + hash;
            else newUrl = "https://" + window.location.host + window.location.pathname + (qs.length > 0 ? '?' + qs : '') + hash;

            if (window.location.replace) window.location.replace(newUrl);
            else window.location.href = newUrl;
        }
    }
    function iGetCurrentHistory() {
        var fingerprint;
        if (iIsHistoryInQuery()) {
            fingerprint = iGetCurrentQueryHistory();
        }
        else {
            fingerprint = iGetCurrentHashHistory();
        }
        return fingerprint;
    }
    function iExecuteHistoryItem(fingerprintId) {
        if (me.fireEvent('beforeRead') != false) {
            var fingerprint;
            if (fingerprintId) fingerprint = BIA.Components.FingerprintValue.getById(fingerprintId);
            else fingerprint = iGetCurrentHistory();

            if (fingerprint != null && fingerprint.Value != null) {
                if (fingerprint.Value.deepLinkType) {
                    switch (fingerprint.Value.deepLinkType) {
                        case 'Event':
                            iExecuteEventHistory(fingerprint);
                            break;
                    }
                }
            }
        }
    }
    function iExecuteEventHistory(fingerprint) {
        if (fingerprint != null && fingerprint.Value != null) { 
            if((Ext.isObject(fingerprint.Value) && fingerprint.Value.paramArgsArray != true) || 
                (Ext.isArray(fingerprint.Value) && fingerprint.Value.paramArgsArray == true)) {
                var deepLink = fingerprint.Value;
                if (me.fireEvent('beforeExecute', deepLink.eventName, deepLink.params, deepLink.eventObject, deepLink.paramArgsArray) != false) {
                    var eventObject = deepLink.eventObject != null ? Ext.ComponentQuery.query(deepLink.eventObject)[0] : Ext.GlobalEvents;

                    if (eventObject == null) {
                        if (deepLink.eventObject != null) Ext.log({ msg: "Could not find specified Event Object.", level: "error", dump: deepLink });
                        else Ext.log({ msg: "Could not get Ext.GlobalEvents", level: "error", dump: deepLink });
                    }

                    if (deepLink.paramArgsArray === true) eventObject.fireEventArgs(deepLink.eventName, deepLink.params);
                    else eventObject.fireEvent(deepLink.eventName, deepLink.params);
                }
            }
        }
        else Ext.log({ msg: "Could not decrpyt Deep Link object", level: "error", dump: fingerprint });
    }
    function iLoadDeepLinkOnStartup() {
        if (iIsHistoryInQuery()) {
            iConvertHistoryFromQueryToHash();
        }
        else {
            iExecuteHistoryItem();
        }
    }
    function addApplicationRoute() {
        if (typeof App !== "undefined" && App.getApplication) {
            if (App.getApplication().updateRoutes) {
                App.getApplication().updateRoutes({
                    'fp=:id': {
                        action: iExecuteHistoryItem,
                        conditions: {
                            ':id': '([A-Za-z][A-Za-z0-9\^!\$\.:\+_~\-]+)'
                        }
                    }
                });

                if (App.getApplication().loadDeepLinkOnStartup) iLoadDeepLinkOnStartup();
            }
            else if (App.getApplication().setRoutes) {
                App.getApplication().setRoutes({
                    'fp=:id': {
                        action: iExecuteHistoryItem,
                        conditions: {
                            ':id': '([A-Za-z][A-Za-z0-9\^!\$\.:\+_~\-]+)'
                        }
                    }
                });

                if (App.getApplication().loadDeepLinkOnStartup) iLoadDeepLinkOnStartup();
            }
        }
        else {
            Ext.defer(addApplicationRoute, 10);
        }
    }
    
    /****************************************************************************************************
    * Event Deep Link Validation
    *****************************************************************************************************/
    var extComponentFound = false,
        nestedComponentsPastLimit = false,
        paramMaxObjectDepth = 15;

    function iRecursiveParamsDeepDiveCheck(obj, depth) {
        depth = depth == null ? 1 : depth;

        if (depth > paramMaxObjectDepth) nestedComponentsPastLimit = true;

        if (obj.getName && Ext.isFunction(obj.getnName) && obj.create && Ext.isFunction(obj.create) && obj.initConfig && Ext.isFunction(obj.initConfig))
            extComponentFound = true;

        //var prop = null;
        //var index = 0;
        for (var prop in obj) {
            if (Ext.isObject(obj[prop])) iRecursiveParamsDeepDiveCheck(obj[prop], depth + 1);
            if (Ext.isArray(obj[prop])) {
                for (var index = 0; index < obj[prop].length; index++) {
                    if (Ext.isObject(obj[prop][index])) iRecursiveParamsDeepDiveCheck(obj[prop][index], depth + 1);
                }
            }
        }

        if (extComponentFound || nestedComponentsPastLimit) return;
    }
    function iValidateDeepLinkEventName(eventName) {
        if (eventName == null) {
            Ext.log({ msg: "Deep Link EventName is null." });
            return false;
        }
        else if (!Ext.isString(eventName)) {
            Ext.log({ msg: "Deep Link EventName is not a string.", dump: eventName });
            return false;
        }
        return true;
    }
    function iValidateDeepLinkParams(params) {
        extComponentFound = false,
        nestedComponentsPastLimit = false;

        iRecursiveParamsDeepDiveCheck(params);

        if (extComponentFound) {
            Ext.log("Deep Link params contains an Ext Component Object reference.");
            return false;
        }
        else if (nestedComponentsPastLimit) {
            Ext.log("Deep Link params contained too many nested objects. Limit: " + me.paramMaxObjectDepth);
            return false;
        }
        return true;
    }
    function iValidateDeepLinkEventObject(eventObject) {
        if (eventObject != null) {
            if (!Ext.isString(eventObject)) {
                Ext.log({ msg: "Deep Link Event Object is not a string.", dump: eventObject });
                return false;
            }
            else if (Ext.ComponentQuery.query(eventObject).length == 0) {
                Ext.log({ msg: "Deep Link could not find Event Object.", level: "warn", dump: eventObject });
            }
        }
        return true;
    }

    /****************************************************************************************************
    * Add accessor methods to DeepLink
    *****************************************************************************************************/
    Ext.apply(me, {
        getDeepLinkFingerprint: function getDeepLinkFingerprint(eventName, params, eventObject, paramArgsArray) {
            if (!iValidateDeepLinkEventName(eventName)) throw "Deep Link Event Name Invalid";
            if (!iValidateDeepLinkParams(params)) throw "Deep Link Params Invalid";
            if (!iValidateDeepLinkEventObject(eventObject)) throw "Deep Link Event Object Invalid";

            return BIA.Components.FingerprintValue.getByValue({
                eventName: eventName,
                params: params,
                eventObject: eventObject || null,
                paramArgsArray: paramArgsArray,
                deepLinkType: 'Event'
            });
        },
        addEventHistory: function addEventHistory(eventName, params, eventObject, paramArgsArray, preventDuplicates) {
            if (!iValidateDeepLinkEventName(eventName)) throw "Deep Link Event Name Invalid";
            if (!iValidateDeepLinkParams(params)) throw "Deep Link Params Invalid";
            if (!iValidateDeepLinkEventObject(eventObject)) throw "Deep Link Event Object Invalid";

            var fingerprint = me.getDeepLinkFingerprint(eventName, params, eventObject, paramArgsArray, preventDuplicates);

            if (fingerprint != null) {
                if (me.fireEventArgs('beforeAdd', arguments)) {
                    BIA.Components.FingerprintValue.logUsage(fingerprint.FingerprintId);
                    Ext.History.add(me.deepLinkHashPrefix + fingerprint.FingerprintId, preventDuplicates);
                }
            }
            else throw "Deep Link Unable To Hash-ify";

            return true;
        },
        back: function () {
            Ext.History.back();
        },
        forward: function () {
            Ext.History.forward();
        },
        reload: function () {
            if (iGetCurrentHistory() != null) {
                iExecuteHistoryItem();
                return true;
            }
            else return false;
        }
    });

    addApplicationRoute();
});