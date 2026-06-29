Ext.define('App.Controller.Component.ListToolbar', {
    extend: 'Ext.app.Controller',
    refs: [
        { selector: 'App-View-Content-Container[hidden=false][rendered=true]', ref: 'Content' }
    ],
    init: function init() {
        this.control({
            'App-View-Component-ListToolbar-Container': {
                beforerender: this.BeforeRender
            },
            'App-View-Component-ListToolbar-Container segmentedbutton[filterProperty]': {
                change: this.SegmentedButtonChange
            }
        });

        this.refreshListTask = new Ext.util.DelayedTask(function () {
            this.RefreshList();
        }, this);
    },
    BeforeRender: function BeforeRender(me) {
        this.setDefaultValues(me);
    },
    SegmentedButtonChange: function SegmentedButtonChange(me, value) {
        var list = me.up('App-View-Component-List-Container'),
            view = list.down('BIA-Components-PagedList');

        if (Ext.isEmpty(value)) {
            this.setDefaultValues(list.down('App-View-Component-ListToolbar-Container'));
        } else if (view && me.filterProperty) {
            var params = {};

            params[me.filterProperty] = value.length == 1 ? value[0] : null;

            view.store.getProxy().extraParams = Ext.apply(view.store.getProxy().extraParams, params);
            if (me.rendered) {
                this.refreshListTask.delay(1000);
            }
        }
    },
    setDefaultValues: function setDefaultValues(toolbar) {
        var list = toolbar.up('App-View-Component-List-Container');

        if (list.filterValues) {
            for (var f in list.filterValues) {
                var filter = toolbar.down('segmentedbutton[filterProperty="' + f + '"]');
                if (filter) {
                    //var btns = filter.query('button');
                    //var matchingBtn = Ext.Array.findBy(btns, function (b) { return b.value == list.filterValues[f]; });
                    //if (matchingBtn) matchingBtn.setConfig({ pressed: true });
                    //else filter.down('>[hidden=false]').setConfig({ pressed: true });
                    filter.setValue(list.filterValues[f]);
                }
            }
        }
    },
    RefreshList: function RefreshList() {
        var content = this.getContent(),
            list = content ? content.down('App-View-Component-List-Container') : null,
            view = list ? list.down('BIA-Components-PagedList') : null;

        if (view) {
            view.changeCurrentPage(1);
            view.store.load();
        }
    }
});