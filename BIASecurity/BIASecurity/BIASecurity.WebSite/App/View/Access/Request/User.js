Ext.define('App.View.Access.Request.User', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Access-Request-User',

    cls: 'accessRequestUser',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/UserProfile'
        }
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
                { xtype: 'displayfield', fieldLabel: 'Emp. ID', plugins: { ptype: 'componentstorebind', dataField: 'EmployeeId' } },
                { xtype: 'displayfield', fieldLabel: 'SR ID', plugins: { ptype: 'componentstorebind', dataField: 'SRId', defaultValue: 'N/A' } }
            ]
        }
    ]
});