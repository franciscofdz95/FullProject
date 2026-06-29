Ext.define('App.Controller.User.List.Item', {
    extend: 'Ext.app.Controller',
    refs: [
        { selector: 'App-View-User-History-Window', ref: 'UserHistory' }
    ],
    init: function init() {
        var me = this;

        me.control({
            'App-View-User-List-ItemGrid, App-View-User-List-ItemList, App-View-User-List-ItemDetail': {
                afterrender: this.ListItemAfterRender
            },
            '#appAccess': {
                afterrender: this.AppAccessAfterRender
            },
            'App-View-User-List-ItemGrid [locationLabel=true]': {
                afterrender: this.LocationLabelAfterRender
            },
            'App-View-User-History-Grid': {
                afterrender: this.HistoryStoreLoad
            },
            'App-View-User-List-Item-Icon': {
                afterrender: this.RequestAfterRender
            }
        });
        me.listen({});
    },
    HistoryStoreLoad: function HistoryStoreLoad(me) {
        var params = me.up('[userId]');
        me.store.getProxy().extraParams = { userid: params.userId };
        me.store.load();
    },
    ListItemAfterRender: function ListItemAfterRender(me) {
        me.getEl().addListener({
            dblclick: {
                fn: this.ListItemDblClick,
                scope: this,
                args: [me]
            }
        });
    },
    AppAccessAfterRender: function AppAccessAfterRender(me) {
        me.getEl().addListener({
            click: {
                fn: this.AppAccessClick,
                scope: this,
                args: [me]
            }
        });
    },
    ListItemDblClick: function ListItemDblClick(me) {
        Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', {
            xtype: 'App-View-User-AddEditView',
            userId: me.user.UserId,
            user: me.user,
            formType: 'View'
        });
    },
    AppAccessClick: function ListItemClick(me) {
        var params = me.up('App-View-User-List-ItemGrid');

        if (!params) params = me.up('App-View-User-List-ItemDetail');
        if (!params) params = me.up('App-View-User-List-ItemList');

        var userHistory = this.getUserHistory();
        if (!userHistory) {
            historyWindow = Ext.create({
                xtype: 'App-View-User-History-Window',
                userId: params.user.UserId
            });
        }
        historyWindow.show();

    },
    LocationLabelAfterRender: function LocationLabelAfterRender(me) {
        if (Ext.isEmpty(me.text)) me.removeCls('UserLocation');
    },
    RequestAfterRender: function RequestAfterRender(me) {
        var rec = me.up('[user]');

        if (!rec.header && rec.user.UserType == 'ADUser') {
            me.getEl().addListener({
                click: {
                    fn: this.RequestClick,
                    scope: this,
                    args: [me]
                }
            });
        }
    },
    RequestClick: function RequestClick(me) {
        var rec = me.up('[user]'),
            view = me.up('pagedlist');

        Ext.create('App.View.Access.Request.Window', {
            loginId: rec.user.LoginId,
            userId: rec.user.UserId,
            view: view
        }).show();
    }
});