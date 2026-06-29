Ext.define('App.Controller.Plugin.Component.BorderFloatingTitle', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            '[borderFloatingTitle]': {
                afterrender: this.ComponentAfterRender
            },
            'container[borderFloatingTitleContainer=true]': {
                afterlayout: this.TitleContainerAfterLayout
            }
        });
    },
    ComponentAfterRender: function ComponentAfterRender(me) {
        me.down('container[borderFloatingTitleContainer=true]').show();
    },
    TitleContainerAfterLayout: function TitleContainerAfterLayout(me) {
        var win = me.up('window');
        if (win) {
        //    me.alignTo(me.floatParent.el, me.defaultAlign);
        //    me.setPosition(0, -8);
            me.addManagedListener(win, 'afterlayout', this.TitleContainerAfterLayout, this, { single: true, args: [me] });
        }
    }
});