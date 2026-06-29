Ext.define('App.View.Access.View.Summary', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Access-View-Summary',

    cls: 'accessViewSummary',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/AccessSummary'
        }
    },

    items: [
        {
            xtype: 'container',
            plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Info' },
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            items: [
                {
                    xtype: 'label', fieldLabel: 'First Name', labelAlign: 'top', itemId: 'FirstName', margin: '0 10 0 0', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'FirstName' }
                },
                {
                    xtype: 'label', fieldLabel: 'Last Name', labelAlign: 'top', itemId: 'LastName', margin: '0 10 0 0', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'LastName' }
                },
                {
                    xtype: 'label', fieldLabel: 'Application Code', labelAlign: 'top', itemId: 'AppCode', margin: '0 10 0 0', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'AppCode' }
                },
                {
                    xtype: 'label', fieldLabel: 'Application Name', labelAlign: 'top', itemId: 'AppName', margin: '0 10 0 0', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'AppName' }
                },
                {
                    xtype: 'label', fieldLabel: 'Business Unit', labelAlign: 'top', itemId: 'BusinessUnitId', margin: '0 10 0 0', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'BusinessUnitId' }
                },
                {
                    xtype: 'label', fieldLabel: 'Geo Group', labelAlign: 'top', itemId: 'GeoGroupCode', margin: '0 10 0 0', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'GeoGroupCode' }
                },
                {
                    xtype: 'label', fieldLabel: 'Geo Code', labelAlign: 'top', itemId: 'GeoCode', margin: '0 10 0 0', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'GeoCode' }
                },
                {
                    xtype: 'label', fieldLabel: 'Geo Id', labelAlign: 'top', itemId: 'GeoId', margin: '0 10 0 0', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'GeoId' }
                }


            ]
        },
        {
            xtype: 'container',
            plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Request History' },
            flex: 2,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            items: []
        }

    ]
});