Ext.define('App.View.Content.Initial', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Content-Initial',
    xtype: 'contentInitial',

    //biaPageView: true,
    //biaPageViewTitle: 'InitialLanding',

    cls: 'Card',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },


    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center'
            },
            style: {
                fontSize: '25px',
                fontWeight: 'bold',
                //backgroundColor: '#3892d3'
                backgroundColor: '#AAA'
            },
            //height: 50,
            items: [
                { xtype: 'tbfill', flex: 1 },
                {
                    xtype: 'container',
                    margin: 15,
                    html: 'BIA Security Application'
                },
                { xtype: 'tbfill', flex: 1 }
            ],
            margin: '0 0 10'
        },
        {
            xtype: 'container',
            flex: 1,
            margin: '0 15',
            items: [
                {
                    xtype: 'container',
                    html: 'This application is intended as the BIA User Maintenance application replacement.  At this time, not all areas of the application are available.' +
                    '<br><br>The following areas are currently available: '
                },
                {
                    xtype: 'container',
                    width: 300,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        margin: '8 15 0'
                    },
                    items: [
                        { xtype: 'App-View-Connections-MenuItem' },
                        { xtype: 'App-View-Admin-ActiveUser-MenuItem' },
                        { xtype: 'App-View-Admin-Logs-MenuItem' },
                        { xtype: 'App-View-Admin-ADSM-MenuItem' },
                        { xtype: 'App-View-Admin-ComponentCatalog-MenuItem' },
                        { xtype: 'App-View-Admin-News-MenuItem' }
                    ]
                },
                { xtype: 'container', html: '** NOTE: Application Dataset Monitor (ADSM) tool has been retired **', margin: '8 0' }
            ]
        }
    ]
});