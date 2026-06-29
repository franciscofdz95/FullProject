var HISTORY_TOKEN_DELIMINATOR = '~';
Ext.define('App.Controller.AppNav', {
    extend: 'Ext.app.Controller',
    refs: [
        { selector: 'App-View-Content-Container[hidden=false][rendered=true]', ref: 'Content' }
    ],
    historyTokenDeliminator: HISTORY_TOKEN_DELIMINATOR,
    historyTokenAdded: false,
    historyTokenHandled: false,
    defaultEventHistory: {
        eventName: 'gotoNewContent',
        params: { xtype: 'App-View-Application-List', flex: 1 }
    },
    defaultLogFilter: {
        AppCode: [],
        DetailSearch: "",
        EndLogDate: null,
        EndLogId: null,
        EventSearch: "",
        GroupMessage: [],
        Level: [],
        Server: [],
        StartLogDate: new Date(Ext.Date.clearTime(new Date()).setHours((new Date()).getHours() - 4)),
        StartLogId: null,
        TransactionId: [],
        User: []
    },

    init: function init() {
        var me = this;

        //me.control({
        //    'App-View-Admin-ADSM-List, App-View-Admin-ADSM-Process-Container, App-View-Admin-ADSM-AddEditProcess-Container': {
        //        added: this.ADSMObseleteRedirect
        //    }
        //});
        me.listen({
            global: {
                added: {
                    fn: this.ComponentAdded
                },
                gotoAdminTool: {
                    fn: this.GotoAdminTool
                },
                gotoNewContent: {
                    fn: this.ChangeContentMainItem
                },
                gotoAddContent: {
                    fn: this.OpenAddContentWindow
                },
                doAppDeepLink: {
                    fn: this.DoAppDeepLink
                }
            }
        });

        var urlQueryString = Ext.urlDecode(window.location.search);

        if (!Ext.isEmpty(urlQueryString.accessRequest)) {
            this.OpenAccessRequest(urlQueryString.accessRequest);
        }

        if (Ext.History.getToken() == "") {
            if (urlQueryString.historyToken == null || this.historyTokenHandled) {
                BIA.Components.DeepLink.addEventHistory(this.defaultEventHistory.eventName, this.defaultEventHistory.params);
            }
            else {
                var eventName = urlQueryString.historyToken.split(this.historyTokenDeliminator)[0];
                var details = urlQueryString.historyToken.split(this.historyTokenDeliminator)[1];
                var logDetailId = details.split("|")[0];
                var appCode = details.split("|")[1];
                var eventParams = {};
                this.historyTokenHandled = true;
                eventParams.xtype = "App-View-Admin-Logs-Container";
                eventParams.noChangeIfSameXtype = true;
                eventParams.deeplinkData = {};
                eventParams.deeplinkData.currentPage = 1;
                eventParams.deeplinkData.listType = "grouped";
                eventParams.deeplinkData.filterParams = Ext.apply(this.defaultLogFilter, {});
                eventParams.deeplinkData.filterParams.AppCode = [appCode];
                if (!Ext.isEmpty(logDetailId)) eventParams.deeplinkData.logDetailId = logDetailId;

                // OLD CODE, used to take a query string with JSON, breaks many rules..
                //if (eventParams.indexOf('{') == 0) {
                //    eventParams = Ext.JSON.decode(eventParams);
                //    if (eventParams.xtype === 'App-View-Admin-Logs-Container') {
                //        eventParams.deeplinkData = Ext.apply({ currentPage: 1, listType: 'grouped' }, eventParams.deeplinkData);
                //        eventParams.deeplinkData.filterParams = Ext.apply(this.defaultLogFilter, eventParams.deeplinkData.filterParams || {});
                //    }
                //}
                var fp = BIA.Components.DeepLink.getDeepLinkFingerprint(eventName, eventParams);
                window.location = window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + BIA.Components.DeepLink.deepLinkHashPrefix + fp.FingerprintId;
                //window.location = window.location.origin + window.location.pathname + '#' + BIA.Components.DeepLink.deepLinkHashPrefix + fp.FingerprintId;
                //BIA.Components.DeepLink.addEventHistory(eventName, eventParams);
            }
        }
    },
    ComponentAdded: function ComponentAdded(me, eOpts) {
        Ext.Object.each(me, function (key, value, myself) {
            if (Ext.isObject(value)) {
                if (BIA.util.Accessors.BaseClassSearch(value, 'Ext.data.Store')) {
                    value.addListener({
                        beforeload: {
                            priority: -999,
                            fn: this.AddStoreLoadParamater,
                            scope: this
                        }
                    });
                }
            }
        }, this);
    },
    AddStoreLoadParamater: function AddStoreLoadParamater(store, operation, eOpts) {
        if (store.proxy) {
            //store.proxy.extraParams['domainId'] = (this.GetCurrentDomain() || {}).domainId;
            //var pinnedTags = Ext.ComponentQuery.query('App-View-Navigation-PinnedTags[hidden=false]')[0].getPinnedTagValues();
            //store.proxy.extraParams['pinnedTags'] = pinnedTags == '' ? null : pinnedTags;
        }
    },
    ChangeContentMainItem: function ChangeContentMainItem(newItem, noChangeIfSameXtype) {
        var returnItem = null;
        var content = this.getContent();
        if (content && content.rendered) {
            if (Ext.isObject(newItem)) {
                if (content.fireEvent('beforeMainItemChange', content, newItem, content.query('>').length > 1 ? content.child() : null) === false) {
                    return;
                }

                if ((!Ext.isBoolean(noChangeIfSameXtype) ? newItem.noChangeIfSameXtype : noChangeIfSameXtype) == true && (content.child() || { xtype: null }).xtype == newItem.xtype) {
                    returnItem = content.child();
                }
                else {
                    content.setLoading(true);
                    Ext.suspendLayouts();
                    if (content.query('>').length > 0) { content.child().destroy(); }
                    returnItem = content.insert(0, newItem);
                    Ext.resumeLayouts(true);
                    content.setLoading(false);
                }

                //afterMainItemChange Event Args: content, newItemConfig, newItem
                content.fireEvent('afterMainItemChange', content, newItem, returnItem);
                return returnItem;
            }
        }
        else {
            setTimeout(this.ChangeContentMainItem.bind(this), 100, newItem, noChangeIfSameXtype);
        }
    },
    GotoAdminTool: function GotoAdminTool(params) {
        this.ChangeContentMainItem({
            xtype: params.xtype,
            viewData: params.viewData
        });
    },
    DoAppDeepLink: function DoAppDeepLink(event, evtObj) {
        BIA.Components.DeepLink.addEventHistory(event, evtObj);
    },
    //ADSMObseleteRedirect: function ADSMObseleteRedirect() {
    //    Ext.GlobalEvents.fireEvent('doAppDeepLink', this.defaultEventHistory.eventName, this.defaultEventHistory.params);
    //},
    OpenAddContentWindow: function OpenAddContentWindow(newItem) {
        var content = this.getContent()

        Ext.create(newItem.class, {
            content: content
        }).show();
    },
    OpenAccessRequest: function OpenAccessRequest(appCode) {
        var content = this.getContent();
        if (content && content.rendered) {
            if (!Ext.isEmpty(appCode)) {
                var win = Ext.create('App.View.Access.Request.Window', {
                    appCode: appCode
                });
                win.show();
            }
        }
        else {
            setTimeout(this.OpenAccessRequest.bind(this), 100, appCode);
        }
    },
});