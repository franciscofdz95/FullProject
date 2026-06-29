Ext.define('App.Controller.User.AddEditView.Access', {
    extend: 'Ext.app.Controller',
    refs: [
        { selector: 'App-View-Content-Container[hidden=false][rendered=true]', ref: 'Content' }
    ],
    init: function init() {
        this.control({
            'App-View-User-AddEditView-Access App-View-Access-List': {
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
        var container = me.up('[user]'),
            view = me.down('pagedlist'),
            ADID = me.up('[ADID]');

        var adid = '';
        if (container) adid = container.user.ADID
        else if (ADID) adid = ADID.ADID;

        view.store.getProxy().extraParams = Ext.apply(view.store.getProxy().extraParams, {
            pinValue: adid,
            pinGroup: 'User'
        });
    },
    PinChanged: function PinChanged(pinParams) {
        var content = this.getContent(),
            list = content.down('App-View-User-AddEditView-Access App-View-Access-List');

        if (list) {
            var view = list.down('pagedlist');

            if (pinParams.pinGroup != 'Application') {
                pinParams.pinGroup = null;
                pinParams.pinValue = null;
            }

            view.store.getProxy().extraParams = Ext.apply(view.store.getProxy().extraParams, pinParams);
            view.changeCurrentPage(1);
            view.store.load();
        }
    }
});