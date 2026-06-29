Ext.define('App.Controller.Access.List.Item.ReasonWindow', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Access-List-Item-ReasonWindow': {
                beforerender: this.BeforeRender
            }
        });
    },
    BeforeRender: function BeforeRender(me) {
        me.down('#ReasonLabel').setHtml("Request Reason: " + me.access.RequestReason + "<br/>Request Age: " + me.access.StatusDateAge + " Days");
    }
});