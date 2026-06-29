Ext.define('App.View.Component.List.Item.Usage.Graph', {
    extend: 'Ext.chart.CartesianChart',
    alias: 'widget.App-View-Component-List-Item-Usage-Graph',

    cls: 'componentListItemUsageGraph',
    width: '100%',
    height: 30,
    style: { padding: '0' },
    padding: '0',
    border: false,
    store: {
        fields: [
            { name: 'Day', type: 'date' },
            { name: 'Hits', type: 'int' },
            { name: 'Type', type: 'string' },
            { name: 'Time', type: 'string' }
        ],
        data: [
        ]
    },
    insetPadding: { top: 3, left: 3, right: 3, bottom: 3 },
    innerPadding: { top: 8, left: 8, right: 8, bottom: 8 },
    axes: [
        {
            type: 'numeric',
            position: 'left',
            title: null,
            grid: false,
            hidden: true,
            fields: 'Hits',
            reconcileRange: true,
            minimum: 'auto',
            maximum: 'auto'
        },
        {
            type: 'category',
            position: 'bottom',
            title: null,
            grid: false,
            hidden: true,
            fields: 'Day'
        }
    ],
    series: [
        {
            type: 'line',
            axis: 'left',
            xField: 'Day',
            yField: 'Hits',
            marker: {
                type: 'circle',
                radius: 2,
                lineWidth: 1,
                fill: 'white'
            },
            selectionTolerance: 4,
            smooth: false,
            style: {
                lineWidth: 2,
                strokeStyle: '#C98400'
            },
            tooltip: {
                trackMouse: true,
                style: 'background: #fff',
                showDelay: 0,
                dismissDelay: 0,
                hideDelay: 0,
                maxWidth: 280,
                defaultAlign: 'b-t?',
                html: '',
                renderer: function (tooltip, storeItem, item) {
                    var dateFormat,
                        time = storeItem.data.Time,
                        type = storeItem.data.Type,
                        hits = storeItem.data.Hits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    switch (time) {
                        case 'D':
                            time = 'Day';
                            break;
                        case 'W':
                            time = 'Week Ending';
                            break;
                        case 'M':
                            time = 'Month';
                            break;
                        default:
                            time = 'Day';
                    }

                    switch (type) {
                        case 'H':
                            type = 'Hits';
                            break;
                        case 'L':
                            type = 'Logins';
                            break;
                        case 'E':
                            type = 'Errors';
                            break;
                        default:
                            type = 'Hits'
                    }

                    dateFormat = time == 'Month' ? 'n/y' : 'n/j/y';

                    tooltip.setHtml(time + ' ' + Ext.Date.format(storeItem.data.Day, dateFormat) + ': ' + hits + ' ' + type);
                }
            }
        }
    ]
});