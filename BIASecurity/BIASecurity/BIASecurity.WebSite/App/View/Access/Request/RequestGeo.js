Ext.define('App.View.Access.Request.RequestGeo', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Access-Request-RequestGeo',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'container',
            layout: {
                type: 'column'
            },
            defaults: {
                labelWidth: 80,
                minHeight: 25,
                padding: '5 5',
                columnWidth: 0.5
            },
            items: [
                { xtype: 'displayfield', fieldLabel: 'Geo Group', dataField: 'geoGroupCode' },
                { xtype: 'displayfield', fieldLabel: 'Geo Code', dataField: 'geoCodeName' }
            ]
        }
    ]
});