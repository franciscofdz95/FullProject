Ext.define('App.View.Access.View', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Access-View',

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
    loadStoreOnInit: true,
    getAccessOnStoreLoad: true,

    defaults: { margin: '0 10 10' },
    items: [
        {
            xtype: 'container',
            
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            defaults: { margin: '10 10 0 0' },
            items: [
                {
                    plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Info' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'First Name', labelAlign: 'top', itemId: 'FirstName', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'FirstName' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Last Name', labelAlign: 'top', itemId: 'LastName', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'LastName' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Application Code', labelAlign: 'top', itemId: 'AppCode', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'application_code' }
                },
                //{
                //    xtype: 'label', fieldLabel: 'Application Name', labelAlign: 'top', itemId: 'AppName', margin: '0 10 0 0', labelWidth: 100, editable: false,
                //    plugins: { ptype: 'componentstorebind', dataField: 'AppName' }
                //},
                {
                    xtype: 'textfield', fieldLabel: 'Business Unit', labelAlign: 'top', itemId: 'BusinessUnitId', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'businessUnitID' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Geo Group', labelAlign: 'top', itemId: 'GeoGroupCode', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'geoGroupCode' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Geo Code', labelAlign: 'top', itemId: 'GeoCode', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'geoCode' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Geo Id', labelAlign: 'top', itemId: 'GeoId', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'geoID' }
                }


            ]
        },
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            defaults: { margin: '10 10 0 0' },
            items: [
                { plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Request History' } }
            ]
        }

    ]
});