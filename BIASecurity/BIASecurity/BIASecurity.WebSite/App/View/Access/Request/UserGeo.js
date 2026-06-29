Ext.define('App.View.Access.Request.UserGeo', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Access-Request-UserGeo',

    cls: 'Chip',
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'start'
    },
    height: 35,
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/UserProfileLocationList'
        }
    },
    defaults: { margin: '0 10 0 0' },
    items: [
        { xtype: 'label', dataField: 'Region', preText: 'RR:' },
        { xtype: 'label', dataField: 'District', preText: 'DD:' },
        { xtype: 'label', dataField: 'Center', preText: 'CR:' },
        { xtype: 'label', dataField: 'Country', preText: 'CN:', margin: 0 }
    ]
});