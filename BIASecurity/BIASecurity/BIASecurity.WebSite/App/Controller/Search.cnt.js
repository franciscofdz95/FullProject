Ext.define('App.Controller.Search', {
    extend: 'Ext.app.Controller',
    refs: [
        { selector: 'App-View-Content-Container[hidden=false][rendered=true]', ref: 'Content' },
        { selector: 'App-View-Navigation-NavBar #mainSearch', ref: 'MainSearch' },
        { selector: 'App-View-Navigation-NavBar #mainPin', ref: 'MainPin' }
    ],
    init: function init() {
        var me = this;

        me.control({
            'App-View-Navigation-NavBar #mainSearch': {
                select: this.SearchChange,
                clear: this.SearchClear
            },
            'App-View-Navigation-NavBar #mainPin': {
                beforerender: this.PinBeforeRender,
                select: this.PinChange,
                clear: this.PinClear
            },
            'App-View-Component-List-Container[searchList=true]': {
                beforerender: this.SearchListBeforeRender
            }
        });
        me.listen({
            global: {
                gotoNewContent: this.ChangeContentMainItem
            }
        });
    },
    PinBeforeRender: function PinBeforeRender(me) {
        if (!BIACore.Security.User.isAdmin()) {
            me.getStore().on({
                load: {
                    single: true,
                    scope: this,
                    fn: function () {
                        if (me.getStore().getCount() == 1) {
                            me.suspendEvents(false);
                            me.setValue(me.getStore().getAt(0).get('Id'))
                            me.resetOriginalValue();
                            me.resumeEvents();
                        } else {
                            me.setHidden(false);
                        }
                    }
                }
            });
            me.doQuery(BIACore.Security.User.userId);
            me.setDisabled(true);
        }
    },
    SearchChange: function SearchChange(me, rec) {
        var content = this.getContent();

        if (me.isDirty() || rec == null) {
            if (rec != null) {
                var searchGroup = rec.get('Group'),
                    searchValue = rec.get('Id'),
                    searchDisplay = rec.get('Name');

                if (content != null && (content.child() || { searchList: null }).searchList !== true) {
                    Ext.Msg.confirm('Search', 'Are you sure you want to navigate away from this page? Any unsaved changes may be lost.',
                        function (buttonId) {
                            if (buttonId == 'yes') {
                                this.applySearchPin(content);
                                Ext.fireEvent('searchChanged', {
                                    searchGroup: searchGroup,
                                    searchValue: searchValue,
                                    searchDisplay: searchDisplay
                                });
                            }
                        }, this);
                } else {
                    this.applySearchPin(content);
                    Ext.fireEvent('searchChanged', {
                        searchGroup: searchGroup,
                        searchValue: searchValue,
                        searchDisplay: searchDisplay
                    });
                }

                this.insertHistory(searchGroup, searchValue, 'Search');
            } else {
                this.applySearchPin(content);
                Ext.fireEvent('searchChanged', {
                    searchGroup: null,
                    searchValue: null,
                    searchDisplay: null
                });
            }
        }
    },
    SearchClear: function SearchClear(me) {
        this.SearchChange(me, null);
    },
    applySearchPin: function applySearchPin(content) {
        var list = content.child('App-View-Component-List-Container[searchList=true]'),
            targetXType = null,
            pinField = this.getMainPin(),
            pinRec = pinField.findRecordByValue(pinField.getValue()),
            pinGroup = (pinRec) ? pinRec.get('Group') : null,
            pinValue = (pinRec) ? pinRec.get('Id') : null,
            searchField = this.getMainSearch(),
            searchRec = searchField.findRecordByValue(searchField.getValue()),
            searchGroup = (searchRec) ? searchRec.get('Group') : null,
            searchValue = (searchRec) ? searchRec.get('Id') : null,
            searchDisplay = (searchRec) ? searchRec.get('Name') : null;

        if (list && list.searchListNavigateOnChange === false) {
            targetXType = list.xtype;
        } else {
            switch (searchGroup) {
                case 'Application': targetXType = 'App-View-Application-List'; break;
                case 'User': targetXType = 'App-View-User-List'; break;
                default: targetXType = (list) ? list.xtype : null;
            }
        }

        if (list && list.xtype == targetXType) {
            var view = list.down('BIA-Components-PagedList');

            if (view) {
                view.store.getProxy().extraParams = Ext.apply(view.store.getProxy().extraParams, {
                    searchGroup: searchGroup,
                    searchValue: searchValue,
                    pinGroup: pinGroup,
                    pinValue: pinValue
                });

                view.changeCurrentPage(1);
                view.store.load();
            }
        }

        if (targetXType) {
            BIA.Components.DeepLink.addEventHistory('gotoNewContent', {
                xtype: targetXType,
                searchDisplay: searchDisplay,
                params: {
                    searchGroup: searchGroup,
                    searchValue: searchValue,
                    pinGroup: pinGroup,
                    pinValue: pinValue
                },
                noChangeIfSameXtype: true
            });
        }
    },
    PinChange: function PinChange(me, rec) {
        var content = this.getContent(),
            pinGroup = null,
            pinValue = null;

        if (me.isDirty() || rec == null) {
            if (rec != null) {
                var pinGroup = rec.get('Group'),
                    pinValue = rec.get('Id');
            }

            this.applySearchPin(content);
            Ext.fireEvent('pinChanged', {
                pinGroup: pinGroup,
                pinValue: pinValue
            });

            this.insertHistory(pinGroup, pinValue, 'Pin');
        }
    },
    PinClear: function PinClear(me) {
        this.PinChange(me, null);
    },
    ChangeContentMainItem: function ChangeContentMainItem(args) {
        var searchField = this.getMainSearch();

        if (searchField) {

            searchField.suspendEvents(false);
            if (args.params && !Ext.isEmpty(args.params.searchValue)) {
                searchField.setValue(args.params.searchValue);
            } else {
                searchField.setValue(null);
            }
            searchField.resetOriginalValue();
            searchField.resumeEvents();
        }
    },
    insertHistory: function insertHistory(group, id, type) {
        if (group != null && id != null && type != null) {
            BIA.Ajax.request({
                url: 'api/BIASecurity/SearchHistoryInsert',
                jsonData: {
                    id: id,
                    group: group,
                    eventType: type
                }
            });
        }
    },
    SearchListBeforeRender: function SearchListBeforeRender(me) {
        var view = me.down('BIA-Components-PagedList'),
            pinField = this.getMainPin(),
            pinRec = pinField.findRecordByValue(pinField.getValue()),
            pinGroup = (pinRec) ? pinRec.get('Group') : null,
            pinValue = (pinRec) ? pinRec.get('Id') : null;

        if (view && pinValue != null) {
            view.store.getProxy().extraParams = Ext.applyIf(view.store.getProxy().extraParams, {
                pinGroup: pinGroup,
                pinValue: pinValue
            });
        }
    }
});