Ext.define('App.Controller.Component.List.Item.Usage', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            '[header=false] App-View-Component-List-Item-Usage': {
                beforerender: this.UsageBeforeRender
            },
            'App-View-Component-List-Item-Usage-Graph': {
                beforerender: this.UsageGraphBeforeRender
            },
            'App-View-Component-List-Item-Usage segmentedbutton': {
                toggle: this.UsageButtonsToggle
            }
        });
    },
    UsageBeforeRender: function UsageBeforeRender(me) {
        var pagedlist = me.up('pagedlist');
        if (pagedlist) {
            var typeToggleButtons = pagedlist.down('App-View-Component-List-TypeToggleButtons');
            if (typeToggleButtons) {
                var pressedButton = typeToggleButtons.down('button[pressed]'),
                    usageButtons = me.query('#componentListItemUsageButtons segmentedbutton'),
                    graph = me.down('App-View-Component-List-Item-Usage-Graph');
                if (pressedButton && graph) {
                    //if (pressedButton.xtypeProperty == 'gridItemXtype') {
                    //    (me.down('#componentListItemUsageButtons') || { hide: Ext.emptyFn }).hide();
                    //}
                    //else if (pressedButton.xtypeProperty == 'listItemXtype') {
                    if (pressedButton.xtypeProperty == 'listItemXtype') {
                        graph.setHeight(40);
                    }
                    else if (pressedButton.xtypeProperty == 'detailItemXtype') {
                        me.setConfig({ maxWidth: 300, maxHeight: 60 });
                        graph.setHeight(60);
                        usageButtons.forEach(function (ub) { ub.show(); });
                    }
                }
            }
        }
    },
    UsageGraphBeforeRender: function UsageGraphBeforeRender(me, time, type) {

        var parm = me.up('[application]');

        if (parm.application.AppCode != "App Code")
        {
            BIA.Ajax.request({
                url: 'api/BIASecurity/AppListUsageGraph',
                jsonData: {
                    appCode: parm.application.AppCode,
                    time: time === undefined ? 'd' : time,
                    usage: type === undefined ? 'h' : type
                },
                callback: function callback(request, success, response) {
                    if (success) {
                        var responseJSON = Ext.JSON.decode(response.responseText);
                        if (responseJSON) {
                            var length = responseJSON.total;

                            for (var i = 0; i < length; i++) {
                                me.store.add({
                                    Day: responseJSON.data[i].EventDT, Hits: responseJSON.data[i].cnt,
                                    Type: responseJSON.data[i].CntType, Time: responseJSON.data[i].Time
                                });
                            }
                        }
                    }
                }
            });



        }
    },
    UsageButtonsToggle: function UsageButtonsToggle(me, button, isPressed) {
        var parent = me.up('App-View-Component-List-Item-Usage'),
            timeToggle = parent.down('App-View-Component-List-Item-Usage-TimeToggle').getValue(),
            typeToggle = parent.down('App-View-Component-List-Item-Usage-TypeToggle').getValue();

        switch (timeToggle) {
            case 0:
                timeToggle = 'D';
                break;
            case 1:
                timeToggle = 'W';
                break;
            case 2:
                timeToggle = 'M';
                break;
            default:
                timeToggle = 'D';
        }

        switch (typeToggle) {
            case 0:
                typeToggle = 'H';
                break;
            case 1:
                typeToggle = 'L';
                break;
            case 2:
                typeToggle = 'E';
                break;
            default:
                typeToggle = 'H'
        }

        if (isPressed === true) {
            var cnt = me.up('App-View-Component-List-Item-Usage');
            if (cnt) {
                var usage = cnt.down('App-View-Component-List-Item-Usage-Graph');
                if (usage) {
                    usage.store.removeAll();
                    this.UsageGraphBeforeRender(usage, timeToggle, typeToggle);
                    usage.redraw();
                }
            }
        }
    }
});