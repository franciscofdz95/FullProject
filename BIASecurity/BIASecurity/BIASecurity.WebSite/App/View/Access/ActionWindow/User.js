Ext.define('App.View.Access.ActionWindow.User', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Access-ActionWindow-User',

    cls: 'accessActionwindowUser',
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
                { xtype: 'displayfield', fieldLabel: 'First Name', plugins: { ptype: 'componentstorebind', dataField: 'FirstName' } },
                { xtype: 'displayfield', fieldLabel: 'Last Name', plugins: { ptype: 'componentstorebind', dataField: 'LastName' } },
                { xtype: 'displayfield', fieldLabel: 'AD ID', plugins: { ptype: 'componentstorebind', dataField: 'ADID' } },
                { xtype: 'displayfield', fieldLabel: 'SR ID', plugins: { ptype: 'componentstorebind', dataField: 'SRID', defaultValue: 'N/A' } }
            ]
        }
    ]
});