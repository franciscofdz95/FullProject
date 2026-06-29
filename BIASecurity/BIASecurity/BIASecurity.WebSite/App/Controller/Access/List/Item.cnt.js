Ext.define('App.Controller.Access.Item', {
    extend: 'Ext.app.Controller',

    init: function init() {
        var me = this;

        me.control({
            'App-View-Access-List-ItemList': {
                beforerender: this.BeforeRender
            },
            'App-View-Access-List-ItemList': {
                //afterrender: this.ListItemAfterRender
            }
        });
        me.listen({});
    },
    BeforeRender: function BeforeRender(me) {
        if (!me.header) {
            me.down('#ReasonContainer').setHidden(me.access.Access != 'Pending');
        }
    }/*,
    ListItemDblClick: function ListItemDblClick(me) {
        Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', {
            xtype: 'App-View-Access-View',
            accessId: me.access.AccessId,
            formType: 'View'
        });
    },
    ListItemAfterRender: function ListItemAfterRender(me) {
        me.getEl().addListener({
            dblclick: {
                fn: this.ListItemDblClick,
                scope: this,
                args: [me]
            }
        });
    }*/
});
