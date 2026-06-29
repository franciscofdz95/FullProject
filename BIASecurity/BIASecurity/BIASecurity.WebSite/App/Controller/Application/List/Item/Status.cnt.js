Ext.define('App.Controller.Application.List.Item.Status', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        var me = this;

        me.control({
            'App-View-Application-List-Item-Status App-View-Component-List-Item-ConditionalIcon': {
                click: this.QuickSettingClick
            }
        });
        me.listen({});
    },
    QuickSettingClick: function QuickSettingClick(me) {
        var pagedlist = me.up('[itemXtype]');
        if (BIACore.Security.User.isSA() && pagedlist) {
            var row = me.up(pagedlist.itemXtype);
            if (row && row[pagedlist.itemRecordAttribute] != null) {
                var rec = row[pagedlist.itemRecordAttribute],
                    newVal = (rec[me.iconProperty] + 1) % me.icons.length;

                if (me.iconProperty == 'Active' && newVal == 0) {
                    var win = Ext.create('App.View.Application.List.Item.Status.OfflineWindow', {
                        saveFn: this.saveQuickSetting,
                        itemIcon: me,
                        itemRec: rec
                    });
                    win.show();
                } else if (me.msg) {
                    Ext.Msg.confirm('Confirm', me.msg[newVal], function (buttonId) {
                        if (buttonId == 'yes') {
                            this.saveQuickSetting(me, rec, me.iconProperty, newVal);
                        }
                    }, this);
                } else {
                    this.saveQuickSetting(me, rec, me.iconProperty, newVal);
                }
            }
        }
    },
    saveQuickSetting: function saveQuickSetting(icon, rec, property, value, value2) {
        BIA.Ajax.request({
            url: 'api/BIASecurity/UpdateApplicationQuickSetting',
            method: 'POST',
            jsonData: {
                appCode: rec['AppCode'],
                property: property,
                value: value,
                value2: value2
            },
            failure: function (response, request) {
                Ext.Msg.alert('Failed', 'Save failed');
            },
            scope: this
        });

        rec[property] = value;
        icon.fireEvent('datachanged', icon, value);
    }
});