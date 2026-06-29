Ext.define('App.Controller.Component.ClickIcon', {
    extend: 'Ext.app.Controller',

    init: function init() {

        this.control({
            '[clickIcon=true]': {
                afterrender: this.ClickIconAfterRender
            }
        });

    },

    ClickIconAfterRender: function ClickIconAfterRender(me) {
        if (me.getEl()) {
            me.getEl().addListener({
                click: {
                    fn: function fn(me) { me.fireEvent('clickicon', me); },
                    args: [me],
                    scope: this
                }
            });
        }
    }

});