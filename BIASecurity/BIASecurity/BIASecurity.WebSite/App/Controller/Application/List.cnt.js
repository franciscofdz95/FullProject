Ext.define('App.Controller.Application.List', {
    extend: 'Ext.app.Controller',
    refs: [
        { selector: 'App-View-Content-Container[hidden=false][rendered=true]', ref: 'Content' }
    ],
    init: function init() {
        var me = this;

        me.control({
            'App-View-Application-List': {
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
            list = content.down('App-View-Application-List');

        if (list) {
            list.searchDisplay = args.searchDisplay;
            this.setTitle(list);
        }
    },
    setTitle: function setTitle(me) {
        var viewTitle = me.down('#ApplicationListLevelToggleApp');

        if (!Ext.isEmpty(me.searchDisplay))
            viewTitle.setHtml('Application List&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Search: "' + me.searchDisplay + '")');
        else
            viewTitle.setHtml('Application List');
    }
});