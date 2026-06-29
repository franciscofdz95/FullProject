Ext.define('App.Controller.Application.AddEditView.Access', {
    extend: 'Ext.app.Controller',
    refs: [
        { selector: 'App-View-Content-Container[hidden=false][rendered=true]', ref: 'Content' }
    ],
    init: function init() {
        this.control({
            'App-View-Application-AddEditView-Access App-View-Access-List': {
                beforerender: this.BeforeRender
            }
        });
        this.listen({
            global: {
                pinChanged: this.PinChanged
            }
        });
    },
    BeforeRender: function BeforeRender(me) {
        var container = me.up('[appCode]'),
            view = me.down('pagedlist');

        view.store.getProxy().extraParams = Ext.apply(view.store.getProxy().extraParams, {
            appCode: container.appCode
        });
    },
    PinChanged: function PinChanged(pinParams) {
        var content = this.getContent(),
            list = content.down('App-View-Application-AddEditView-Access App-View-Access-List');

        if (list) {
            var view = list.down('pagedlist');

            if (pinParams.pinGroup != 'User') {
                pinParams.pinGroup = null;
                pinParams.pinValue = null;
            }

            view.store.getProxy().extraParams = Ext.apply(view.store.getProxy().extraParams, pinParams);
            view.changeCurrentPage(1);
            view.store.load();
        }
    }
});