Ext.define('App.Controller.Component.List.Item.ConditionalIcon', {
    extend: 'Ext.app.Controller',

    init: function init() {


        this.control({
            'App-View-Component-List-Item-ConditionalIcon': {
                beforerender: this.ListItemConditionalIconBeforeRender,
                afterrender: this.ListItemConditionalIconAfterRender,
                datachanged: this.DataChanged
            }
        });
    },
    ListItemConditionalIconBeforeRender: function ListItemConditionalIconBeforeRender(me) {
        this.updateIcon(me);
    },
    ListItemConditionalIconAfterRender: function ListItemConditionalIconAfterRender(me) {
        me.getEl().on('click', function (event, target) {
            me.fireEvent('click', me);
        });
    },
    DataChanged: function DataChanged(me, value) {
        this.updateIcon(me);
    },
    updateIcon: function updateIcon(me) {
        var pagedlist = me.up('[itemXtype]');
        if (pagedlist) {
            var row = me.up(pagedlist.itemXtype)
            if (row && row[pagedlist.itemRecordAttribute][me.iconProperty] != null) {
                var iconHtml = me.icons[row[pagedlist.itemRecordAttribute][me.iconProperty]] || '';
                if (me.dynamicQtip) {
                    iconHtml = iconHtml.replace(me.dynamicQtip.replaceString, row[pagedlist.itemRecordAttribute][me.dynamicQtip.replaceProperty]);
                }
                me.setConfig({ html: iconHtml });
            }
        }
    }
});