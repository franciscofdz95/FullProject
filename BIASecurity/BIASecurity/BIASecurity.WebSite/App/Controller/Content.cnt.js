Ext.define('App.Controller.Content', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        var me = this;

        me.control({
            'App-View-Content-Initial [allowClick=true]': {
                beforerender: this.InitialAllowClickBeforeRender
            }
        });
        me.listen({});
    },
    InitialAllowClickBeforeRender: function InitialAllowClickBeforeRender(me, eOpts) {
        me.addListener({
            click: {
                element: 'el',
                fn: this.InitialAllowClick,
                scope: this,
                args: [me]
            }
        });
    },
    InitialAllowClick: function InitialAllowClick(me, event, el, eOpts) {
        if (me.eventToFire) {
            BIA.Components.DeepLink.addEventHistory(me.eventToFire.eventName, me.eventToFire.params);
        }
    }
});