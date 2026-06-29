Ext.define('App.Controller.User.List', {
    extend: 'Ext.app.Controller',
    refs: [
        { selector: 'App-View-Content-Container[hidden=false][rendered=true]', ref: 'Content' }
    ],
    init: function init() {
        var me = this;

        me.control({
            'App-View-User-List': {
                beforerender: this.BeforeRender
            }
        });
        me.listen({
            global: {
                searchChanged: this.SearchChanged
            }
        });
    },
    BeforeRender: function BeforeRender(me) {
        this.setTitle(me);
    },
    SearchChanged: function SearchChanged(args) {
        var content = this.getContent(),
            list = content.down('App-View-User-List');

        if (list) {
            list.searchDisplay = args.searchDisplay;
            this.setTitle(list);
        }
    },
    setTitle: function setTitle(me) {
        var viewTitle = me.down('#viewTitle');

        if (!Ext.isEmpty(me.searchDisplay))
            viewTitle.setHtml('User List&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Search: "' + me.searchDisplay + '")');
        else
            viewTitle.setHtml('User List');
    }
});