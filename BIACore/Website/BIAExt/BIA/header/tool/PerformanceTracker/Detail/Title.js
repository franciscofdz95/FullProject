Ext.define('BIA.header.tool.PerformanceTracker.Detail.Title', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Detail-Title',
    xtype: 'BIAPerformanceTrackerDetailTitle',
    cls: 'BIAPerformanceTrackerDetailTitle',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'middle'
    },

    padding: 10,

    viewModel: {
        formulas: {
            getTitle: function (get) {
                var title = '';
                var detailWindow = this.getView().up('BIAPerformanceTrackerDetail');
                if (detailWindow && detailWindow.record && detailWindow.record.type) {
                    title = detailWindow.record.type == 'test' ? 'SQL Injection Test Detail' :
                        detailWindow.record.type == 'ajax' ? 'Ajax Detail' : 'Store Detail';
                }

                return title;
            },
            getRequestTime: function (get) {
                var requestTime = '';
                var detailWindow = this.getView().up('BIAPerformanceTrackerDetail');
                if (detailWindow && detailWindow.record && detailWindow.record.StartRequest) {
                    var value = detailWindow.record.StartRequest;
                    requestTime = BIA.util.Format.ConvertDateTimeToLocal(Ext.isDate(value) ? value : new Date(value), false, false, true, true, true, true);
                }

                return requestTime;
            }

        }
    },

    style: {
        fontSize: '18px',
        color: 'white',
        backgroundColor: '#689ed7'
    },

    defaults: {
        padding: 5
    },

    items: [
        {
            xtype: 'container',
            itemId: 'DetailTitleRoute',
            cls: 'DetailTitleRoute',
            width: '60%',
            bind: {
                html: '{getTitle}'
            }
        },
        {
            xtype: 'tbfill',
            flex: 1
        },
        {
            xtype: 'container',
            itemId: 'DetailTitleRequestTime',
            bind: {
                html: '{getRequestTime}'
            }
        },
        {
            xtype: 'container',
            itemId: 'DetailClose',
            padding: '5 0 5 5',
            html: '<i class="fa fa-times-circle" style="cursor: pointer;"></i>'
        }
    ]
});