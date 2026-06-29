Ext.define('App.Controller.Component.List.TypeToggleButtons', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Component-List-TypeToggleButtons #ListTypeToggleButtonViewToggle': {
                beforerender: this.ViewToggleBeforeRender
            },
            'App-View-Component-List-TypeToggleButtons #ListTypeToggleButtonViewToggle button': {
                toggle: this.ListTypeToggle
            }
        });
    },
    ViewToggleBeforeRender: function ViewToggleBeforeRender(me) {
        var btns = me.query('button');
        var cnt = me.up('App-View-Component-List-TypeToggleButtons');
        if (cnt) {
            for (var i = 0; i < btns.length; i++) {
                if (cnt[btns[i].hideProperty] === true) btns[i].hide();
                else btns[i].show();
            }
        }

        var pagedlist = me.up('pagedlist');
        if (pagedlist) {
            var matchingBtn = Ext.Array.findBy(btns, function (b) { return pagedlist[b.xtypeProperty] == pagedlist.itemXtype; });
            if (matchingBtn) matchingBtn.setConfig({ pressed: true });
            else me.down('>[hidden=false]').setConfig({ pressed: true });
        }
    },
    ListTypeToggle: function ListTypeToggle(me, isPressed) {
        if (isPressed && me.rendered) {
            var pagedlist = me.up('pagedlist');
            if (pagedlist && !Ext.isEmpty(pagedlist[me.xtypeProperty])) {
                if (me.up('[doDeepLink]')) {
                    me.up('[doDeepLink]').doDeepLink(pagedlist[me.xtypeProperty]);
                }
                else return false;
            }
        }
    }
});