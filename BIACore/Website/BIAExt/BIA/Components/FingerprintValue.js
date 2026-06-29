Ext.define('BIA.Components.FingerprintValue', {
    singleton: true
}, function (me) {
    var cachedFingerprintValues = {},
        cacheSeconds = 30;

    var getFingerprintById = function (Id) {
        var fingerprint = null;
        //BIACore.ajax({
        //    async: false,
        //    url: BIACore.URL.GetFingerprintById,
        //    dataType: 'application/json',
        //    data: {
        //        FingerprintId: Id
        //    },
        //    success: function (data) {
        //        fingerprint = Ext.JSON.decode(data.responseText);
        //    }
        //});
        //var ajaxCall = BIACore.ajax({
        //    url: BIACore.URL.GetFingerprintById,
        //    dataType: 'json',
        //    data: {
        //        FingerprintId: Id
        //    },
        //    success: function (data) {
        //        fingerprint = Ext.JSON.decode(data.responseText);
        //    }
        //});
        //
        //var date = new Date();
        //while (fingerprint == null
        //    && Ext.Date.between(new Date(), date, Ext.Date.add(date, Ext.Date.MILLI, 40000))
        //    && ajaxCall.readyState != 4) {
        //    var s = "";
        //}
        Ext.Ajax.request({
            async: false,
            url: BIACore.URL.GetFingerprintById,
            jsonData: {
                FingerprintId: Id
            },
            success: function (data) {
                fingerprint = Ext.JSON.decode(data.responseText)
                //if (Ext.getVersion().major <= 5) fingerprint = Ext.JSON.decode(data.responseText)
                //else fingerprint = data.responseJson;
            }
        });
        return fingerprint;
    }

    var getFingerprintByValue = function (Value) {
        var fingerprint = null;
        //BIACore.ajax({
        //    async: false,
        //    url: BIACore.URL.GetFingerprintByValue,
        //    dataType: 'application/json',
        //    data: {
        //        Value: Ext.JSON.encode(Value)
        //    },
        //    success: function (data) {
        //        fingerprint = Ext.JSON.decode(data.responseText);
        //    }
        //});
        //var ajaxCall = BIACore.ajax({
        //    url: BIACore.URL.GetFingerprintByValue,
        //    dataType: 'json',
        //    data: {
        //        Value: Ext.JSON.encode(Value)
        //    },
        //    success: function (data) {
        //        fingerprint = Ext.JSON.decode(data.responseText);
        //    }
        //});
        //
        //var date = new Date();
        //while (fingerprint == null
        //    && Ext.Date.between(new Date(), date, Ext.Date.add(date, Ext.Date.MILLI, 40000))
        //    && ajaxCall.readyState != 4) {
        //    var s = "";
        //}
        Ext.Ajax.request({
            async: false,
            url: BIACore.URL.GetFingerprintByValue,
            jsonData: {
                Value: Ext.JSON.encode(Value)
            },
            success: function (data) {
                fingerprint = Ext.JSON.decode(data.responseText);
                
                //if (Ext.getVersion().major <= 5) fingerprint = Ext.JSON.decode(data.responseText)
                //else fingerprint = data.responseJson;
            }
        });
        return fingerprint;
    }

    Ext.apply(me, {
        getById: function (Id) {
            if (cachedFingerprintValues[Id]) Ext.log("Cached=" + cachedFingerprintValues[Id].Cached + ", Start=" + Ext.Date.subtract(new Date(), Ext.Date.SECOND, cacheSeconds) + ", End=" + (new Date()));
            if (cachedFingerprintValues[Id] && Ext.Date.between(cachedFingerprintValues[Id].Cached, Ext.Date.subtract(new Date(), Ext.Date.SECOND, cacheSeconds), new Date())) {
                return cachedFingerprintValues[Id];
            }
            else {
                cachedFingerprintValues[Id] = getFingerprintById(Id);
                if (cachedFingerprintValues[Id] == null) { delete cachedFingerprintValues[Id]; return null; }
                else {
                    cachedFingerprintValues[Id].Value = Ext.JSON.decode(cachedFingerprintValues[Id].Value);
                    var returnFingerprint = Ext.clone(cachedFingerprintValues[Id]);
                    cachedFingerprintValues[Id].Cached= new Date()
                    return returnFingerprint;
                }
            }
        },
        getByValue: function (Value) {
            var fingerprint = getFingerprintByValue(Value);
            if (fingerprint != null) {
                var Id = fingerprint.FingerprintId;
                cachedFingerprintValues[Id] = fingerprint;
                if (cachedFingerprintValues[Id] == null) { delete cachedFingerprintValues[Id]; return null; }
                else {
                    cachedFingerprintValues[Id].Value = Ext.JSON.decode(cachedFingerprintValues[Id].Value);
                    var returnFingerprint = Ext.clone(cachedFingerprintValues[Id]);
                    cachedFingerprintValues[Id].Cached = new Date()
                    return returnFingerprint;
                }
            }
            else return null;
        },
        logUsage: function (Id) {
            if (id != null) {
                Ext.Ajax.request({
                    async: false,
                    url: BIACore.URL.FingerprintUsageLog,
                    jsonData: {
                        FingerprintId: Id,
                        AppCode: BIACore.Security.Session.appCode,
                        UserId: BIACore.Security.User.userId
                    },
                    success: function (data) {
                        cachedFingerprintValues[Id] = Ext.apply(Ext.JSON.decode(data.responseText), { Cached: new Date() });
                        //if (Ext.getVersion().major <= 5) cachedFingerprintValues[Id] = Ext.apply(Ext.JSON.decode(data.responseText), { Cached: new Date() })
                        //else cachedFingerprintValues[Id] = Ext.apply(data.responseJson, { Cached: new Date() });
                        cachedFingerprintValues[Id].Value = Ext.JSON.decode(cachedFingerprintValues[Id].Value);
                    }
                });
            }
        }
    });
});