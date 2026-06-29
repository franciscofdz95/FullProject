Ext.define('App.controller.Desktop', {
    extend: 'Ext.app.Controller',

    init: function () {
        var me = this;
        me.control({
            '[xtype="App-Desktop"] window': {
                activate: me.activate
            },
            '[xtype="App-Desktop"]': {
                boxready: me.loadHash,
                destroy: me.unloadHash
            }
        });
        try {
            if (window.location.hash.replace('#', '').indexOf('Log!') == 0) {
                var deepLinkObj = {
                    xtype: 'App-View-Admin-Logs-Container',
                    deeplinkData: {},
                    noChangeIfSameXtype: true
                },
                    filterParams = {},
                    params = window.location.hash.split('!')[1].split('/'),
                    paramPropertyMap = {
                        LogId: ['StartLogId', 'EndLogId'],
                        AppCode: 'AppCode',
                        BeginDate: 'StartLogDate',
                        EndDate: 'EndLogDate',
                        UserId: 'User',
                        Level: 'Level',
                        Event: 'EventSearch',
                        Search: 'DetailSearch'
                    },
                    propertiesToUppercase = ['AppCode', 'UserId', 'Level'],
                    valueAsArray = ['AppCode','Level','UserId'];
                for (var i = 0; i < params.length; i++) {
                    var p = params[i].split('=')[0],
                        v = params[i].split('=')[1],
                        prop = paramPropertyMap[p];
                    if (p.indexOf('Date') > -1) {
                        v = Ext.Date.add(new Date(v), Ext.Date.DAY, 1);
                        if (p.indexOf('End') > -1) v.setHours(23, 59, 0, 0);
                    }
                    if (propertiesToUppercase.indexOf(p) > -1) v = v.toString().toUpperCase();
                    if (Ext.isArray(prop)) {
                        for (var pm = 0; pm < prop.length; pm++) {
                            filterParams[prop[pm]] = v;
                        }
                    }
                    else {
                        filterParams[prop] = valueAsArray.indexOf(p) > -1 ? [v] : v;
                    }
                }

                deepLinkObj.deeplinkData.filterParams = filterParams;

                var url ='https://biasecurity.bia.inside.ups.com/?'
                    + BIACore.$.param({
                        historyToken: 'gotoNewContent~' + window.JSON.stringify({
                            xtype: 'App-View-Admin-Logs-Container',
                            noChangeIfSameXtype: true,
                            deeplinkData: {
                                currentPage: 1,
                                filterParams: filterParams
                            }
                        })
                    });

                window.location = url;
            }
        }
        catch (err) { }
    },
    activate: function (window) {
        BIACore.Hash.set(window.getUrl());
        //App.History.push(window.getUrl());
    },
    loadHash: function (desktop) {
        var me = this,
            hash = BIACore.Hash.get();

        if (hash != '') {
            var parts = hash.split('!'),
                param_parts = (parts.length > 1) ? decodeURI(parts[1]).split('/') : [],
                params = {}, temp;

            // get the module name
            Ext.each(param_parts, function (p) {
                temp = p.split('=');
                if (temp.length > 1) {
                    params[temp[0]] = temp[1].indexOf('[') > -1 || temp[1].indexOf('{') > -1 ? eval(temp[1]) : temp[1];
                }
            });

            if (params.AppCode) { params.AppCode = [params.AppCode]; }

            var module = parts[0];
            // temporary fix until '!detail/LogId=12345' is no longer in use.
            if (module === '') {
                module = 'LogDetail';
            }
            desktop.createWindow({ xtype: 'App-module-' + module, data: params, maximized: true});
        }
    },
    unloadHash: function (desktop) {
        var me = this,
            hash = BIACore.Hash.get();

        if (hash != '') BIACore.Hash.set('');
    }
});