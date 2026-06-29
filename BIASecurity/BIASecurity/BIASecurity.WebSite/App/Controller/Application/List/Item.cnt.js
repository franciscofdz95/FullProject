Ext.define('App.Controller.Application.List.Item', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        var me = this;

        me.control({
            'App-View-Application-List-ItemGrid, App-View-Application-List-ItemList, App-View-Application-List-ItemDetail': {
                afterrender: this.ListItemAfterRender
            },
            'hoverwindow #AppDescriptionHoverWindow': {
                beforerender: this.AppDescriptionHoverBeforeRender
            },
            'App-View-Application-List-Item-Request': {
                afterrender: this.RequestAfterRender
            }
        });
        me.listen({});
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
    ListItemDblClick: function ListItemDblClick(me) {
        Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', {
            xtype: 'App-View-Application-AddEditView',
            appCode: me.application.AppCode,
            formType: BIACore.Security.User.isSA() ? 'Edit' : 'View'
        });
    },
    AppDescriptionHoverBeforeRender: function AppDescriptionHoverBeforeRender(me) {
        var desc = Ext.isEmpty(me.application.Description) ? 'No description provided' : me.application.Description;
        me.setText(desc);
    },
    RequestAfterRender: function RequestAfterRender(me) {
        var rec = me.up('[application]');

        if (!rec.header && rec.application.hasAccess == "No") {
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
        var rec = me.up('[application]'),
            view = me.up('pagedlist');

        Ext.create('App.View.Access.Request.Window', {
            appCode: rec.application.AppCode,
            userId: rec.application.UserId,
            loginId: BIACore.Security.Session.userId,
            view: view
        }).show();
    }
});